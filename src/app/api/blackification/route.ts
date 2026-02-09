import { NextRequest, NextResponse } from 'next/server';

const XAI_API_KEY = process.env.XAI_API_KEY;

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 120000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!XAI_API_KEY) {
            return NextResponse.json(
                { error: 'xAI API key not configured. Please add XAI_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Parse the base64 data URL
        const dataUrlMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!dataUrlMatch) {
            return NextResponse.json(
                { error: 'Invalid image format. Expected base64 data URL.' },
                { status: 400 }
            );
        }

        const mimeType = dataUrlMatch[1];
        const base64Data = dataUrlMatch[2];

        // Check if image is too large (over 4MB base64 = ~3MB actual)
        if (base64Data.length > 4 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Image is too large. Please use an image under 3MB.' },
                { status: 400 }
            );
        }

        console.log(`Processing image: ${Math.round(base64Data.length / 1024)}KB base64`);

        // Convert base64 to a file for the multipart form
        const buffer = Buffer.from(base64Data, 'base64');
        const extension = mimeType.split('/')[1] || 'png';

        // Try the image edit endpoint first (preserves original features)
        const formData = new FormData();
        const blob = new Blob([buffer], { type: mimeType });
        formData.append('image', blob, `image.${extension}`);
        formData.append('prompt', 'ONLY darken the skin pigmentation to a deep brown/black African skin tone. DO NOT change anything else. Keep the EXACT same: face structure, bone structure, eye shape, eye color, nose shape, nose size, lip shape, lip size, facial proportions, wrinkles, freckles, moles, hair, hairstyle, hair color, eyebrows, expression, pose, angle, lighting, clothing, background, and every other detail. This is a color adjustment ONLY - like applying a darker skin filter. The person must remain 100% recognizable as the same individual.');
        formData.append('model', 'grok-2-image-edit');
        formData.append('n', '1');

        console.log('Attempting image edit with grok-2-image-edit...');

        let editResponse = await fetchWithTimeout('https://api.x.ai/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${XAI_API_KEY}`,
            },
            body: formData,
        }, 120000);

        // If grok-2-image-edit doesn't work, try other model names
        if (!editResponse.ok) {
            const errorText = await editResponse.text();
            console.log('grok-2-image-edit failed:', errorText);

            // Try with grok-2-image model
            const formData2 = new FormData();
            formData2.append('image', new Blob([buffer], { type: mimeType }), `image.${extension}`);
            formData2.append('prompt', 'ONLY darken the skin pigmentation to a deep brown/black African skin tone. DO NOT change anything else. Keep the EXACT same: face structure, bone structure, eye shape, eye color, nose shape, nose size, lip shape, lip size, facial proportions, wrinkles, freckles, moles, hair, hairstyle, hair color, eyebrows, expression, pose, angle, lighting, clothing, background, and every other detail. This is a color adjustment ONLY - like applying a darker skin filter. The person must remain 100% recognizable as the same individual.');
            formData2.append('model', 'grok-2-image');
            formData2.append('n', '1');

            console.log('Attempting image edit with grok-2-image...');

            editResponse = await fetchWithTimeout('https://api.x.ai/v1/images/edits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${XAI_API_KEY}`,
                },
                body: formData2,
            }, 120000);
        }

        // If image edit works, return the result
        if (editResponse.ok) {
            const editData = await editResponse.json();
            console.log('Image edit succeeded!');

            if (editData.data?.[0]?.url) {
                return NextResponse.json({
                    success: true,
                    transformedImage: editData.data[0].url
                });
            }

            if (editData.data?.[0]?.b64_json) {
                return NextResponse.json({
                    success: true,
                    transformedImage: `data:image/png;base64,${editData.data[0].b64_json}`
                });
            }
        }

        // Log the edit error for debugging
        const editErrorText = await editResponse.text();
        console.log('Image edit endpoint not available or failed:', editErrorText);

        // Fallback: Use vision + generation approach (less accurate but works)
        console.log('Falling back to vision + generation approach...');

        const visionModels = ['grok-2-vision', 'grok-2-vision-1212', 'grok-2-vision-latest'];
        let visionResponse = null;
        let lastError = '';

        for (const modelName of visionModels) {
            try {
                const response = await fetchWithTimeout('https://api.x.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${XAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'image_url',
                                        image_url: {
                                            url: image
                                        }
                                    },
                                    {
                                        type: 'text',
                                        text: 'FIRST state if this is a MAN or WOMAN. Then in under 350 characters total, describe: their gender, approximate age, face shape, eye shape, nose type, lip shape, facial hair (if any), hair style/color, expression, clothing, and pose. Start with "A [man/woman]..." Be very specific about gender.'
                                    }
                                ]
                            }
                        ]
                    }),
                }, 60000);

                if (response.ok) {
                    visionResponse = await response.json();
                    console.log(`Vision model ${modelName} succeeded`);
                    break;
                } else {
                    lastError = await response.text();
                    console.log(`Vision model ${modelName} failed:`, lastError);
                }
            } catch (e) {
                console.log(`Vision model ${modelName} error:`, e);
                lastError = String(e);
            }
        }

        if (!visionResponse) {
            return NextResponse.json({
                success: false,
                error: `Image edit and vision models not available. Edit error: ${editErrorText}. Vision error: ${lastError}`
            });
        }

        const description = visionResponse.choices?.[0]?.message?.content;

        if (!description) {
            return NextResponse.json({
                success: false,
                error: 'Unable to analyze image - no description returned'
            });
        }

        // Truncate description and create a very specific prompt
        const truncatedDesc = description.substring(0, 600);

        // Use the description to generate a new image with the person having black skin
        const genResponse = await fetchWithTimeout('https://api.x.ai/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'grok-2-image',
                prompt: `${truncatedDesc} - but with dark African/black skin tone. Keep the EXACT same gender, face, features, hair, clothes, pose. Only change skin color to deep brown/black.`,
                n: 1,
                response_format: 'url'
            }),
        }, 120000);

        if (!genResponse.ok) {
            const genErrorText = await genResponse.text();
            console.error('xAI Image Generation error:', genErrorText);
            return NextResponse.json(
                { error: `xAI Image Generation error: ${genResponse.status} - ${genErrorText}` },
                { status: genResponse.status }
            );
        }

        const genData = await genResponse.json();

        if (genData.data?.[0]?.url) {
            return NextResponse.json({
                success: true,
                transformedImage: genData.data[0].url,
                note: 'Used generation fallback - edit endpoint not available'
            });
        }

        if (genData.data?.[0]?.b64_json) {
            return NextResponse.json({
                success: true,
                transformedImage: `data:image/png;base64,${genData.data[0].b64_json}`,
                note: 'Used generation fallback - edit endpoint not available'
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Unable to generate image - no image returned from API'
        });

    } catch (error: unknown) {
        console.error('Blackification API error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'Request timed out. The image processing took too long. Please try with a smaller image.' },
                    { status: 504 }
                );
            }
            if (error.message.includes('fetch failed') || error.message.includes('ECONNRESET')) {
                return NextResponse.json(
                    { error: 'Network error. Please check your connection and try again.' },
                    { status: 503 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';

const XAI_API_KEY = process.env.XAI_API_KEY;

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

        // Call xAI/Grok Imagine API to transform the image
        const response = await fetch('https://api.x.ai/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'grok-2-image',
                prompt: `Make the persons skin colour in the image, keep everything else and all other features exactly the same as the original image. All i want you to do is change the skin colour to black Here is the image: ${image}`,
                n: 1
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('xAI API error:', errorText);

            // Try with grok-2-image-generation model
            const altResponse = await fetch('https://api.x.ai/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'grok-2-image',
                    prompt: 'Generate an image of a person standing in front of a solid bright green background (#00FF00) like a green screen.',
                    n: 1
                }),
            });

            if (!altResponse.ok) {
                const altErrorText = await altResponse.text();
                console.error('xAI API alt error:', altErrorText);
                return NextResponse.json(
                    { error: `xAI API error: ${response.status} - ${errorText}` },
                    { status: response.status }
                );
            }

            const altData = await altResponse.json();
            if (altData.data?.[0]?.url || altData.data?.[0]?.b64_json) {
                return NextResponse.json({
                    success: true,
                    transformedImage: altData.data[0].url || `data:image/png;base64,${altData.data[0].b64_json}`
                });
            }
        }

        const data = await response.json();

        // Check if there's an image in the response
        if (data.data?.[0]?.url) {
            return NextResponse.json({
                success: true,
                transformedImage: data.data[0].url
            });
        }

        if (data.data?.[0]?.b64_json) {
            return NextResponse.json({
                success: true,
                transformedImage: `data:image/png;base64,${data.data[0].b64_json}`
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Unable to process image - no image returned from API'
        });

    } catch (error: unknown) {
        console.error('Blackification API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

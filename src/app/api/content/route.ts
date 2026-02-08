import { NextRequest, NextResponse } from 'next/server';
import factsData from '../../data/facts.json';
import timelineData from '../../data/timeline.json';
import quizData from '../../data/quiz.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const date = searchParams.get('date'); // Format: M-D (e.g., "2-8")

  try {
    switch (type) {
      case 'facts':
        return NextResponse.json({ facts: factsData.facts });

      case 'timeline':
        if (date) {
          const events = timelineData.events[date as keyof typeof timelineData.events] || 
                        timelineData.events.default;
          return NextResponse.json({ events });
        }
        return NextResponse.json({ events: timelineData.events.default });

      case 'quiz':
        // Return 5 random questions seeded by today's date
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const shuffled = [...quizData.questions].sort((a, b) => {
          const hashA = (a.id * seed) % 100;
          const hashB = (b.id * seed) % 100;
          return hashA - hashB;
        });
        return NextResponse.json({ questions: shuffled.slice(0, 5) });

      default:
        return NextResponse.json({
          facts: factsData.facts.slice(0, 5),
          timeline: timelineData.events.default,
          quiz: quizData.questions.slice(0, 5)
        });
    }
  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

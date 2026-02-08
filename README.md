# The Black History Chronicle

An interactive newspaper-styled website celebrating Black History Month, featuring an AI-powered chatbot with multiple cultural personas and daily educational content.

## Features

### AI Chatbot with 7 Unique Personas
- **Historian Narrator** - Documentary-style wisdom with scholarly gravitas
- **Morgan Freeman Mode** - Calm, philosophical storytelling
- **Jamaican Vibes** - Caribbean patois with positive energy
- **Unfiltered Real Talk** - Direct, no-nonsense conversation in AAVE
- **Southern Grandma** - Warm, loving wisdom and life lessons
- **Barbershop Mode** - Lively debate energy and confident opinions
- **Poetic Soul** - Spoken word and rhythmic expression

### Daily Content Sections
- **On This Day Timeline** - Historical events from today's date in Black history
- **Did You Know?** - Swipeable fact cards with surprising Black history facts
- **Daily Quiz** - 5 questions that change each day
- **Photo Gallery** - Filterable historical images by decade and topic

## Design

The website features a vintage cartoon newspaper aesthetic with:
- Thick comic-style borders
- Cream/sepia paper texture backgrounds
- Pan-African color accents (red, gold, green)
- Halftone image effects
- Hand-drawn style decorative elements
- Multi-column newspaper layouts

## Setup

### Prerequisites
- Node.js 18+ installed
- Anthropic API key for the chatbot

### Installation

1. Navigate to the project directory:
   ```bash
   cd black-history-temp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. Get your Anthropic API key from: https://console.anthropic.com/

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API
- **Animations**: Framer Motion
- **Carousel**: Embla Carousel
- **Icons**: Lucide React
- **Fonts**: Playfair Display, EB Garamond, Special Elite

## Project Structure

```
src/app/
├── api/
│   ├── chat/route.ts       # Claude AI integration
│   └── content/route.ts    # Content API
├── components/
│   ├── ChatBot.tsx         # Main chat interface
│   ├── ModeSelector.tsx    # Persona selector
│   ├── Masthead.tsx        # Newspaper header
│   ├── Timeline.tsx        # On This Day section
│   ├── FactCards.tsx       # Swipeable facts
│   ├── QuizSection.tsx     # Daily quiz
│   ├── PhotoGallery.tsx    # Image gallery
│   └── NewspaperBorder.tsx # Decorative wrapper
├── data/
│   ├── facts.json          # Curated facts
│   ├── timeline.json       # Historical events
│   └── quiz.json           # Quiz questions
├── globals.css             # Newspaper styling
├── layout.tsx              # Root layout
└── page.tsx                # Main page
```

## Customization

### Adding More Content

Edit the JSON files in `src/app/data/`:
- `facts.json` - Add more historical facts
- `timeline.json` - Add events for specific dates (format: "M-D")
- `quiz.json` - Add more quiz questions

### Modifying Personas

Edit the `systemPrompts` object in `src/app/api/chat/route.ts` to customize how each persona responds.

## License

This project was created for educational purposes to celebrate Black History Month.

---

*"Celebrating Our Heritage, Educating Our Future"*

import Masthead from './components/Masthead';
import ChatBot from './components/ChatBot';
import Timeline from './components/Timeline';
import FactCards from './components/FactCards';
import QuizSection from './components/QuizSection';
import PhotoGallery from './components/PhotoGallery';
import SocialBar from './components/SocialBar';
import Preloader from './components/Preloader';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Newspaper Preloader */}
      <Preloader />
      {/* Social Bar - Fixed at top */}
      <SocialBar 
        contractAddress="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        twitterUrl="https://twitter.com"
        telegramUrl="https://t.me"
        dexUrl="https://dexscreener.com"
      />

      {/* Newspaper outer frame */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* Masthead - Newspaper Header */}
        <Masthead />
        
        {/* Main Content Area */}
        <main className="space-y-10 md:space-y-16">
          
          {/* HEADLINE: AI Chatbot Section */}
          <section>
            <div className="text-center mb-6">
              <h2 className="headline text-2xl md:text-4xl mb-2">SPEAK WITH THE ANCESTORS</h2>
              <p className="subheadline text-[var(--ink-faded)]">
                An AI-Powered Conversation Experience
              </p>
              <div className="newspaper-divider max-w-md mx-auto"></div>
            </div>
            <ChatBot />
          </section>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
            <span className="text-2xl">✦</span>
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
          </div>

          {/* ON THIS DAY Timeline */}
          <section>
            <div className="text-center mb-6">
              <span className="bg-[var(--accent-red)] text-white px-4 py-1 text-sm uppercase tracking-wider">
                Historical Record
              </span>
              <h2 className="headline text-2xl md:text-4xl mt-4 mb-2">ON THIS DAY IN BLACK HISTORY</h2>
              <p className="body-text text-[var(--ink-faded)] max-w-2xl mx-auto">
                Discover the remarkable events, achievements, and milestones that occurred on this very date throughout history.
              </p>
            </div>
            <Timeline />
          </section>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
            <span className="text-2xl">◆</span>
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
          </div>

          {/* DAILY FACTS Carousel */}
          <section>
            <div className="text-center mb-6">
              <span className="bg-[var(--accent-gold)] text-[var(--ink-black)] px-4 py-1 text-sm uppercase tracking-wider font-bold">
                Daily Edition
              </span>
              <h2 className="headline text-2xl md:text-4xl mt-4 mb-2">DID YOU KNOW?</h2>
              <p className="body-text text-[var(--ink-faded)] max-w-2xl mx-auto">
                Swipe through fascinating facts that celebrate the contributions and achievements of Black Americans.
              </p>
            </div>
            <FactCards />
          </section>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
            <span className="text-2xl">★</span>
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
          </div>

          {/* QUIZ Section */}
          <section>
            <div className="text-center mb-6">
              <span className="bg-[var(--accent-green)] text-white px-4 py-1 text-sm uppercase tracking-wider">
                Puzzle Corner
              </span>
              <h2 className="headline text-2xl md:text-4xl mt-4 mb-2">TEST YOUR KNOWLEDGE</h2>
              <p className="body-text text-[var(--ink-faded)] max-w-2xl mx-auto">
                Challenge yourself with our daily quiz on Black history and culture.
              </p>
            </div>
            <QuizSection />
          </section>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
            <span className="text-2xl">✦</span>
            <div className="flex-1 h-[3px] bg-[var(--ink-black)]"></div>
          </div>

          {/* PHOTO GALLERY */}
          <section>
            <div className="text-center mb-6">
              <span className="bg-[var(--ink-black)] text-[var(--paper-cream)] px-4 py-1 text-sm uppercase tracking-wider">
                Photo Archive
              </span>
              <h2 className="headline text-2xl md:text-4xl mt-4 mb-2">MOMENTS IN TIME</h2>
              <p className="body-text text-[var(--ink-faded)] max-w-2xl mx-auto">
                Browse our curated collection of historical photographs documenting pivotal moments in Black history.
              </p>
            </div>
            <PhotoGallery />
          </section>

        </main>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t-4 border-double border-[var(--ink-black)]">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-8 h-[2px] bg-[var(--ink-black)]"></div>
              <span className="headline text-lg">THE BLACK HISTORY CHRONICLE</span>
              <div className="w-8 h-[2px] bg-[var(--ink-black)]"></div>
            </div>
            <p className="typewriter text-sm text-[var(--ink-faded)] mb-2">
              Celebrating Black History Month {new Date().getFullYear()}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="w-3 h-3 bg-[var(--accent-red)]"></span>
              <span className="w-3 h-3 bg-[var(--accent-gold)]"></span>
              <span className="w-3 h-3 bg-[var(--accent-green)]"></span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

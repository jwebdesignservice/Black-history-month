'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Lightbulb, Quote } from 'lucide-react';
import NewspaperBorder from './NewspaperBorder';

interface Fact {
  id: number;
  category: string;
  title: string;
  fact: string;
  source?: string;
  year?: number;
}

const facts: Fact[] = [
  {
    id: 1,
    category: "Invention",
    title: "The Traffic Light",
    fact: "Garrett Morgan, a Black inventor, patented the three-position traffic signal in 1923. His design was the precursor to modern traffic lights used worldwide today.",
    year: 1923
  },
  {
    id: 2,
    category: "Science",
    title: "Blood Banks",
    fact: "Dr. Charles Drew pioneered methods of storing blood plasma for transfusion and organized the first large-scale blood bank in the US. His research saved countless lives during WWII.",
    year: 1940
  },
  {
    id: 3,
    category: "Achievement",
    title: "First Black Billionaire",
    fact: "Robert L. Johnson became the first Black American billionaire in 2001 after selling BET (Black Entertainment Television) to Viacom for $3 billion.",
    year: 2001
  },
  {
    id: 4,
    category: "Culture",
    title: "The Harlem Renaissance",
    fact: "The Harlem Renaissance (1920s-1930s) was a cultural explosion that produced some of America's greatest literature, music, and art, including jazz and the works of Langston Hughes and Zora Neale Hurston."
  },
  {
    id: 5,
    category: "Invention",
    title: "The Super Soaker",
    fact: "Lonnie Johnson, a NASA engineer, invented the Super Soaker water gun in 1989. It became one of the top-selling toys in America and has generated over $1 billion in sales.",
    year: 1989
  },
  {
    id: 6,
    category: "History",
    title: "The Green Book",
    fact: "From 1936-1966, 'The Negro Motorist Green Book' helped Black travelers navigate safely through Jim Crow America, listing friendly businesses, hotels, and restaurants.",
    year: 1936
  },
  {
    id: 7,
    category: "Science",
    title: "Hidden Figures",
    fact: "Katherine Johnson, Dorothy Vaughan, and Mary Jackson were NASA mathematicians whose calculations were critical to early space missions, including John Glenn's orbital flight.",
    year: 1962
  },
  {
    id: 8,
    category: "Music",
    title: "Rock and Roll Origins",
    fact: "Rock and roll was pioneered by Black musicians like Chuck Berry, Little Richard, and Sister Rosetta Tharpe, whose guitar techniques and performance styles defined the genre.",
    year: 1950
  },
  {
    id: 9,
    category: "Achievement",
    title: "First Black Supreme Court Justice",
    fact: "Thurgood Marshall, who argued Brown v. Board of Education, became the first Black Supreme Court Justice in 1967, serving for 24 years.",
    year: 1967
  },
  {
    id: 10,
    category: "Invention",
    title: "The Home Security System",
    fact: "Marie Van Brittan Brown invented the first home security system in 1966, including closed-circuit television monitoring. Her patent laid groundwork for modern security technology.",
    year: 1966
  },
  {
    id: 11,
    category: "History",
    title: "The Black Wall Street",
    fact: "Greenwood District in Tulsa, Oklahoma was known as 'Black Wall Street' - a thriving, prosperous Black community destroyed in the 1921 Tulsa Race Massacre.",
    year: 1921
  },
  {
    id: 12,
    category: "Culture",
    title: "Hip Hop Origins",
    fact: "Hip hop was born in the Bronx in 1973 when DJ Kool Herc pioneered the breakbeat technique at a back-to-school party. It grew into a global cultural movement.",
    year: 1973
  }
];

export default function FactCards() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Invention': 'var(--accent-gold)',
      'Science': 'var(--accent-green)',
      'Achievement': 'var(--accent-red)',
      'Culture': '#9B59B6',
      'History': '#4A90A4',
      'Music': '#E67E22'
    };
    return colors[category] || 'var(--ink-black)';
  };

  return (
    <NewspaperBorder title="Did You Know?" variant="accent">
      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {facts.map((fact, index) => (
              <div 
                key={fact.id}
                className="flex-none w-full md:w-[80%] lg:w-[60%] px-4"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: selectedIndex === index ? 1 : 0.5,
                      scale: selectedIndex === index ? 1 : 0.9
                    }}
                    transition={{ duration: 0.3 }}
                    className="border-[3px] border-[var(--ink-black)] bg-white p-6 md:p-8 relative"
                    style={{ 
                      boxShadow: selectedIndex === index ? 'var(--shadow-cartoon)' : 'none',
                      transform: `rotate(${selectedIndex === index ? 0 : (index % 2 === 0 ? -1 : 1)}deg)`
                    }}
                  >
                    {/* Decorative tape effect */}
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[var(--accent-gold)] opacity-80"
                      style={{ transform: 'rotate(-2deg)' }}
                    ></div>

                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span 
                        className="px-3 py-1 text-white text-xs uppercase font-bold tracking-wider"
                        style={{ backgroundColor: getCategoryColor(fact.category) }}
                      >
                        {fact.category}
                      </span>
                      {fact.year && (
                        <span className="text-xs typewriter text-[var(--ink-faded)]">
                          circa {fact.year}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="headline text-xl md:text-2xl mb-4 flex items-start gap-3">
                      <Lightbulb className="flex-shrink-0 mt-1" style={{ color: getCategoryColor(fact.category) }} size={24} />
                      {fact.title}
                    </h3>

                    {/* Fact text */}
                    <div className="relative">
                      <Quote className="absolute -left-2 -top-2 opacity-20" size={32} />
                      <p className="body-text text-base md:text-lg leading-relaxed pl-4">
                        {fact.fact}
                      </p>
                    </div>

                    {/* Fact number */}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="typewriter text-xs text-[var(--ink-faded)]">
                        FACT #{fact.id} OF {facts.length}
                      </span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-[var(--accent-gold)]">★</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-3 border-[3px] border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--ink-black)] hover:text-[var(--paper-cream)] transition-colors disabled:opacity-50"
            style={{ boxShadow: 'var(--shadow-subtle)' }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {facts.slice(0, 6).map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-3 h-3 border-2 border-[var(--ink-black)] transition-colors ${
                  selectedIndex === index ? 'bg-[var(--accent-gold)]' : 'bg-transparent'
                }`}
              />
            ))}
            {facts.length > 6 && (
              <span className="text-[var(--ink-faded)]">...</span>
            )}
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-3 border-[3px] border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--ink-black)] hover:text-[var(--paper-cream)] transition-colors disabled:opacity-50"
            style={{ boxShadow: 'var(--shadow-subtle)' }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs typewriter text-[var(--ink-faded)] mt-4">
          ← Swipe or use arrows to explore more facts →
        </p>
      </div>
    </NewspaperBorder>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';
import NewspaperBorder from './NewspaperBorder';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  link?: string;
}

// Curated Black History events by month-day
const curatedEvents: Record<string, TimelineEvent[]> = {
  "2-1": [
    { year: 1902, title: "Langston Hughes Born", description: "Legendary poet and leader of the Harlem Renaissance was born in Joplin, Missouri." },
    { year: 1960, title: "Greensboro Sit-ins Begin", description: "Four Black college students began a sit-in at a segregated Woolworth's lunch counter." },
    { year: 1865, title: "13th Amendment Signed", description: "President Lincoln signed the resolution proposing the 13th Amendment to abolish slavery." }
  ],
  "2-2": [
    { year: 1948, title: "Truman's Civil Rights Message", description: "President Truman sent a special message to Congress on civil rights." },
    { year: 1897, title: "Alfred L. Cralle Patents Ice Cream Scoop", description: "Black inventor Alfred L. Cralle patented the ice cream scoop." }
  ],
  "2-3": [
    { year: 1870, title: "15th Amendment Ratified", description: "The 15th Amendment was ratified, prohibiting denial of voting rights based on race." },
    { year: 1956, title: "Autherine Lucy at University of Alabama", description: "Autherine Lucy became the first Black student to attend the University of Alabama." }
  ],
  "2-4": [
    { year: 1913, title: "Rosa Parks Born", description: "Civil rights activist Rosa Parks was born in Tuskegee, Alabama." },
    { year: 1794, title: "France Abolishes Slavery", description: "Revolutionary France became the first European power to abolish slavery." }
  ],
  "2-5": [
    { year: 1934, title: "Hank Aaron Born", description: "Baseball legend Hank Aaron was born in Mobile, Alabama." },
    { year: 1988, title: "Jesse Jackson Wins Primaries", description: "Jesse Jackson won presidential primaries in Alabama and Georgia." }
  ],
  "2-6": [
    { year: 1820, title: "First Great Migration", description: "86 free Black Americans sailed from New York to Sierra Leone, marking early African colonization." },
    { year: 1945, title: "Bob Marley Born", description: "Reggae legend Bob Marley was born in Nine Mile, Jamaica." }
  ],
  "2-7": [
    { year: 1926, title: "Negro History Week Begins", description: "Carter G. Woodson launched the first Negro History Week, precursor to Black History Month." },
    { year: 1990, title: "South African Ban Lifted", description: "The South African government lifted its ban on the African National Congress." }
  ],
  "2-8": [
    { year: 1968, title: "Orangeburg Massacre", description: "Three Black students were killed by South Carolina Highway Patrol during a protest." },
    { year: 1910, title: "Boy Scouts Integrated Vision", description: "The Boy Scouts of America was founded with a vision that would eventually include all races." }
  ],
  "2-9": [
    { year: 1944, title: "Alice Walker Born", description: "Pulitzer Prize-winning author Alice Walker was born in Eatonton, Georgia." },
    { year: 1986, title: "First Black Miss America Resigns", description: "Vanessa Williams, first Black Miss America, had resigned and later had remarkable comeback." }
  ],
  "2-10": [
    { year: 1992, title: "Alex Haley Passes", description: "Author of 'Roots' Alex Haley passed away, leaving an incredible literary legacy." },
    { year: 1927, title: "Leontyne Price Born", description: "Opera legend Leontyne Price was born in Laurel, Mississippi." }
  ],
  // Default events for days not specifically curated
  "default": [
    { year: 1619, title: "First Africans Arrive in America", description: "The first recorded Africans arrived in the English colonies at Point Comfort, Virginia." },
    { year: 1865, title: "End of Civil War", description: "The Civil War ended, beginning the era of Reconstruction." },
    { year: 1954, title: "Brown v. Board of Education", description: "Supreme Court ruled that racial segregation in public schools was unconstitutional." },
    { year: 1963, title: "March on Washington", description: "Over 250,000 gathered for the March on Washington, where MLK delivered 'I Have a Dream' speech." },
    { year: 2008, title: "Barack Obama Elected", description: "Barack Obama was elected as the 44th President, becoming the first Black president of the United States." }
  ]
};

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      
      const today = new Date();
      const monthDay = `${today.getMonth() + 1}-${today.getDate()}`;
      
      // Use curated events for today or default events
      const todaysEvents = curatedEvents[monthDay] || curatedEvents["default"];
      
      // Try to fetch additional events from Wikipedia On This Day API
      try {
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Filter for events that might be related to Black history
          const keywords = ['african', 'black', 'civil rights', 'slavery', 'segregation', 'naacp', 'negro', 'colored', 'race', 'racial', 'mlk', 'king jr', 'mandela', 'apartheid', 'emancipation', 'freedom', 'selma', 'montgomery'];
          
          const relevantEvents = data.events?.filter((event: { text: string }) => {
            const text = event.text.toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
          }).slice(0, 3).map((event: { year: number; text: string; pages?: Array<{ content_urls?: { desktop?: { page?: string } } }> }) => ({
            year: event.year,
            title: event.text.split('.')[0],
            description: event.text,
            link: event.pages?.[0]?.content_urls?.desktop?.page
          })) || [];

          // Combine Wikipedia results with curated events
          const combined = [...relevantEvents, ...todaysEvents];
          // Remove duplicates based on year
          const unique = combined.filter((event, index, self) =>
            index === self.findIndex(e => e.year === event.year)
          );
          setEvents(unique.slice(0, 6));
        } else {
          setEvents(todaysEvents);
        }
      } catch {
        // Fallback to curated events
        setEvents(todaysEvents);
      }
      
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <NewspaperBorder title="Historical Record">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin mr-3" size={24} />
          <span className="typewriter">Loading historical records...</span>
        </div>
      </NewspaperBorder>
    );
  }

  return (
    <NewspaperBorder title="Historical Record" variant="featured">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[3px] bg-[var(--ink-black)]"></div>

        <div className="space-y-6 md:space-y-8 pl-12 md:pl-20">
          {events.map((event, index) => (
            <motion.div
              key={`${event.year}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[2.5rem] md:-left-[3.5rem] top-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[var(--paper-cream)] border-[3px] border-[var(--ink-black)] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--accent-red)] rounded-full"></div>
                </div>
              </div>

              {/* Event card */}
              <div className="border-[3px] border-[var(--ink-black)] bg-white p-4 md:p-5 hover:shadow-[var(--shadow-cartoon)] transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[var(--ink-black)] text-[var(--paper-cream)] px-2 py-0.5 headline text-sm md:text-base">
                        {event.year}
                      </span>
                      <Calendar size={16} className="text-[var(--ink-faded)]" />
                    </div>
                    <h3 className="headline text-lg md:text-xl mb-2">{event.title}</h3>
                    <p className="body-text text-[var(--ink-faded)] text-sm md:text-base">
                      {event.description}
                    </p>
                  </div>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-red)] hover:text-[var(--ink-black)] transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[var(--ink-faded)]">
          <p className="text-center text-xs md:text-sm typewriter text-[var(--ink-faded)]">
            ◆ Events from this day in Black History ◆
          </p>
        </div>
      </div>
    </NewspaperBorder>
  );
}

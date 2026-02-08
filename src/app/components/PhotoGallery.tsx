'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Filter, Calendar, Tag } from 'lucide-react';
import NewspaperBorder from './NewspaperBorder';

interface Photo {
  id: number;
  title: string;
  description: string;
  year: number;
  decade: string;
  topic: string;
  imageUrl: string;
  credit: string;
}

// Using placeholder images - in production, these would be real historical images
const photos: Photo[] = [
  {
    id: 1,
    title: "March on Washington",
    description: "Over 250,000 people gathered at the Lincoln Memorial to hear Dr. Martin Luther King Jr.'s 'I Have a Dream' speech.",
    year: 1963,
    decade: "1950-1980",
    topic: "Civil Rights",
    imageUrl: "https://images.unsplash.com/photo-1569025743873-ea3a9ber457f?w=600&h=400&fit=crop",
    credit: "Historical Archive"
  },
  {
    id: 2,
    title: "Harlem Renaissance Artists",
    description: "The Harlem Renaissance brought an explosion of Black art, literature, and music that defined American culture.",
    year: 1925,
    decade: "1900-1950",
    topic: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop",
    credit: "Cultural Archives"
  },
  {
    id: 3,
    title: "Jackie Robinson Breaks Barriers",
    description: "Jackie Robinson became the first Black player in Major League Baseball, breaking the color barrier in 1947.",
    year: 1947,
    decade: "1900-1950",
    topic: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&h=400&fit=crop",
    credit: "Sports History Collection"
  },
  {
    id: 4,
    title: "Obama Inauguration",
    description: "Barack Obama was inaugurated as the 44th President of the United States, becoming the first Black president.",
    year: 2009,
    decade: "1980-present",
    topic: "Politics",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
    credit: "Presidential Archives"
  },
  {
    id: 5,
    title: "Tuskegee Airmen",
    description: "The Tuskegee Airmen were the first Black military aviators in the U.S. Army Air Corps during WWII.",
    year: 1943,
    decade: "1900-1950",
    topic: "Science",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    credit: "Military History Archives"
  },
  {
    id: 6,
    title: "Montgomery Bus Boycott",
    description: "After Rosa Parks' arrest, Black residents boycotted Montgomery buses for 381 days.",
    year: 1955,
    decade: "1950-1980",
    topic: "Civil Rights",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
    credit: "Civil Rights Museum"
  },
  {
    id: 7,
    title: "Jazz Age Innovation",
    description: "Black musicians revolutionized American music, creating jazz in New Orleans and spreading it nationwide.",
    year: 1920,
    decade: "1900-1950",
    topic: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop",
    credit: "Music Archives"
  },
  {
    id: 8,
    title: "Black Power Olympics",
    description: "Tommie Smith and John Carlos raised their fists in a Black Power salute at the 1968 Olympics.",
    year: 1968,
    decade: "1950-1980",
    topic: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1461896836934- voices-0ba47c1?w=600&h=400&fit=crop",
    credit: "Olympic Archives"
  },
  {
    id: 9,
    title: "Shirley Chisholm for President",
    description: "Shirley Chisholm became the first Black woman to seek a major party's nomination for President.",
    year: 1972,
    decade: "1950-1980",
    topic: "Politics",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    credit: "Political History Archives"
  },
  {
    id: 10,
    title: "Mae Jemison in Space",
    description: "Dr. Mae Jemison became the first Black woman to travel in space aboard the Space Shuttle Endeavour.",
    year: 1992,
    decade: "1980-present",
    topic: "Science",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop",
    credit: "NASA Archives"
  },
  {
    id: 11,
    title: "Abolition Movement",
    description: "Harriet Tubman, Frederick Douglass, and other abolitionists fought to end slavery in America.",
    year: 1850,
    decade: "1800s",
    topic: "Civil Rights",
    imageUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&h=400&fit=crop",
    credit: "Historical Society"
  },
  {
    id: 12,
    title: "Hip Hop Revolution",
    description: "Hip hop emerged from the Bronx in the 1970s and grew into a global cultural movement.",
    year: 1979,
    decade: "1950-1980",
    topic: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    credit: "Music History Archives"
  }
];

const decades = ["All", "1800s", "1900-1950", "1950-1980", "1980-present"];
const topics = ["All", "Civil Rights", "Arts", "Sports", "Politics", "Science"];

export default function PhotoGallery() {
  const [selectedDecade, setSelectedDecade] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPhotos = photos.filter(photo => {
    const decadeMatch = selectedDecade === "All" || photo.decade === selectedDecade;
    const topicMatch = selectedTopic === "All" || photo.topic === selectedTopic;
    return decadeMatch && topicMatch;
  });

  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      'Civil Rights': 'var(--accent-red)',
      'Arts': '#9B59B6',
      'Sports': 'var(--accent-green)',
      'Politics': '#4A90A4',
      'Science': 'var(--accent-gold)'
    };
    return colors[topic] || 'var(--ink-black)';
  };

  return (
    <NewspaperBorder title="Photo Archive">
      {/* Filter Controls */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border-[3px] border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--ink-black)] hover:text-[var(--paper-cream)] transition-colors mb-4"
        >
          <Filter size={18} />
          <span className="headline text-sm">FILTER PHOTOS</span>
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pb-4 border-b-2 border-dashed border-[var(--ink-faded)]"
            >
              {/* Decade Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  <span className="typewriter text-sm">BY DECADE:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {decades.map(decade => (
                    <button
                      key={decade}
                      onClick={() => setSelectedDecade(decade)}
                      className={`px-3 py-1 border-2 border-[var(--ink-black)] text-sm transition-colors ${
                        selectedDecade === decade
                          ? 'bg-[var(--ink-black)] text-[var(--paper-cream)]'
                          : 'bg-transparent hover:bg-[var(--paper-aged)]'
                      }`}
                    >
                      {decade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} />
                  <span className="typewriter text-sm">BY TOPIC:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1 border-2 text-sm transition-colors ${
                        selectedTopic === topic
                          ? 'text-white border-transparent'
                          : 'border-[var(--ink-black)] bg-transparent hover:bg-[var(--paper-aged)]'
                      }`}
                      style={{
                        backgroundColor: selectedTopic === topic ? getTopicColor(topic) : undefined
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters display */}
        {(selectedDecade !== "All" || selectedTopic !== "All") && (
          <div className="flex items-center gap-2 text-sm mt-4">
            <span className="typewriter text-[var(--ink-faded)]">Showing:</span>
            {selectedDecade !== "All" && (
              <span className="px-2 py-0.5 bg-[var(--paper-aged)] border border-[var(--ink-black)]">
                {selectedDecade}
              </span>
            )}
            {selectedTopic !== "All" && (
              <span 
                className="px-2 py-0.5 text-white"
                style={{ backgroundColor: getTopicColor(selectedTopic) }}
              >
                {selectedTopic}
              </span>
            )}
            <button
              onClick={() => { setSelectedDecade("All"); setSelectedTopic("All"); }}
              className="text-[var(--accent-red)] hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="border-[3px] border-[var(--ink-black)] overflow-hidden bg-white relative">
                {/* Halftone overlay effect */}
                <div className="relative aspect-[4/3] overflow-hidden halftone">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${photo.imageUrl})`,
                      filter: 'grayscale(30%) contrast(1.1)'
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--ink-black)] bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>

                {/* Caption */}
                <div className="p-3 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTopicColor(photo.topic) }}
                    />
                    <span className="text-xs typewriter text-[var(--ink-faded)]">
                      {photo.year}
                    </span>
                  </div>
                  <h4 className="headline text-sm line-clamp-1">{photo.title}</h4>
                </div>

                {/* Corner fold effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-[var(--paper-aged)] border-l-[20px] border-l-transparent"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <p className="body-text text-[var(--ink-faded)]">
            No photos found for the selected filters.
          </p>
          <button
            onClick={() => { setSelectedDecade("All"); setSelectedTopic("All"); }}
            className="mt-4 text-[var(--accent-red)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Photo count */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-[var(--ink-faded)]">
        <p className="text-center text-xs typewriter text-[var(--ink-faded)]">
          Showing {filteredPhotos.length} of {photos.length} photographs in the archive
        </p>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink-black)] bg-opacity-90"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[var(--paper-cream)] border-[4px] border-[var(--ink-black)]"
              onClick={e => e.stopPropagation()}
              style={{ boxShadow: '8px 8px 0px var(--ink-black)' }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--accent-red)] text-white border-[3px] border-[var(--ink-black)] flex items-center justify-center hover:bg-[var(--ink-black)] transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="aspect-video relative halftone">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${selectedPhoto.imageUrl})`,
                    filter: 'grayscale(20%) contrast(1.05)'
                  }}
                />
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span 
                    className="px-3 py-1 text-white text-xs uppercase font-bold"
                    style={{ backgroundColor: getTopicColor(selectedPhoto.topic) }}
                  >
                    {selectedPhoto.topic}
                  </span>
                  <span className="typewriter text-sm">{selectedPhoto.year}</span>
                  <span className="text-[var(--ink-faded)]">•</span>
                  <span className="text-sm text-[var(--ink-faded)]">{selectedPhoto.decade}</span>
                </div>

                <h3 className="headline text-2xl md:text-3xl mb-3">{selectedPhoto.title}</h3>
                <p className="body-text text-base md:text-lg mb-4">{selectedPhoto.description}</p>
                
                <p className="text-xs typewriter text-[var(--ink-faded)]">
                  Credit: {selectedPhoto.credit}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NewspaperBorder>
  );
}

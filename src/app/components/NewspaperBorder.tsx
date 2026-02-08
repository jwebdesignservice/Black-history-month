'use client';

import { ReactNode } from 'react';

interface NewspaperBorderProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'accent';
}

export default function NewspaperBorder({ 
  children, 
  title, 
  className = '',
  variant = 'default' 
}: NewspaperBorderProps) {
  const variantStyles = {
    default: 'border-[var(--ink-black)]',
    featured: 'border-[var(--accent-red)]',
    accent: 'border-[var(--accent-gold)]'
  };

  const titleBgStyles = {
    default: 'bg-[var(--ink-black)] text-[var(--paper-cream)]',
    featured: 'bg-[var(--accent-red)] text-white',
    accent: 'bg-[var(--accent-gold)] text-[var(--ink-black)]'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Outer decorative border */}
      <div className="absolute -inset-1 border-2 border-dashed border-[var(--ink-faded)] opacity-50"></div>
      
      {/* Main container */}
      <div className={`newspaper-section p-4 md:p-6 ${variantStyles[variant]}`}>
        {title && (
          <div className="absolute -top-4 left-4 md:left-8">
            <span className={`headline text-sm md:text-base px-3 py-1 ${titleBgStyles[variant]}`}>
              {title}
            </span>
          </div>
        )}
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--ink-black)]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--ink-black)]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--ink-black)]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--ink-black)]"></div>
        
        <div className={title ? 'pt-2' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
}

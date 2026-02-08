'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface SocialBarProps {
  contractAddress?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  dexUrl?: string;
}

export default function SocialBar({
  contractAddress = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  twitterUrl = "https://twitter.com",
  telegramUrl = "https://t.me",
  dexUrl = "https://dexscreener.com"
}: SocialBarProps) {
  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateCA = (ca: string) => {
    if (ca.length <= 16) return ca;
    return `${ca.slice(0, 8)}...${ca.slice(-8)}`;
  };

  return (
    <div className="bg-[var(--ink-black)] text-[var(--paper-cream)] border-b-4 border-[var(--accent-gold)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
          
          {/* Contract Address */}
          <div className="flex items-center gap-1.5 md:gap-2 w-full md:w-auto justify-center md:justify-start">
            <span className="text-xs typewriter text-[var(--accent-gold)] uppercase tracking-wider shrink-0">CA:</span>
            <button
              onClick={copyCA}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-[var(--ink-faded)] hover:bg-[var(--accent-gold)] hover:text-[var(--ink-black)] transition-colors border border-[var(--ink-faded)] group min-w-0"
            >
              <span className="text-xs font-mono truncate max-w-[180px] sm:max-w-none">
                {truncateCA(contractAddress)}
              </span>
              {copied ? (
                <Check size={12} className="text-[var(--accent-green)] shrink-0" />
              ) : (
                <Copy size={12} className="group-hover:scale-110 transition-transform shrink-0" />
              )}
            </button>
            {copied && (
              <span className="text-xs text-[var(--accent-green)] animate-pulse shrink-0">Copied!</span>
            )}
          </div>

          {/* Social Links & DEX */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-wrap justify-center">
            {/* Twitter/X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors border-2 border-[var(--ink-black)]"
              style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-xs font-bold hidden sm:inline">Twitter</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-[#0088cc] hover:bg-[#0077b5] transition-colors border-2 border-[var(--ink-black)]"
              style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="text-xs font-bold hidden sm:inline">Telegram</span>
            </a>

            {/* DEX */}
            <a
              href={dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-[var(--accent-green)] hover:bg-[#005a34] transition-colors border-2 border-[var(--ink-black)]"
              style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-xs font-bold hidden sm:inline">DEX</span>
            </a>

            {/* Buy Button */}
            <a
              href={dexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 md:px-4 py-1 md:py-1.5 bg-[var(--accent-red)] hover:bg-[#b00f21] transition-colors border-2 border-[var(--ink-black)] animate-pulse hover:animate-none"
              style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider">Buy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

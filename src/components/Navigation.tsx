import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  onOpenSettings?: () => void;
}

const Navigation = ({ onOpenSettings }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', text: 'AIDA Analysis' },
    { href: '/niche-analyzer', text: 'Niche Analyzer' },
    { href: '/affiliate-marketing-calculator', text: 'Calculator' }
  ];

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-indigo-600">
              ImVigour
            </a>
          </div>

          {/* Menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            aria-expanded="false"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Dropdown menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} bg-white rounded-lg shadow-lg mt-2`}>
          <div className="px-2 py-3 space-y-1 text-left">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.text}
              </a>
            ))}
            <button
              onClick={() => {
                if (onOpenSettings) {
                  onOpenSettings();
                  setIsMenuOpen(false);
                }
              }}
              className="w-full text-left text-gray-600 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

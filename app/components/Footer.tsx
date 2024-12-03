import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-mainWhite">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold">
              Sofa AI
            </Link>
            <p className="text-gray-300">
              Make event planning as comfortable as sitting on your sofa
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="mailto:hello@sofaai.com" className="text-gray-300 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-3">
              {[
                ['Create Event', '/create-event'],
                ['Find Events', '/events'],
                ['About Us', '/about'],
                ['Contact', '/contact']
              ].map(([text, href]) => (
                <li key={text}>
                  <Link href={href} className="text-gray-300 hover:text-primary transition-colors">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Email: hello@sofaai.com</li>
              <li>Working Hours: 24/7 AI Support</li>
              <li>Location: Belgrade, Serbia</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-300 hover:text-primary text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-primary text-sm">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
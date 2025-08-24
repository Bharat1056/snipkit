import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-sm">
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 py-12">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-bold text-xl text-white">Snipkit</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Snipkit is a platform for sharing code snippets across CLI.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/Bharat1056"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/Bharat1056"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/bharat-panigrahi/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:bharatpanigrahi225@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-end items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Snipkit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

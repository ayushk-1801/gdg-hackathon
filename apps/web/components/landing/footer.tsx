import React from 'react';
import { Youtube } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Youtube className="h-6 w-6 text-zinc-900 dark:text-white" />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">Benkyoshi</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.162 5.656C21.399 5.9 20.589 6.063 19.76 6.13C20.634 5.596 21.288 4.771 21.6 3.8C20.78 4.291 19.881 4.641 18.944 4.825C18.3146 4.15731 17.4804 3.71331 16.5709 3.56707C15.6615 3.42084 14.7279 3.58053 13.9153 4.02148C13.1026 4.46244 12.4564 5.16254 12.0772 6.00952C11.6979 6.85651 11.6068 7.80349 11.818 8.705C10.1551 8.62145 8.52832 8.19503 7.04328 7.45389C5.55823 6.71275 4.24812 5.67634 3.198 4.405C2.82629 5.0374 2.63095 5.76207 2.632 6.5C2.632 7.945 3.37 9.224 4.492 9.975C3.82801 9.95533 3.17863 9.77584 2.598 9.445V9.495C2.5985 10.4696 2.93124 11.4128 3.54471 12.1665C4.15819 12.9202 5.00962 13.4335 5.953 13.62C5.33661 13.7866 4.69324 13.8101 4.066 13.69C4.33015 14.5235 4.8503 15.2536 5.55089 15.7743C6.25147 16.2951 7.09742 16.5789 7.97 16.585C7.10249 17.2663 6.10917 17.7743 5.04687 18.0752C3.98458 18.3761 2.87412 18.4646 1.779 18.335C3.69076 19.5366 5.91609 20.1755 8.189 20.173C15.882 20.173 20.089 13.88 20.089 8.443C20.089 8.27 20.084 8.095 20.076 7.923C20.8949 7.31941 21.6016 6.5757 22.163 5.735L22.162 5.656Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-zinc-900 dark:text-white">Key Features</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  YouTube Import
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Course Structure
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  AI-Generated Notes
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Quiz Generation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Progress Tracking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-zinc-900 dark:text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  React components
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  DevTools
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Next.js Starter Kit
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-zinc-900 dark:text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Benkyoshi. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

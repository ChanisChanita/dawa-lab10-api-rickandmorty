'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.HOME, label: 'Inicio' },
    { href: ROUTES.CHARACTERS, label: 'Personajes' },
    { href: ROUTES.SEARCH, label: 'Búsqueda' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href={ROUTES.HOME}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl">🛸</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Rick & Morty
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${pathname === item.href
                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Menú móvil */}
          <div className="sm:hidden flex items-center">
            <select
              value={pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="
                px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
              "
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
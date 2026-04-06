'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Barbell3, TrendingUp, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const routes = [
    { href: '/dashboard', icon: Home, label: 'Accueil' },
    { href: '/workout', icon: Zap, label: 'Séance' },
    { href: '/exercises', icon: Barbell3, label: 'Exercices' },
    { href: '/stats', icon: TrendingUp, label: 'Stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-around">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={isActive ? 'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors text-primary-600 bg-primary-50' : 'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors text-neutral-600 hover:bg-neutral-50'}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

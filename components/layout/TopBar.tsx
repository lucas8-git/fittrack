'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-foreground">FitTrack</h1>
      </div>
      {session && (
        <button
          onClick={() => signOut()}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut size={20} className="text-neutral-600" />
        </button>
      )}
    </header>
  );
}

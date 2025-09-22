'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, SquareChartGantt, Users, Wallet2, Info } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/earn', label: 'Earn', Icon: SquareChartGantt },
  { href: '/refer', label: 'Refer', Icon: Users },
  { href: '/withdraw', label: 'Withdraw', Icon: Wallet2 },
  { href: '/about', label: 'About', Icon: Info },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed left-1/2 -translate-x-1/2
        bottom-[max(env(safe-area-inset-bottom),1rem)]
        z-50
      "
    >
      <div
        className="
          flex items-center gap-1 px-2 py-2
          rounded-2xl border border-zinc-700/60
          bg-zinc-900/80 backdrop-blur-md shadow-xl
        "
      >
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'group flex h-14 w-14 flex-col items-center justify-center rounded-xl transition',
                active
                  ? 'bg-lime-400 text-black shadow-[0_0_30px_#BEF264]'
                  : 'text-zinc-300 hover:bg-zinc-800/70'
              )}
              aria-label={label}
            >
              <Icon className={clsx('h-6 w-6', active ? 'text-black' : 'text-zinc-200')} />
              <span className={clsx('mt-1 text-[10px] font-medium', active ? 'text-black' : 'text-zinc-400')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

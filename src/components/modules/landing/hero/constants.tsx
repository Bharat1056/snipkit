import { Heart } from 'lucide-react';

export const hero = {
  badge: {
    text: '100% Free Forever',
    icon: Heart,
  },
  title: (
    <>
      Code Without{' '}
      <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        STRESS
      </span>
      , Stay in Your Terminal
    </>
  ),
  description:
    'Stop breaking your flow to search for code snippets. Never leave your terminal again. Focus on building, not hunting for that perfect function you wrote last month.',
  cta: {
    primary: {
      label: 'Start Stress-Free Coding',
      href: '/dashboard',
    },
    secondary: {
      label: 'See How It Works',
      href: '#why-free',
    },
  },
  freeFeatures: [
    '💻 Never leave terminal',
    '⚡ Instant snippet access',
    '🧠 Less mental overhead',
    '🔍 Lightning-fast search',
    '❤️ Zero stress, zero cost',
  ],
};

'use client';

// Client-only context wrapper. QueryClient is created once at module load.

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Tags <html> with `.is-coarse` for touch/stylus devices (phones AND
// tablets) or reduced-motion users, regardless of viewport width.
//
// Several heavy visual effects (ambient blurred orbs, backdrop-filter glass)
// used to get their "lighter" treatment purely from a `max-width: 1023px`
// media query. That correctly caught phones, but tablets — which often
// report CSS widths well above 1024px, especially in landscape — slipped
// through and got the full desktop-grade blur/animation load despite
// running on a mobile-class GPU. This class lets globals.css target real
// device capability instead of just screen width, in addition to (not
// instead of) the existing width-based query.
function useCoarsePointerRootClass() {
  useEffect(() => {
    const pointerMql = window.matchMedia('(pointer: coarse)');
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      document.documentElement.classList.toggle(
        'is-coarse',
        pointerMql.matches || motionMql.matches
      );
    };
    update();
    pointerMql.addEventListener('change', update);
    motionMql.addEventListener('change', update);
    return () => {
      pointerMql.removeEventListener('change', update);
      motionMql.removeEventListener('change', update);
    };
  }, []);
}

export function Providers({ children }) {
  useCoarsePointerRootClass();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

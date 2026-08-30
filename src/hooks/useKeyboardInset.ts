"use client";

import { useEffect, useState } from "react";

/**
 * Height in pixels currently hidden by the on-screen keyboard.
 *
 * Android usually resizes the layout viewport when the keyboard opens, but iOS
 * Safari does not — it slides the visual viewport up and leaves the layout
 * viewport at full height. `window.innerHeight` is therefore useless on iOS,
 * and visualViewport is the only reading that reflects both.
 *
 * Returns 0 when no keyboard is up, and on browsers without visualViewport.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // offsetTop covers the case where the page is scrolled within the visual
      // viewport; without it the inset is overstated while the view is panned.
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      // Ignore a few pixels of rounding and browser chrome jitter.
      setInset(hidden > 80 ? Math.round(hidden) : 0);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}

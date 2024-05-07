// import React from "react";

// export default function useIntersectionObserver({
//   root,
//   target,
//   onIntersect,
//   threshold = 1.0,
//   rootMargin = "0px",
//   enabled = true,
// }) {
//   React.useEffect(() => {
//     if (!enabled) {
//       return;
//     }

//     const observer = new IntersectionObserver(
//       (entries) =>
//         entries.forEach((entry) => entry.isIntersecting && onIntersect()),
//       {
//         root: root && root.current,
//         rootMargin,
//         threshold,
//       }
//     );

//     const el = target && target.current;

//     if (!el) {
//       return;
//     }

//     observer.observe(el);

//     return () => {
//       observer.unobserve(el);
//     };
//   }, [target.current, enabled]);
// }

import { useEffect } from 'react';

export default function useIntersectionObserver({
  enabled = true,
  onIntersect,
  root,
  rootMargin = '0px',
  target,
  threshold = 0.1
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target.current, enabled]);
}

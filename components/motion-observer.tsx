"use client";

import { useEffect } from "react";

const motionSelector = ".motion-reveal, .motion-reveal-soft";

export function MotionObserver() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer =
      !prefersReducedMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, currentObserver) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  return;
                }

                entry.target.classList.add("motion-visible");
                currentObserver.unobserve(entry.target);
              });
            },
            {
              rootMargin: "0px 0px -12% 0px",
              threshold: 0.16,
            },
          )
        : null;

    function visitMotionElements(node: Node, visit: (element: Element) => void) {
      if (!(node instanceof Element)) {
        return;
      }

      if (node.matches(motionSelector)) {
        visit(node);
      }

      node.querySelectorAll(motionSelector).forEach(visit);
    }

    function observeElement(element: Element) {
      if (!element.isConnected || element.classList.contains("motion-visible")) {
        return;
      }

      if (observer) {
        observer.observe(element);
      } else {
        element.classList.add("motion-visible");
      }
    }

    // Client navigation can replace translated cards while the layout stays mounted.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.removedNodes.forEach((node) => {
          visitMotionElements(node, (element) => observer?.unobserve(element));
        });
        record.addedNodes.forEach((node) => {
          visitMotionElements(node, observeElement);
        });
      });
    });

    mutations.observe(document.body, { childList: true, subtree: true });
    visitMotionElements(document.body, observeElement);

    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}

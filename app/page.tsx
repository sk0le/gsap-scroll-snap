"use client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);
}

export default function Home() {
  useGSAP(() => {
    const firstElem = document.querySelector(
      "#first-section"
    ) as HTMLDivElement;

    let panels = gsap.utils.toArray(".panel"),
      observer = ScrollTrigger.normalizeScroll(true),
      scrollTween;

    // on touch devices, ignore touchstart events if there's an in-progress tween so that touch-scrolling doesn't interrupt and make it wonky
    document.addEventListener(
      "touchstart",
      (e) => {
        if (scrollTween) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      { capture: true, passive: false }
    );

    function goToSection(i) {
      scrollTween = gsap.to(window, {
        scrollTo: {
          y:
            innerHeight * i +
            (window.scrollY + firstElem.getBoundingClientRect().top),
          autoKill: false,
        },
        onStart: () => {
          observer.disable(); // for touch devices, as soon as we start forcing scroll it should stop any current touch-scrolling, so we just disable() and enable() the normalizeScroll observer
          observer.enable();
        },
        duration: 1,
        onComplete: () => (scrollTween = null),
        overwrite: true,
      });
    }

    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top bottom",
        end: "+=199%",
        onToggle: (self) => self.isActive && !scrollTween && goToSection(i),
      });
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-[300vh]"> normal scroll</div>

      <div
        className=" panel h-screen w-full bg-green-600"
        id="first-section"
      ></div>
      <div className=" panel h-screen w-full bg-blue-600"></div>
      <div className=" panel h-screen w-full bg-red-600"></div>
      <div className=" panel h-screen w-full bg-yellow-600"></div>

      <div className="h-[300vh]"> normal scroll</div>
    </main>
  );
}

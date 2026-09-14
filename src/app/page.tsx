"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AboutMe from "@/components/sections/about/about-me";
import CalBooking from "@/components/sections/home/cal-booking";
import Achievements from "@/components/sections/home/achievements";
import { ExperienceTimeline } from "@/components/sections/home/timeline-demo";
import Preloader from "@/components/common/preloader";
import ProjectsShowcase from "@/components/sections/showreel";
import CollabSec from "@/components/sections/home/collab-section";
import AboutScrollSection from "@/components/sections/about/about-scroll-section";
import AboutSection from "@/components/sections/about/about-section";

export default function Home() {
  // The Preloader owns the (60fps) load-progress state internally so those
  // updates never re-render this heavy page tree. It just tells us when it's
  // done, and we drop it.
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = () => {
    setIsLoading(false);
    document.body.style.cursor = "default";
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center scroll-smooth">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={handleLoaded} />}
      </AnimatePresence>

      {/*About Me is Hero Section */}
      <section id="hero" className="w-full scroll-mt-24">
        <AboutMe />
      </section>

      {/* Projects Section — id="projects" is set on the section inside ProjectsShowcase */}
      <ProjectsShowcase />

      {/* About Scroll Section */}
      <section id="about" className="">
        <AboutScrollSection />
        <AboutSection />
      </section>

      {/* Experience Section */}
      <section id="experience" className="w-full scroll-mt-24">
        <ExperienceTimeline />
      </section>

      <CollabSec />

      <Achievements />

      {/* Contact Section */}
      <section id="contact" className="w-full scroll-mt-24">
        <CalBooking />
      </section>
    </div>
  );
}

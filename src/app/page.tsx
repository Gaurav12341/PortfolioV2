import Hero from "@/components/hero/hero";
import CalBooking from "@/components/sections/home/cal-booking";
import { ExperienceTimeline } from "@/components/sections/about/experience-timeline";
import WorkShowcase from "@/components/sections/work/work-showcase";
import SupportRagSection from "@/components/sections/featured/supportrag-section";
import CollabSec from "@/components/sections/home/collab-section";
import AboutScrollSection from "@/components/sections/about/about-scroll-section";
import AboutSection from "@/components/sections/about/about-section";

/**
 * Server component. No preloader: the hero text is in the initial HTML and
 * is the LCP element. Heavy sections hydrate on their own.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Hero />

      {/* Scroll sequence: frames, then the portrait reveal (Phase 5) */}
      <AboutScrollSection />

      {/* Work = featured project + work case studies */}
      <div id="work" className="w-full scroll-mt-[88px]">
        <SupportRagSection />
        <WorkShowcase />
      </div>

      <section id="about" aria-label="About" className="w-full">
        <AboutSection />
      </section>

      <section id="experience" aria-labelledby="experience-title" className="w-full scroll-mt-[88px]">
        <ExperienceTimeline />
      </section>

      <CollabSec />

      <section id="contact" className="w-full scroll-mt-[88px]">
        <CalBooking />
      </section>
    </div>
  );
}

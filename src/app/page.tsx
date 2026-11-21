import Hero from "@/components/hero/hero";
import CalBooking from "@/components/sections/home/cal-booking";
import Achievements from "@/components/sections/home/achievements";
import { ExperienceTimeline } from "@/components/sections/home/timeline-demo";
import ProjectsShowcase from "@/components/sections/showreel";
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

      {/* Projects: id="work" is set on the section inside ProjectsShowcase */}
      <ProjectsShowcase />

      <section id="about" className="w-full">
        <AboutScrollSection />
        <AboutSection />
      </section>

      <section id="experience" className="w-full scroll-mt-[88px]">
        <ExperienceTimeline />
      </section>

      <CollabSec />

      <Achievements />

      <section id="contact" className="w-full scroll-mt-[88px]">
        <CalBooking />
      </section>
    </div>
  );
}

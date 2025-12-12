import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Realms from "@/components/Realms";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ScrollNav from "@/components/ScrollNav";
import Navbar from "@/components/Navbar";
import { AudioControls } from "@/components/AudioControls";
import { useAudioContext } from "@/contexts/AudioContext";
const sections = ["Introduction", "Realms", "About", "Testimonials"];

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const mainRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    bgmPlaying,
    sfxEnabled,
    volume,
    toggleBgm,
    toggleSfx,
    setVolume,
    playClick,
  } = useAudioContext();
  // Intersection Observer for accurate section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionElement = entry.target as HTMLElement;
          const sectionId = sectionElement.id;

          let index = 0;
          if (sectionId === "hero-section") index = 0;
          else if (sectionId === "realms-section") index = 1;
          else if (sectionId === "about-section") index = 2;
          else if (sectionId === "testimonials-section") index = 3;

          setCurrentSection(index);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe only page sections (exclude notification sections)
    const allSections = document.querySelectorAll(
      "section#hero-section, section#realms-section, section#about-section, section#testimonials-section",
    );
    sectionsRef.current = Array.from(allSections) as HTMLElement[];

    sectionsRef.current.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default only for our navigation keys
      if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
        // Don't interfere with carousel navigation
        const target = e.target as HTMLElement;
        if (
          target.closest('[role="region"][aria-roledescription="carousel"]')
        ) {
          return;
        }

        e.preventDefault();

        if (e.key === "ArrowDown" || e.key === " ") {
          if (currentSection < sections.length - 1) {
            const nextSection = document.querySelectorAll(
              "section#hero-section, section#realms-section, section#about-section, section#testimonials-section",
            )[currentSection + 1];
            nextSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else if (e.key === "ArrowUp") {
          if (currentSection > 0) {
            const prevSection = document.querySelectorAll(
              "section#hero-section, section#realms-section, section#about-section, section#testimonials-section",
            )[currentSection - 1];
            prevSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection]);

  const navigateToSection = (index: number) => {
    if (!mainRef.current) return;

    const allSections = document.querySelectorAll(
      "section#hero-section, section#realms-section, section#about-section, section#testimonials-section",
    );
    const targetSection = allSections[index] as HTMLElement;
    if (!targetSection) return;

    // Clear any existing scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Temporarily disable snap for smooth transition
    mainRef.current.style.scrollSnapType = "none";

    // Use requestAnimationFrame for smoother disable
    requestAnimationFrame(() => {
      targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });

      // Detect scroll end to re-enable snap
      const detectScrollEnd = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          if (mainRef.current) {
            mainRef.current.style.scrollSnapType = "y mandatory";
          }
        }, 150);
      };

      // Listen for scroll events to detect when scrolling ends
      const scrollHandler = () => detectScrollEnd();
      mainRef.current?.addEventListener("scroll", scrollHandler, {
        passive: true,
      });

      // Cleanup listener after snap is re-enabled
      setTimeout(() => {
        mainRef.current?.removeEventListener("scroll", scrollHandler);
      }, 1200);
    });
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <Navbar currentSection={currentSection} onNavigate={navigateToSection} />

      {/* Audio Controls */}
      <AudioControls
        bgmPlaying={bgmPlaying}
        sfxEnabled={sfxEnabled}
        volume={volume}
        onToggleBgm={toggleBgm}
        onToggleSfx={toggleSfx}
        onVolumeChange={setVolume}
        onButtonClick={playClick}
      />

      <main
        ref={mainRef}
        className="h-screen bg-background text-foreground overflow-y-scroll overflow-x-hidden snap-y snap-mandatory"
        style={{
          scrollBehavior: "smooth",
          scrollPaddingTop: "4rem",
          transition: "scroll-snap-type 0.1s ease",
        }}
      >
        {/* Scroll Navigation Indicator */}
        <ScrollNav
          sections={sections}
          currentSection={currentSection}
          onNavigate={navigateToSection}
        />

        {/* Section dividers with golden line effect */}
        <style>{`
        section#hero-section,
        section#realms-section,
        section#about-section,
        section#testimonials-section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
          min-height: 100vh;
        }

        section#hero-section::after,
        section#realms-section::after,
        section#about-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 3px;
          background: linear-gradient(90deg, transparent, hsl(43, 74%, 53%, 0.4) 20%, hsl(43, 74%, 53%, 0.6) 50%, hsl(43, 74%, 53%, 0.4) 80%, transparent);
          box-shadow: 0 0 15px hsla(43, 74%, 53%, 0.4), 0 2px 8px hsla(0, 0%, 0%, 0.3);
        }

        section#testimonials-section::after {
          display: none;
        }

        /* Smooth scroll behavior optimization */
        html {
          scroll-behavior: smooth;
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid hsl(43, 74%, 53%);
          outline-offset: 4px;
        }
      `}</style>

        {/* Section 1: Hero/Introduction */}
        <Hero />

        {/* Section 2: Seven Realms Carousel */}
        <Realms />

        {/* Section 3: About */}
        <About />

        {/* Section 4: Testimonials */}
        <Testimonials />
      </main>
    </>
  );
};

export default Index;

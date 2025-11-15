import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Realms from "@/components/Realms";
import About from "@/components/About";
import ScrollNav from "@/components/ScrollNav";
import Navbar from "@/components/Navbar";

const sections = ["Introduction", "Realms", "About"];

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      setCurrentSection(Math.min(Math.max(sectionIndex, 0), sections.length - 1));
    };

    const debouncedHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default only for our navigation keys
      if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
        // Don't interfere with carousel navigation
        const target = e.target as HTMLElement;
        if (target.closest('[role="region"][aria-roledescription="carousel"]')) {
          return;
        }
        
        e.preventDefault();
        
        if (e.key === "ArrowDown" || e.key === " ") {
          if (currentSection < sections.length - 1) {
            const nextSection = document.querySelectorAll("section")[currentSection + 1];
            nextSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else if (e.key === "ArrowUp") {
          if (currentSection > 0) {
            const prevSection = document.querySelectorAll("section")[currentSection - 1];
            prevSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection]);

  const navigateToSection = (index: number) => {
    const allSections = document.querySelectorAll("section");
    allSections[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <Navbar 
        currentSection={currentSection}
        onNavigate={navigateToSection}
      />

      <main 
        className="h-screen bg-background text-foreground overflow-y-scroll overflow-x-hidden snap-y snap-mandatory"
        style={{ 
          scrollBehavior: "smooth",
          scrollPaddingTop: "0px",
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
        section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
          min-height: 100vh;
        }
        
        section::after {
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
        
        section:last-child::after {
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
      </main>
    </>
  );
};

export default Index;

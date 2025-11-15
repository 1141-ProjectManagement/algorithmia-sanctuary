import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Realms from "@/components/Realms";
import About from "@/components/About";
import ScrollNav from "@/components/ScrollNav";

const sections = ["Introduction", "Realms", "About"];

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
          const nextSection = document.querySelectorAll("section")[currentSection + 1];
          nextSection?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentSection > 0) {
          const prevSection = document.querySelectorAll("section")[currentSection - 1];
          prevSection?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection]);

  const navigateToSection = (index: number) => {
    const allSections = document.querySelectorAll("section");
    allSections[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main 
      className="min-h-screen bg-background text-foreground overflow-y-scroll overflow-x-hidden snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Scroll Navigation */}
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
        }
        
        section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, hsl(43, 74%, 53%, 0.3), transparent);
          box-shadow: 0 0 10px hsla(43, 74%, 53%, 0.3);
        }
        
        section:last-child::after {
          display: none;
        }
      `}</style>

      {/* Section 1: Hero/Introduction */}
      <Hero />

      {/* Section 2: Seven Realms Carousel */}
      <Realms />

      {/* Section 3: About */}
      <About />
    </main>
  );
};

export default Index;

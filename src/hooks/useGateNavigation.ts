import { useState, useRef, useEffect, RefObject } from "react";

interface UseGateNavigationReturn {
  currentSection: number;
  demoRef: RefObject<HTMLDivElement>;
  testRef: RefObject<HTMLDivElement>;
  handleNavigate: (index: number) => void;
}

export function useGateNavigation(): UseGateNavigationReturn {
  const [currentSection, setCurrentSection] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);

  const sectionRefs = [demoRef, testRef];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  return {
    currentSection,
    demoRef,
    testRef,
    handleNavigate,
  };
}

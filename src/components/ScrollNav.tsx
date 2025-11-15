import { motion } from "framer-motion";

interface ScrollNavProps {
  sections: string[];
  currentSection: number;
  onNavigate: (index: number) => void;
}

const ScrollNav = ({ sections, currentSection, onNavigate }: ScrollNavProps) => {
  return (
    <nav 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
      aria-label="Section navigation"
    >
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className="group relative flex items-center justify-end gap-3"
          aria-label={`Go to ${section} section`}
        >
          {/* Label - shows on hover */}
          <span 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-cinzel text-sm text-temple-gold whitespace-nowrap pr-2"
          >
            {section}
          </span>
          
          {/* Dot indicator */}
          <motion.div
            animate={{
              scale: currentSection === index ? 1.2 : 1,
              width: currentSection === index ? '12px' : '8px',
              height: currentSection === index ? '12px' : '8px',
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: 'hsl(43, 74%, 53%)',
              backgroundColor: currentSection === index 
                ? 'hsl(43, 74%, 53%)' 
                : 'transparent',
              boxShadow: currentSection === index 
                ? '0 0 12px rgba(212, 175, 55, 0.8), 0 0 20px rgba(212, 175, 55, 0.4)' 
                : 'none',
            }}
          />
        </button>
      ))}
    </nav>
  );
};

export default ScrollNav;

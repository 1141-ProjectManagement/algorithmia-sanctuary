import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ScrollNavProps {
  sections: string[];
  currentSection: number;
  onNavigate: (index: number) => void;
}

const ScrollNav = ({ sections, currentSection, onNavigate }: ScrollNavProps) => {
  const canScrollUp = currentSection > 0;
  const canScrollDown = currentSection < sections.length - 1;

  const handleScrollUp = () => {
    if (canScrollUp) onNavigate(currentSection - 1);
  };

  const handleScrollDown = () => {
    if (canScrollDown) onNavigate(currentSection + 1);
  };

  return (
    <nav 
      className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 pointer-events-auto"
      aria-label="Section navigation"
      role="navigation"
    >
      {/* Scroll up button */}
      <button
        onClick={handleScrollUp}
        disabled={!canScrollUp}
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
        style={{
          borderColor: 'hsl(43, 74%, 53%, 0.5)',
          backgroundColor: canScrollUp ? 'hsla(43, 74%, 53%, 0.1)' : 'transparent',
        }}
        aria-label="Scroll to previous section"
      >
        <ChevronUp 
          className="w-5 h-5"
          style={{ color: 'hsl(43, 74%, 53%)' }}
        />
      </button>

      {/* Section dots */}
      <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className="group relative flex items-center justify-end gap-3"
            aria-label={`Go to ${section} section`}
            aria-current={currentSection === index ? "true" : "false"}
          >
            {/* Label - shows on hover */}
            <motion.span 
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="hidden lg:block absolute right-full mr-4 font-cinzel text-sm text-temple-gold whitespace-nowrap px-3 py-1.5 rounded-md backdrop-blur-sm"
              style={{
                background: 'hsla(43, 74%, 53%, 0.1)',
                border: '1px solid hsla(43, 74%, 53%, 0.3)',
              }}
            >
              {section}
            </motion.span>
            
            {/* Dot indicator */}
            <motion.div
              animate={{
                scale: currentSection === index ? 1.4 : 1,
                width: currentSection === index ? '14px' : '10px',
                height: currentSection === index ? '14px' : '10px',
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-full border-2 transition-all duration-400 cursor-pointer hover:scale-125"
              style={{
                borderColor: 'hsl(43, 74%, 53%)',
                backgroundColor: currentSection === index 
                  ? 'hsl(43, 74%, 53%)' 
                  : 'transparent',
                boxShadow: currentSection === index 
                  ? '0 0 16px rgba(212, 175, 55, 0.9), 0 0 24px rgba(212, 175, 55, 0.5)' 
                  : '0 0 8px rgba(212, 175, 55, 0.3)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Scroll down button */}
      <button
        onClick={handleScrollDown}
        disabled={!canScrollDown}
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
        style={{
          borderColor: 'hsl(43, 74%, 53%, 0.5)',
          backgroundColor: canScrollDown ? 'hsla(43, 74%, 53%, 0.1)' : 'transparent',
        }}
        aria-label="Scroll to next section"
      >
        <ChevronDown 
          className="w-5 h-5"
          style={{ color: 'hsl(43, 74%, 53%)' }}
        />
      </button>
    </nav>
  );
};

export default ScrollNav;

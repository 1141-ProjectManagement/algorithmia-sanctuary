import { motion } from "framer-motion";

interface ScrollNavProps {
  sections: string[];
  currentSection: number;
  onNavigate: (index: number) => void;
}

const ScrollNav = ({
  sections,
  currentSection,
  onNavigate,
}: ScrollNavProps) => {
  return (
    <nav
      className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-auto"
      aria-label="Section navigation"
      role="navigation"
    >
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
                background: "hsla(43, 74%, 53%, 0.1)",
                border: "1px solid hsla(43, 74%, 53%, 0.3)",
              }}
            >
              {section}
            </motion.span>

            {/* Dot indicator */}
            <motion.div
              animate={{
                scale: currentSection === index ? 1.4 : 1,
                width: currentSection === index ? "14px" : "10px",
                height: currentSection === index ? "14px" : "10px",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-full border-2 transition-all duration-400 cursor-pointer hover:scale-125"
              style={{
                borderColor: "hsl(43, 74%, 53%)",
                backgroundColor:
                  currentSection === index
                    ? "hsl(43, 74%, 53%)"
                    : "transparent",
                boxShadow:
                  currentSection === index
                    ? "0 0 16px rgba(212, 175, 55, 0.9), 0 0 24px rgba(212, 175, 55, 0.5)"
                    : "0 0 8px rgba(212, 175, 55, 0.3)",
              }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ScrollNav;

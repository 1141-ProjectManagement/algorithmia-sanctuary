import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { getCurrentUser, logoutUser } from "@/lib/database";

interface NavbarProps {
  currentSection: number;
  onNavigate: (index: number) => void;
}

const navItems = [
  {
    label: "Introduction",
    section: 0,
    ariaLabel: "Navigate to hero introduction",
  },
  { label: "Realms", section: 1, ariaLabel: "Navigate to seven temples" },
  { label: "About", section: 2, ariaLabel: "Navigate to about section" },
];

const Navbar = ({ currentSection, onNavigate }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; nickname: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for current user on mount
    getCurrentUser().then(user => {
      if (user) {
        setCurrentUser({ email: user.email, nickname: user.nickname });
      }
    });
  }, []);

  const handleNavClick = (index: number) => {
    onNavigate(index);
    setMobileMenuOpen(false);
  };

  const handleAuthSuccess = async () => {
    const user = await getCurrentUser();
    if (user) {
      setCurrentUser({ email: user.email, nickname: user.nickname });
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80" : "bg-black/70"
        } backdrop-blur-md border-b border-temple-gold/20`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <button
              onClick={() => handleNavClick(0)}
              className="flex items-center gap-2 group"
            >
              <Sparkles className="w-6 h-6 text-temple-gold animate-pulse-glow" />
              <h1
                className="font-cinzel text-xl md:text-2xl font-bold tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Algorithmia
              </h1>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  aria-label={item.ariaLabel}
                  className={`font-inter text-sm font-medium transition-all duration-300 relative group ${
                    currentSection === item.section
                      ? "text-temple-gold"
                      : "text-foreground/70 hover:text-temple-gold"
                  }`}
                  style={{
                    textShadow:
                      currentSection === item.section
                        ? "0 0 20px hsla(43, 74%, 53%, 0.6)"
                        : "none",
                  }}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-temple-gold transition-all duration-300 ${
                      currentSection === item.section
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                    style={{
                      boxShadow:
                        currentSection === item.section
                          ? "0 0 10px hsla(43, 74%, 53%, 0.8)"
                          : "none",
                    }}
                  />
                </button>
              ))}

              {/* Login/User Button */}
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-temple-gold font-cinzel">
                    {currentUser.nickname}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="font-cinzel border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 hover:border-temple-gold transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    登出
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="font-cinzel border-temple-gold/50 text-temple-gold hover:bg-temple-gold/10 hover:border-temple-gold transition-all duration-300"
                >
                  登入/註冊
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-temple-gold hover:bg-temple-gold/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-md border-b border-temple-gold/20 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className={`w-full text-left px-6 py-4 rounded-lg font-cinzel text-lg font-medium transition-all duration-300 ${
                    currentSection === item.section
                      ? "bg-temple-gold/20 text-temple-gold border-2 border-temple-gold"
                      : "bg-black/50 text-foreground/70 border-2 border-temple-gold/30 hover:bg-temple-gold/10 hover:text-temple-gold hover:border-temple-gold/50"
                  }`}
                  style={{
                    boxShadow:
                      currentSection === item.section
                        ? "0 0 20px hsla(43, 74%, 53%, 0.4)"
                        : "none",
                  }}
                >
                  {item.label}
                </button>
              ))}

              {currentUser ? (
                <div className="space-y-3">
                  <div className="text-center text-temple-gold font-cinzel text-lg">
                    {currentUser.nickname}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full font-cinzel text-lg py-6 border-2 border-temple-gold text-temple-gold hover:bg-temple-gold/20 transition-all duration-300"
                    style={{
                      boxShadow: "0 0 20px hsla(43, 74%, 53%, 0.3)",
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    登出
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full font-cinzel text-lg py-6 border-2 border-temple-gold text-temple-gold hover:bg-temple-gold/20 transition-all duration-300"
                  style={{
                    boxShadow: "0 0 20px hsla(43, 74%, 53%, 0.3)",
                  }}
                >
                  登入/註冊
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Navbar;


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-primary">
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#projects"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Projects
          </a>
          <a
            href="#skills"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            Skills
          </a>
          <Button asChild>
            <a href="#contact">Contact Me</a>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-700 p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 animate-fade-in">
          <div className="container flex flex-col space-y-4">
            <a
              href="#home"
              className="text-gray-700 hover:text-primary transition-colors font-medium px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-primary transition-colors font-medium px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#projects"
              className="text-gray-700 hover:text-primary transition-colors font-medium px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a
              href="#skills"
              className="text-gray-700 hover:text-primary transition-colors font-medium px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skills
            </a>
            <a
              href="#contact"
              className="bg-primary text-white font-medium rounded-md px-4 py-2 w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


import React from "react";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Portfolio</h2>
          </div>
          
          <div className="flex space-x-6 mb-8">
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="Github"
            >
              <Github size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="text-slate-400 text-sm text-center">
            <p>© {currentYear} John Doe. All rights reserved.</p>
            <p className="mt-2">Designed and built with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

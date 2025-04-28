
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="hero-gradient min-h-screen flex items-center pt-16"
    >
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <p className="text-primary text-lg md:text-xl font-medium mb-4">
              Hi there, I'm
            </p>
          </div>
          
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              John Doe
            </h1>
          </div>
          
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <h2 className="text-2xl md:text-4xl text-gray-300 font-semibold mb-8">
              <span className="text-gradient">Creative Developer</span> & Designer
            </h2>
          </div>
          
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <p className="text-gray-300 text-lg max-w-2xl mb-10">
              I create engaging digital experiences with a focus on elegant design
              and clean code. Passionate about solving problems through beautiful,
              accessible solutions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View My Work
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Me
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-white/70 hover:text-white">
            <ArrowDown size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

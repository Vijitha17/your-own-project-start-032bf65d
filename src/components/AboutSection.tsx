
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">Get To Know</p>
          <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Hello! I'm John, a passionate developer and designer with over 5 years 
                of experience creating beautiful, functional websites and applications. 
                I specialize in crafting engaging user experiences that combine elegant 
                design with clean, efficient code.
              </p>
              <p className="text-gray-700 leading-relaxed">
                My journey began with a degree in Computer Science, but my passion for 
                design led me to explore the intersection of technology and creativity. 
                I've had the privilege of working with startups, agencies, and established 
                companies to bring their digital visions to life.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When I'm not coding or designing, you can find me hiking in the mountains, 
                experimenting with new recipes, or contributing to open-source projects. I'm always 
                eager to learn new technologies and techniques to stay at the forefront of 
                this ever-evolving field.
              </p>

              <div className="pt-4">
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <FileText size={18} />
                  <span>Download CV</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-primary/20 rounded-full absolute -top-4 -left-4"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-200 rounded-md relative overflow-hidden shadow-lg">
                {/* Placeholder for profile image */}
                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                  <span className="text-lg font-medium">Profile Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store with product listings, cart functionality, and secure checkout process.",
    tags: ["React", "Node.js", "MongoDB"],
    imageUrl: "/placeholder.svg",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A productivity application for organizing tasks with drag-and-drop functionality and team collaboration features.",
    tags: ["TypeScript", "React", "Firebase"],
    imageUrl: "/placeholder.svg",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website to showcase projects and skills with dark mode support.",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    imageUrl: "/placeholder.svg",
    demoUrl: "#",
    repoUrl: "#",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">My Recent Work</p>
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border border-slate-200 card-hover">
              <div className="h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600">{project.description}</p>
              </CardContent>
              
              <CardFooter className="flex gap-3">
                <Button asChild variant="outline" size="sm" className="flex gap-1">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} /> <span>Live Demo</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex gap-1">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github size={16} /> <span>Code</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

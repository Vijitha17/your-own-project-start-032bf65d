
import React from "react";

const skills = [
  {
    category: "Frontend",
    items: ["HTML & CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Next.js"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "RESTful APIs", "GraphQL"]
  },
  {
    category: "Tools & Others",
    items: ["Git & GitHub", "Figma", "Docker", "AWS", "CI/CD", "Jest"]
  }
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">What I Can Do</p>
          <h2 className="text-3xl md:text-4xl font-bold">My Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {skills.map((skillGroup, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">
                {skillGroup.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {skillGroup.items.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold">My Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Web Development",
                description: "Creating responsive and performant websites using modern technologies and best practices.",
                icon: "🖥️"
              },
              {
                title: "UI/UX Design",
                description: "Designing intuitive interfaces and experiences that delight and engage users.",
                icon: "🎨"
              },
              {
                title: "Mobile Apps",
                description: "Building cross-platform applications that work seamlessly across devices.",
                icon: "📱"
              },
              {
                title: "SEO Optimization",
                description: "Improving visibility and search engine ranking to drive organic traffic.",
                icon: "📈"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

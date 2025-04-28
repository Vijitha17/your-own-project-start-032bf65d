
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-bold">Contact Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Let's Talk</h3>
            <p className="text-gray-600 mb-8">
              Whether you have a project in mind, a question about my work, or just want to say hello,
              I'd love to hear from you. Fill out the form or reach out through any of the contact methods below.
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Email</h4>
                    <a href="mailto:hello@example.com" className="text-gray-700 hover:text-primary">
                      hello@example.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Phone</h4>
                    <a href="tel:+11234567890" className="text-gray-700 hover:text-primary">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Location</h4>
                    <p className="text-gray-700">San Francisco, CA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input 
                      id="name" 
                      placeholder="Your Name" 
                      required 
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      required 
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      placeholder="How can I help you?" 
                      required 
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell me about your project..." 
                      rows={5}
                      required 
                      className="w-full resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send size={16} />
                    <span>Send Message</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

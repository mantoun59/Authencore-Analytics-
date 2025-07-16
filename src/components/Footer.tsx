import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "About Authencore",
      content: "Professional psychological assessment platform providing scientifically validated tests for individuals and organizations seeking insights into personality, cognitive abilities, and behavioral patterns.",
      links: []
    },
    {
      title: "Quick Links",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Assessments", href: "#assessments" },
        { name: "Pricing", href: "#pricing" },
        { name: "Resources", href: "#resources" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "GDPR Compliance", href: "#gdpr" },
        { name: "Data Security", href: "#security" }
      ]
    },
    {
      title: "Contact",
      links: [],
      contact: {
        email: "contact@authencore.com",
        phone: "+1 (555) 123-4567",
        address: "Professional Services Center\nSuite 200, Business District"
      }
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              
              {/* About section with description */}
              {section.content && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {section.content}
                </p>
              )}
              
              {/* Links */}
              {section.links.length > 0 && (
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Contact information */}
              {section.contact && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <a 
                      href={`mailto:${section.contact.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {section.contact.email}
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <a 
                      href={`tel:${section.contact.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {section.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm whitespace-pre-line">
                      {section.contact.address}
                    </span>
                  </div>
                  <div className="pt-2">
                    <a
                      href="#contact"
                      className="inline-flex items-center text-primary hover:text-primary-glow transition-colors text-sm font-medium"
                    >
                      Contact Form
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Authencore Analytics. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
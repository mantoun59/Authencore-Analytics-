import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import modernOffice from "@/assets/modern-office.jpg";
import professionalMan from "@/assets/professional-man.jpg";
import professionalWoman from "@/assets/professional-woman.jpg";
import professionalMan2 from "@/assets/professional-man-2.jpg";

const Testimonials = () => {
  // Testimonials will be populated with real client feedback
  const testimonials: Array<{
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
  }> = [];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Background Image */}
        <div className="mb-16">
          <img 
            src={modernOffice}
            alt="Modern office environment showcasing professional success"
            className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-elegant"
          />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-card transition-shadow">
                <CardContent className="p-0">
                  <div className="text-center space-y-4">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    
                    <blockquote className="text-foreground mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">Client testimonials coming soon</p>
              <p className="text-sm">We're working with our clients to gather authentic feedback to share here.</p>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4" />
            <span className="font-medium">TRUSTED BY PROFESSIONALS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
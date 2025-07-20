import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Import the generated logo options
import logoOption1 from "@/assets/logo-option-1.png";
import logoOption2 from "@/assets/logo-option-2.png";
import logoOption3 from "@/assets/logo-option-3.png";
import logoOption4 from "@/assets/logo-option-4.png";
import logoOption5 from "@/assets/logo-option-5.png";
import logoOption6 from "@/assets/logo-option-6.png";
import logoOption7 from "@/assets/logo-option-7.png";
import logoOption8 from "@/assets/logo-option-8.png";
import logoOption9 from "@/assets/logo-option-9.png";
import logoOption10 from "@/assets/logo-option-10.png";
import logoUpdated from "@/assets/authencore-logo-updated.png";
import logoVariant2 from "@/assets/authencore-logo-variant-2.png";
import logoVariant3 from "@/assets/authencore-logo-variant-3.png";
import logoVariant4 from "@/assets/authencore-logo-variant-4.png";
import logoVariant5 from "@/assets/authencore-logo-variant-5.png";
import logoVariant6 from "@/assets/authencore-logo-variant-6.png";
import logoVariant7 from "@/assets/authencore-logo-variant-7.png";
import logoVariant8 from "@/assets/authencore-logo-variant-8.png";
import exactShape1 from "@/assets/authencore-exact-shape-1.png";
import exactShape2 from "@/assets/authencore-exact-shape-2.png";
import exactShape3 from "@/assets/authencore-exact-shape-3.png";
import exactShape4 from "@/assets/authencore-exact-shape-4.png";
import exactShape5 from "@/assets/authencore-exact-shape-5.png";

const logoOptions = [
  {
    id: 1,
    name: "Modern Hexagonal",
    description: "Minimalist hexagonal design with blue-purple gradient",
    image: logoOption1,
  },
  {
    id: 2,
    name: "Neural Network",
    description: "Futuristic interconnected nodes in electric blue and silver",
    image: logoOption2,
  },
  {
    id: 3,
    name: "Elegant Circle",
    description: "Stylized 'A' with flowing lines in gold and dark blue",
    image: logoOption3,
  },
  {
    id: 4,
    name: "Crystal Diamond",
    description: "Dynamic faceted design with prismatic rainbow effects",
    image: logoOption4,
  },
  {
    id: 5,
    name: "Holographic Cube",
    description: "3D isometric cube with neon cyan and magenta glow",
    image: logoOption5,
  },
  {
    id: 6,
    name: "Infinite Flow",
    description: "Metallic infinity symbol representing continuous assessment",
    image: logoOption6,
  },
  {
    id: 7,
    name: "DNA Spiral",
    description: "Geometric helix design with teal and orange gradients",
    image: logoOption7,
  },
  {
    id: 8,
    name: "Wave Pattern",
    description: "Layered sound waves in purple and emerald visualization",
    image: logoOption8,
  },
  {
    id: 9,
    name: "Quantum Particles",
    description: "Glowing orbs with energy trails in electric blue",
    image: logoOption9,
  },
  {
    id: 10,
    name: "Origami Precision",
    description: "Folded paper geometry with coral to navy gradient",
    image: logoOption10,
  },
  {
    id: 11,
    name: "Navy & Gold Classic",
    description: "Interlocking geometric design in navy blue and gold",
    image: logoUpdated,
  },
  {
    id: 12,
    name: "Purple & Silver Elite",
    description: "Sophisticated geometric shapes in purple and metallic silver",
    image: logoVariant2,
  },
  {
    id: 13,
    name: "Teal & Coral Modern",
    description: "Contemporary interlocking design in teal and coral orange",
    image: logoVariant3,
  },
  {
    id: 14,
    name: "Black & Electric Blue",
    description: "Bold interlocking design in black and electric blue",
    image: logoVariant4,
  },
  {
    id: 15,
    name: "Forest & Gold Luxury",
    description: "Premium geometric shapes in forest green and warm gold",
    image: logoVariant5,
  },
  {
    id: 16,
    name: "Burgundy & Charcoal",
    description: "Corporate interlocking design in burgundy red and charcoal gray",
    image: logoVariant6,
  },
  {
    id: 17,
    name: "Emerald & Rose Gold",
    description: "Sophisticated geometric design in deep emerald and rose gold",
    image: logoVariant7,
  },
  {
    id: 18,
    name: "Midnight & Copper",
    description: "Tech-modern interlocking shapes in midnight blue and copper orange",
    image: logoVariant8,
  },
  {
    id: 19,
    name: "Exact Shape - Navy & Gold",
    description: "Your exact geometric shape design in navy blue and gold",
    image: exactShape1,
  },
  {
    id: 20,
    name: "Exact Shape - Purple & Silver",
    description: "Your exact geometric shape design in purple and silver",
    image: exactShape2,
  },
  {
    id: 21,
    name: "Exact Shape - Black & Blue",
    description: "Your exact geometric shape design in black and electric blue",
    image: exactShape3,
  },
  {
    id: 22,
    name: "Exact Shape - Green & Copper",
    description: "Your exact geometric shape design in forest green and copper",
    image: exactShape4,
  },
  {
    id: 23,
    name: "Exact Shape - Burgundy & Gray",
    description: "Your exact geometric shape design in burgundy and charcoal",
    image: exactShape5,
  },
];

export default function LogoGallery() {
  const navigate = useNavigate();
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div>
            <h1 className="text-3xl font-bold text-foreground">AuthenCore Logo Gallery</h1>
            <p className="text-foreground mt-1">
              23 cutting-edge logo designs - Choose your preferred style
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Gallery */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logoOptions.map((logo) => (
            <Card
              key={logo.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedLogo === logo.id
                  ? "ring-2 ring-primary shadow-lg scale-105"
                  : ""
              }`}
              onClick={() => setSelectedLogo(logo.id)}
            >
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Option {logo.id}: {logo.name}
                </h3>
                <p className="text-foreground text-sm leading-relaxed">
                  {logo.description}
                </p>
                {selectedLogo === logo.id && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-primary font-medium text-sm">
                      ✓ Selected - This logo represents innovation and professionalism
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Actions */}
        {selectedLogo && (
          <div className="mt-12 text-center">
            <div className="bg-card p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Logo {selectedLogo} Selected
              </h3>
              <p className="text-foreground mb-6">
                Great choice! This logo perfectly represents AuthenCore's innovative approach to professional assessment.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSelectedLogo(null)} variant="outline">
                  Choose Different
                </Button>
                <Button onClick={() => navigate("/")}>
                  Continue with Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-card p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              About These Designs
            </h3>
            <p className="text-foreground text-sm leading-relaxed">
              Each logo has been crafted to reflect AuthenCore's commitment to cutting-edge technology, 
              professional excellence, and innovative assessment solutions. These designs embody the 
              sophisticated, trustworthy, and forward-thinking nature of your platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: `Professional business image: ${prompt}. Clean, modern, corporate style with high quality`,
          size: "1024x1024",
          quality: "hd"
        }
      });

      if (error) throw error;

      if (data?.data?.[0]?.url) {
        setGeneratedImage(data.data[0].url);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
      } else {
        throw new Error("No image URL received");
      }
    } catch (error: any) {
      // Production analytics tracking
      if (process.env.NODE_ENV === 'development') {
        console.error("Error generating image:", error);
      }
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Image Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">Image Description</Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., team meeting in modern office, professional consultation, business analytics dashboard"
            className="mt-2"
          />
        </div>

        <Button 
          onClick={generateImage} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img 
                src={generatedImage} 
                alt="Generated image"
                className="w-full h-auto"
              />
            </div>
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
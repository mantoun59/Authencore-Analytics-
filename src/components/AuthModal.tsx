import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  type: 'login' | 'register' | null;
  onClose: () => void;
}

const AuthModal = ({ type, onClose }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!type) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: type === 'login' ? "Welcome back!" : "Account created!",
      description: type === 'login' 
        ? "You have been successfully signed in." 
        : "Your account has been created successfully.",
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-lg shadow-elegant max-w-md w-full mx-4 relative animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {type === 'login' ? 'Applicant Sign In' : 'Applicant Registration'}
          </h2>
          <p className="text-muted-foreground">
            {type === 'login' 
              ? 'Welcome back! Please sign in to continue.' 
              : 'Create your account to get started with assessments.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">
              {type === 'login' ? 'Username or Email' : 'Username'}
            </Label>
            <Input
              id="username"
              type="text"
              placeholder={type === 'login' ? 'Enter username or email' : 'Choose a username'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (type === 'login' ? 'Sign In' : 'Register')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-primary hover:text-primary-glow font-medium underline"
            onClick={() => {
              // Switch between login and register
              const newType = type === 'login' ? 'register' : 'login';
              onClose();
              setTimeout(() => {
                // Re-open with new type (this would need to be handled by parent)
              }, 100);
            }}
          >
            {type === 'login' ? 'Register here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
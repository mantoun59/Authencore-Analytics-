import { useState } from 'react';
import { TestTube, User, Shield, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoMode, getDemoUser } from '@/contexts/DemoContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode, demoUser, setDemoUser } = useDemoMode();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDemoMode = () => {
    toggleDemoMode();
    toast({
      title: isDemoMode ? "Demo Mode Disabled" : "Demo Mode Enabled",
      description: isDemoMode 
        ? "Switched back to production mode" 
        : "You can now test all features safely with demo data",
    });
    setIsOpen(false);
  };

  const handleSwitchUser = (role: 'admin' | 'partner' | 'user') => {
    const user = getDemoUser(role);
    setDemoUser(user);
    toast({
      title: "Demo User Switched",
      description: `Now testing as ${user.name} (${role})`,
    });
  };

  if (isDemoMode) {
    return (
      <div className="fixed top-4 right-4 z-[9999]">
        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      DEMO MODE
                    </Badge>
                    {demoUser && (
                      <Badge variant="secondary" className="text-xs">
                        {demoUser.role.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    {demoUser ? `Testing as ${demoUser.name}` : 'Demo data active'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-orange-700">
                      Switch User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demo Mode - Switch User Role</DialogTitle>
                      <DialogDescription>
                        Choose which role to test the platform with
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        variant={demoUser?.role === 'user' ? 'default' : 'outline'}
                        className="justify-start h-auto p-4"
                        onClick={() => handleSwitchUser('user')}
                      >
                        <User className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Regular User</div>
                          <div className="text-sm text-muted-foreground">
                            Test assessments and basic features
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={demoUser?.role === 'partner' ? 'default' : 'outline'}
                        className="justify-start h-auto p-4"
                        onClick={() => handleSwitchUser('partner')}
                      >
                        <Building2 className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Partner</div>
                          <div className="text-sm text-muted-foreground">
                            Access partner dashboard and analytics
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={demoUser?.role === 'admin' ? 'default' : 'outline'}
                        className="justify-start h-auto p-4"
                        onClick={() => handleSwitchUser('admin')}
                      >
                        <Shield className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Administrator</div>
                          <div className="text-sm text-muted-foreground">
                            Full admin access and management tools
                          </div>
                        </div>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleDemoMode}
                  className="text-orange-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <Button
        onClick={handleToggleDemoMode}
        variant="outline"
        size="lg"
        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 shadow-lg"
      >
        <TestTube className="h-4 w-4 mr-2" />
        Enable Demo Mode
      </Button>
    </div>
  );
};
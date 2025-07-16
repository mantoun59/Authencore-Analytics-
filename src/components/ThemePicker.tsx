import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Palette, Moon, Sun, Crown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes, getAvailableThemes } from '@/lib/themes';
import { useAuth } from '@/contexts/AuthContext';

interface ThemePickerProps {
  className?: string;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ className }) => {
  const { currentTheme, isDark, setTheme, toggleDarkMode, isLoading } = useTheme();
  const { user } = useAuth();
  
  // For now, assume user is premium if they're logged in
  // In a real app, you'd check subscription status
  const isPremium = !!user;
  const availableThemes = getAvailableThemes(isPremium);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Theme Customization</h2>
        {isPremium && (
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Dark Mode
          </CardTitle>
          <CardDescription>
            Toggle between light and dark themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleDarkMode}
            />
            <Label htmlFor="dark-mode">
              {isDark ? 'Dark' : 'Light'} mode
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              currentTheme === theme.id
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            }`}
            onClick={() => !isLoading && setTheme(theme.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                {theme.isPremium && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Theme Preview */}
              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </div>
                <div
                  className="w-full h-12 rounded-md border"
                  style={{ backgroundColor: theme.preview.background }}
                />
              </div>

              {/* Hero Image Preview */}
              {theme.heroImage && (
                <div className="mb-4">
                  <img
                    src={theme.heroImage}
                    alt={`${theme.name} preview`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              )}

              <Button
                variant={currentTheme === theme.id ? 'default' : 'outline'}
                className="w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme.id);
                }}
              >
                {currentTheme === theme.id ? 'Active' : 'Apply Theme'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isPremium && (
        <Card className="border-dashed border-2 border-muted-foreground/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Unlock Premium Themes
            </CardTitle>
            <CardDescription>
              Get access to professional corporate themes and advanced customization options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
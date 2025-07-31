import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Contrast, 
  Type, 
  RotateCcw 
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AccessibilityToolbar = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-background border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open accessibility settings"
        >
          <Accessibility className="w-5 h-5" />
          <span className="sr-only">Accessibility Settings</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            Accessibility Settings
          </SheetTitle>
          <SheetDescription>
            Customize your viewing experience with these accessibility options.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Font Size */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Size
              </CardTitle>
              <CardDescription>
                Adjust the text size for better readability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={settings.fontSize}
                onValueChange={(value: 'normal' | 'large' | 'extra-large') => 
                  updateSetting('fontSize', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (16px)</SelectItem>
                  <SelectItem value="large">Large (18px)</SelectItem>
                  <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* High Contrast */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                High Contrast
              </CardTitle>
              <CardDescription>
                Increase contrast for better visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
                <Label htmlFor="high-contrast">
                  {settings.highContrast ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Reduced Motion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Reduce Motion
              </CardTitle>
              <CardDescription>
                Minimize animations and transitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
                <Label htmlFor="reduced-motion">
                  {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Color Blind Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Color Blind Support
              </CardTitle>
              <CardDescription>
                Adjust colors for different types of color blindness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={settings.colorBlindMode}
                onValueChange={(value: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => 
                  updateSetting('colorBlindMode', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Screen Reader Mode */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Screen Reader Mode
              </CardTitle>
              <CardDescription>
                Enhanced focus indicators and keyboard navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="screen-reader"
                  checked={settings.screenReaderMode}
                  onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                />
                <Label htmlFor="screen-reader">
                  {settings.screenReaderMode ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="pt-4">
            <Button
              onClick={resetSettings}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Keyboard Shortcuts Info */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>• Tab: Navigate between elements</div>
              <div>• Enter/Space: Activate buttons</div>
              <div>• Escape: Close dialogs</div>
              <div>• Alt + A: Open accessibility menu</div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilityToolbar;
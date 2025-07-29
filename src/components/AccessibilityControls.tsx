import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Settings, Eye, Volume2, MousePointer, Palette } from 'lucide-react';

interface AccessibilityControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Font Size
            </Label>
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
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              High Contrast
            </Label>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Reduce Motion
            </Label>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
            />
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Screen Reader Mode
            </Label>
            <Switch
              checked={settings.screenReaderMode}
              onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
            />
          </div>

          <Separator />

          {/* Color Blind Support */}
          <div className="space-y-2">
            <Label>Color Vision Support</Label>
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
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex-1"
            >
              Reset to Default
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
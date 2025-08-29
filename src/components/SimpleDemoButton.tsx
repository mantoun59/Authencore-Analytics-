import { TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/contexts/DemoContext';
import { useToast } from '@/hooks/use-toast';

// Simple demo button for testing
export const SimpleDemoButton = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { toast } = useToast();
  
  console.log('SimpleDemoButton rendering:', { isDemoMode }); // Debug log
  
  const handleClick = () => {
    toggleDemoMode();
    
    if (!isDemoMode) {
      toast({
        title: "Demo Mode Enabled",
        description: "You can now explore the platform with sample data.",
      });
    } else {
      toast({
        title: "Demo Mode Disabled", 
        description: "Switched back to production mode.",
      });
    }
    
    console.log('Demo button clicked, new state will be:', !isDemoMode);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        backgroundColor: 'red',
        padding: '10px',
        borderRadius: '8px'
      }}
    >
      <Button 
        onClick={handleClick}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px 24px'
        }}
      >
        <TestTube style={{ marginRight: '8px', width: '16px', height: '16px' }} />
        {isDemoMode ? 'DISABLE DEMO' : 'ENABLE DEMO'}
      </Button>
    </div>
  );
};
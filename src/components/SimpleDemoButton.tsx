import { TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/contexts/DemoContext';
import { useToast } from '@/hooks/use-toast';

export const SimpleDemoButton = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { toast } = useToast();
  
  console.log('SimpleDemoButton rendering:', { isDemoMode }); // Debug log
  
  const handleClick = () => {
    try {
      console.log('Button clicked - current demo mode:', isDemoMode);
      
      // Toggle demo mode
      console.log('Calling toggleDemoMode...');
      toggleDemoMode();
      console.log('Demo mode toggled successfully');
      
      // Try toast after successful toggle
      try {
        console.log('Attempting to show toast...');
        const toastResult = toast({
          title: !isDemoMode ? "Demo Mode Enabled" : "Demo Mode Disabled",
          description: !isDemoMode ? "You can now explore the platform with sample data." : "Switched back to production mode.",
        });
        console.log('Toast result:', toastResult);
      } catch (toastError) {
        console.error('Toast error:', toastError);
        alert(`Demo mode ${!isDemoMode ? 'enabled' : 'disabled'} (toast failed)`);
      }
    } catch (error) {
      console.error('Button click error:', error);
      alert(`Error: ${error.message}`);
    }
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
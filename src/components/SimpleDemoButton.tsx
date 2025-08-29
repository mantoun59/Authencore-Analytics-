import { TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple demo button for testing
export const SimpleDemoButton = () => {
  console.log('SimpleDemoButton rendering'); // Debug log
  
  const handleClick = () => {
    alert('Demo mode button clicked!');
    console.log('Demo button clicked');
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
        DEMO MODE
      </Button>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ShieldCheck, Copy, Eye, EyeOff } from 'lucide-react';
import { useMFA } from '@/hooks/useMFA';
import { useSecurity } from '@/hooks/useSecurity';
import { useToast } from '@/hooks/use-toast';

const MFASetup = () => {
  const { mfaSetup, isLoading, setupMFA, verifyAndEnableMFA, disableMFA, getMFAStatus } = useMFA();
  const { logSecurityEvent } = useSecurity();
  const { toast } = useToast();
  
  const [verificationToken, setVerificationToken] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    getMFAStatus();
  }, [getMFAStatus]);

  const handleSetupMFA = async () => {
    try {
      const result = await setupMFA();
      setQrCodeUrl(result.qrCodeUrl);
      setSecret(result.secret);
      setBackupCodes(result.backupCodes);
      
      await logSecurityEvent('mfa_setup_initiated');
      toast({
        title: 'MFA Setup Started',
        description: 'Scan the QR code with your authenticator app',
      });
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'Failed to set up MFA. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyMFA = async () => {
    if (!verificationToken) return;
    
    setIsVerifying(true);
    try {
      await verifyAndEnableMFA(verificationToken);
      await logSecurityEvent('mfa_enabled');
      toast({
        title: 'MFA Enabled',
        description: 'Two-factor authentication has been successfully enabled',
      });
      setShowBackupCodes(true);
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Invalid token. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisableMFA = async () => {
    try {
      await disableMFA();
      await logSecurityEvent('mfa_disabled');
      toast({
        title: 'MFA Disabled',
        description: 'Two-factor authentication has been disabled',
      });
      setQrCodeUrl('');
      setSecret('');
      setBackupCodes([]);
      setShowBackupCodes(false);
    } catch (error) {
      toast({
        title: 'Failed to Disable',
        description: 'Failed to disable MFA. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading MFA settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Multi-Factor Authentication
          {mfaSetup?.is_enabled && (
            <Badge variant="outline" className="ml-2">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!mfaSetup?.is_enabled ? (
          <>
            {!qrCodeUrl ? (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Enable two-factor authentication to add an extra layer of security to your account.
                    You'll need an authenticator app like Google Authenticator or Authy.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleSetupMFA} disabled={isLoading}>
                  Setup Two-Factor Authentication
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img src={qrCodeUrl} alt="QR Code for MFA setup" className="w-48 h-48" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Or enter this secret manually:</Label>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-token">Enter verification code:</Label>
                  <Input
                    id="verification-token"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleVerifyMFA} 
                    disabled={!verificationToken || isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify and Enable MFA'}
                  </Button>
                </div>
              </div>
            )}

            {showBackupCodes && backupCodes.length > 0 && (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Save these backup codes in a safe place. 
                    You can use them to access your account if you lose your authenticator device.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Backup Codes</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(backupCodes.join('\n'))}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-background p-2 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is enabled on your account. 
                Your account is protected with an additional layer of security.
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="destructive" 
              onClick={handleDisableMFA}
            >
              Disable Two-Factor Authentication
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASetup;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, Plus, Edit, Trash2, Eye, Users, Shield, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDialog } from '@/components/ui/dialog-components';
import { format } from 'date-fns';

interface Partner {
  id: string;
  username: string;
  organization_name: string;
  contact_email: string;
  access_expires_at: string;
  is_active: boolean;
  created_at: string;
  permissions: string[];
}

interface AccessLog {
  id: string;
  partner_id: string;
  assessment_type: string | null;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  partner_info: {
    username: string;
    organization_name: string;
  };
}

const ASSESSMENT_TYPES = [
  'emotional-intelligence',
  'leadership',
  'communication',
  'stress-resilience',
  'cultural-intelligence',
  'faith-values',
  'career-launch',
  'digital-wellness',
  'cair',
  'genz'
];

export const PartnerManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    organization_name: '',
    contact_email: '',
    access_duration: '30', // days
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchPartners();
    fetchAccessLogs();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data: partnersData, error } = await supabase
        .from('partner_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch permissions for each partner
      const partnersWithPermissions = await Promise.all(
        partnersData.map(async (partner) => {
          const { data: permissions } = await supabase
            .from('partner_access_permissions')
            .select('assessment_type')
            .eq('partner_id', partner.id)
            .eq('can_access', true);

          return {
            ...partner,
            permissions: permissions?.map(p => p.assessment_type) || []
          };
        })
      );

      setPartners(partnersWithPermissions);
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching partners:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch partners',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessLogs = async () => {
    try {
      const { data: logsData, error } = await supabase
        .from('partner_access_logs')
        .select(`
          *,
          partner_accounts!inner (
            username,
            organization_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedLogs = logsData.map(log => ({
        ...log,
        partner_info: {
          username: log.partner_accounts.username,
          organization_name: log.partner_accounts.organization_name
        }
      }));

      setAccessLogs(formattedLogs);
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching access logs:', error);
      }
    }
  };

  const generatePassword = () => {
    // Generate secure password using Web Crypto API
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(array[i] % chars.length);
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const accessExpiresAt = new Date();
      accessExpiresAt.setDate(accessExpiresAt.getDate() + parseInt(formData.access_duration));

      if (editingPartner) {
        // Update existing partner
        const { error } = await supabase
          .from('partner_accounts')
          .update({
            organization_name: formData.organization_name,
            contact_email: formData.contact_email,
            access_expires_at: accessExpiresAt.toISOString(),
            ...(formData.password && { password_hash: `crypt('${formData.password}', gen_salt('bf'))` })
          })
          .eq('id', editingPartner.id);

        if (error) throw error;

        // Update permissions
        await supabase
          .from('partner_access_permissions')
          .delete()
          .eq('partner_id', editingPartner.id);

        if (formData.permissions.length > 0) {
          const permissionInserts = formData.permissions.map(assessmentType => ({
            partner_id: editingPartner.id,
            assessment_type: assessmentType,
            can_access: true
          }));

          await supabase
            .from('partner_access_permissions')
            .insert(permissionInserts);
        }

        toast({
          title: 'Success',
          description: 'Partner updated successfully'
        });
      } else {
        // Create new partner
        const { data: partnerData, error } = await supabase
          .from('partner_accounts')
          .insert({
            username: formData.username,
            password_hash: `crypt('${formData.password}', gen_salt('bf'))`,
            organization_name: formData.organization_name,
            contact_email: formData.contact_email,
            access_expires_at: accessExpiresAt.toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        // Add permissions
        if (formData.permissions.length > 0) {
          const permissionInserts = formData.permissions.map(assessmentType => ({
            partner_id: partnerData.id,
            assessment_type: assessmentType,
            can_access: true
          }));

          await supabase
            .from('partner_access_permissions')
            .insert(permissionInserts);
        }

        // Send credentials email
        try {
          await supabase.functions.invoke('send-partner-credentials', {
            body: {
              email: formData.contact_email,
              username: formData.username,
              password: formData.password,
              organization: formData.organization_name,
              expires_at: accessExpiresAt.toISOString(),
              permissions: formData.permissions,
              login_url: `${window.location.origin}/partner-login`
            }
          });

          toast({
            title: 'Success',
            description: 'Partner created and credentials sent via email'
          });
        } catch (emailError) {
          // Log for debugging in development only
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to send credentials email:', emailError);
          }
          toast({
            title: 'Partner Created',
            description: 'Partner created successfully, but failed to send credentials email. Please share credentials manually.',
            variant: 'destructive'
          });
        }
      }

      setIsDialogOpen(false);
      setEditingPartner(null);
      setFormData({
        username: '',
        password: '',
        organization_name: '',
        contact_email: '',
        access_duration: '30',
        permissions: []
      });
      fetchPartners();
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving partner:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to save partner',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      username: partner.username,
      password: '',
      organization_name: partner.organization_name,
      contact_email: partner.contact_email,
      access_duration: '30',
      permissions: partner.permissions
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (partnerId: string) => {
    setPartnerToDelete(partnerId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!partnerToDelete) return;

    try {
      const { error } = await supabase
        .from('partner_accounts')
        .delete()
        .eq('id', partnerToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Partner deleted successfully',
      });
      fetchPartners();
      setShowDeleteDialog(false);
      setPartnerToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete partner',
        variant: 'destructive',
      });
    }
  };

  const togglePartnerStatus = async (partnerId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('partner_accounts')
        .update({ is_active: !isActive })
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Partner ${!isActive ? 'activated' : 'deactivated'} successfully`
      });
      fetchPartners();
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating partner status:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to update partner status',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partner Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPartner(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
              <DialogDescription>
                {editingPartner ? 'Update partner information and permissions' : 'Create a new partner account with time-limited access'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={!!editingPartner}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required={!editingPartner}
                      placeholder={editingPartner ? "Leave blank to keep current" : ""}
                    />
                    <Button type="button" variant="outline" onClick={generatePassword}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Access Duration</Label>
                <Select value={formData.access_duration} onValueChange={(value) => setFormData(prev => ({ ...prev, access_duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assessment Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ASSESSMENT_TYPES.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.permissions.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, permissions: [...prev.permissions, type] }));
                          } else {
                            setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== type) }));
                          }
                        }}
                      />
                      <Label htmlFor={type} className="text-sm capitalize">
                        {type.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPartner ? 'Update' : 'Create'} Partner
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="partners" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partners">
            <Users className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="mr-2 h-4 w-4" />
            Access Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="partners" className="mt-6">
          <div className="grid gap-4">
            {partners.map(partner => (
              <Card key={partner.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{partner.organization_name}</CardTitle>
                      <CardDescription>
                        Username: {partner.username} • {partner.contact_email}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={partner.is_active ? "default" : "secondary"}>
                        {partner.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={new Date(partner.access_expires_at) > new Date() ? "default" : "destructive"}>
                        {new Date(partner.access_expires_at) > new Date() ? "Valid" : "Expired"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Expires: {format(new Date(partner.access_expires_at), 'PPP')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {partner.permissions.map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePartnerStatus(partner.id, partner.is_active)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(partner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Access Logs</CardTitle>
              <CardDescription>Monitor partner activity and access patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{log.partner_info.organization_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.partner_info.username} • {log.action}
                        {log.assessment_type && ` • ${log.assessment_type}`}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), 'PPp')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setPartnerToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Partner"
        description="Are you sure you want to delete this partner? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Plus } from 'lucide-react';

interface PartnerPricing {
  id: string;
  partner_id: string;
  assessment_type: string;
  min_quantity: number;
  discount_percentage?: number;
  fixed_price?: number;
  is_active: boolean;
  created_at: string;
}

interface Partner {
  id: string;
  username: string;
  organization_name: string;
  contact_email: string;
}

export const PartnerPricingManager: React.FC = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerPricing, setPartnerPricing] = useState<PartnerPricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partner_id: '',
    assessment_type: '',
    min_quantity: 1,
    discount_percentage: '',
    fixed_price: '',
    pricing_type: 'discount' // 'discount' or 'fixed'
  });

  const assessmentTypes = [
    'career-launch',
    'cair-personality', 
    'stress-resilience',
    'cultural-intelligence',
    'communication-styles',
    'emotional-intelligence',
    'faith-values',
    'genz-assessment',
    'all' // For bulk pricing across all assessments
  ];

  useEffect(() => {
    fetchPartners();
    fetchPartnerPricing();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_accounts')
        .select('id, username, organization_name, contact_email')
        .eq('is_active', true)
        .order('organization_name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to load partners",
        variant: "destructive",
      });
    }
  };

  const fetchPartnerPricing = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_pricing')
        .select(`
          *,
          partner_accounts(username, organization_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartnerPricing(data || []);
    } catch (error: any) {
      console.error('Error fetching partner pricing:', error);
      toast({
        title: "Error",
        description: "Failed to load partner pricing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const pricingData = {
        partner_id: formData.partner_id,
        assessment_type: formData.assessment_type,
        min_quantity: formData.min_quantity,
        discount_percentage: formData.pricing_type === 'discount' && formData.discount_percentage 
          ? parseFloat(formData.discount_percentage) 
          : null,
        fixed_price: formData.pricing_type === 'fixed' && formData.fixed_price 
          ? parseFloat(formData.fixed_price) 
          : null,
        is_active: true
      };

      let result;
      if (editingId) {
        result = await supabase
          .from('partner_pricing')
          .update(pricingData)
          .eq('id', editingId);
      } else {
        result = await supabase
          .from('partner_pricing')
          .insert(pricingData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: editingId ? "Pricing updated successfully" : "Pricing created successfully",
        variant: "default",
      });

      resetForm();
      fetchPartnerPricing();
    } catch (error: any) {
      console.error('Error saving partner pricing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save pricing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pricing: PartnerPricing) => {
    setFormData({
      partner_id: pricing.partner_id,
      assessment_type: pricing.assessment_type,
      min_quantity: pricing.min_quantity,
      discount_percentage: pricing.discount_percentage?.toString() || '',
      fixed_price: pricing.fixed_price?.toString() || '',
      pricing_type: pricing.fixed_price ? 'fixed' : 'discount'
    });
    setEditingId(pricing.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;

    try {
      const { error } = await supabase
        .from('partner_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing rule deleted successfully",
        variant: "default",
      });

      fetchPartnerPricing();
    } catch (error: any) {
      console.error('Error deleting partner pricing:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing rule",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      partner_id: '',
      assessment_type: '',
      min_quantity: 1,
      discount_percentage: '',
      fixed_price: '',
      pricing_type: 'discount'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Partner Pricing Management</CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "default"}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add Pricing Rule'}
          </Button>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partner">Partner Organization</Label>
                <Select
                  value={formData.partner_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, partner_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.organization_name} ({partner.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assessment_type">Assessment Type</Label>
                <Select
                  value={formData.assessment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assessment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Assessments' : type.replace('-', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="min_quantity">Minimum Quantity</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  min="1"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div>
                <Label htmlFor="pricing_type">Pricing Type</Label>
                <Select
                  value={formData.pricing_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Percentage Discount</SelectItem>
                    <SelectItem value="fixed">Fixed Price Per Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.pricing_type === 'discount' && (
                <div>
                  <Label htmlFor="discount_percentage">Discount Percentage</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 15.5"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                  />
                </div>
              )}

              {formData.pricing_type === 'fixed' && (
                <div>
                  <Label htmlFor="fixed_price">Fixed Price Per Unit</Label>
                  <Input
                    id="fixed_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 19.99"
                    value={formData.fixed_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixed_price: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Pricing' : 'Create Pricing'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Assessment Type</TableHead>
                <TableHead>Min Quantity</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerPricing.map((pricing: any) => (
                <TableRow key={pricing.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pricing.partner_accounts?.organization_name}</div>
                      <div className="text-sm text-muted-foreground">{pricing.partner_accounts?.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {pricing.assessment_type === 'all' ? 'All Assessments' : pricing.assessment_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{pricing.min_quantity}+</TableCell>
                  <TableCell>
                    {pricing.discount_percentage ? (
                      <span className="text-green-600">{pricing.discount_percentage}% off</span>
                    ) : (
                      <span className="text-blue-600">${pricing.fixed_price}/unit</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pricing.is_active ? "default" : "secondary"}>
                      {pricing.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pricing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(pricing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
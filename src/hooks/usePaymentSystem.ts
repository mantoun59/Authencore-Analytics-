import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  plan_type: string;
  price: number;
  currency: string;
  billing_interval: string;
  assessment_access: any;
}

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
  assessment_type?: string;
  guest_email?: string;
  guest_name?: string;
}

interface PaymentSystemHook {
  paymentPlans: PaymentPlan[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (planId: string, options?: CreateOrderOptions) => Promise<any>;
  updatePaymentStatus: (orderId: string, status: string, reference?: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getUserOrders: () => Promise<Order[]>;
  checkGuestAccess: (token: string, assessmentType: string) => Promise<boolean>;
  refetchPlans: () => void;
}

interface CreateOrderOptions {
  assessmentType?: string;
  guestInfo?: {
    email: string;
    name: string;
  };
  billingInfo?: any;
  quantity?: number;
}

export const usePaymentSystem = (): PaymentSystemHook => {
  const { toast } = useToast();
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPaymentPlans(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching payment plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (planId: string, options: CreateOrderOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: {
          planId,
          assessmentType: options.assessmentType,
          guestInfo: options.guestInfo,
          billingInfo: options.billingInfo,
          quantity: options.quantity || 1,
        }
      });

      if (error) throw error;

      toast({
        title: "Order Created",
        description: "Your order has been created successfully",
        variant: "default",
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Order Failed",
        description: err.message || "Failed to create order",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, status: string, reference?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.functions.invoke('update-payment-status', {
        body: {
          orderId,
          paymentStatus: status,
          paymentReference: reference,
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Updated",
        description: `Payment status updated to ${status}`,
        variant: "default",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update payment status",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const getUserOrders = async (): Promise<Order[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching user orders:', err);
      return [];
    }
  };

  const checkGuestAccess = async (token: string, assessmentType: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_guest_access', {
        p_token: token,
        p_assessment_type: assessmentType
      });

      if (error) throw error;
      return data || false;
    } catch (err: any) {
      console.error('Error checking guest access:', err);
      return false;
    }
  };

  const refetchPlans = () => {
    fetchPaymentPlans();
  };

  useEffect(() => {
    fetchPaymentPlans();
  }, []);

  return {
    paymentPlans,
    orders,
    loading,
    error,
    createOrder,
    updatePaymentStatus,
    getOrder,
    getUserOrders,
    checkGuestAccess,
    refetchPlans,
  };
};
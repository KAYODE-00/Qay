import { getQayAdmin } from '@/qay/lib/supabase-admin';
import type { QayPlanKey } from './plan-limits';

type ApplyQayBillingPlanInput = {
  userId: string;
  plan: QayPlanKey;
  status: string;
  metadata?: Record<string, unknown>;
};

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === 'string' && value ? value : null;
}

export async function applyQayBillingPlan({
  userId,
  plan,
  status,
  metadata = {},
}: ApplyQayBillingPlanInput) {
  if (!userId) return;

  const supabase = getQayAdmin() as any;
  const updatedAt = new Date().toISOString();
  const normalizedStatus = status === 'canceled' || status === 'cancelled' ? 'canceled' : status;
  const appliedPlan = normalizedStatus === 'canceled' ? 'free' : plan;
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);

  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(authUser?.user?.app_metadata || {}),
      qay_plan: appliedPlan,
      qay_plan_updated_at: updatedAt,
      ...metadata,
    },
  });

  await supabase
    .from('qay_sites')
    .update({ plan: appliedPlan, updated_at: updatedAt })
    .eq('owner_id', userId);

  await supabase
    .from('qay_subscriptions')
    .upsert({
      user_id: userId,
      plan: appliedPlan,
      status: normalizedStatus,
      billing_cycle: metadataString(metadata, 'qay_flutterwave_billing_cycle') || 'month',
      flw_tx_ref: metadataString(metadata, 'qay_flutterwave_tx_ref'),
      flw_tx_id: metadataString(metadata, 'qay_flutterwave_tx_id'),
      current_period_end: metadataString(metadata, 'qay_flutterwave_current_period_end'),
      updated_at: updatedAt,
    }, { onConflict: 'user_id' });
}

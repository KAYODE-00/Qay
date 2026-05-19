'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { QAY_PLANS, type QayPlanKey } from '@/qay/lib/billing/plan-limits';

type UpgradeModalProps = {
  plan: QayPlanKey;
};

export function UpgradeModal({ plan }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingStatus, setBillingStatus] = useState<string | null>(null);
  const planDetails = QAY_PLANS[plan];

  useEffect(() => {
    setBillingStatus(new URLSearchParams(window.location.search).get('billing'));
  }, []);

  const startCheckout = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/qay/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const payload = await response.json().catch(() => null);
      if (response.status === 401) {
        window.location.assign('/login?next=/pricing');
        return;
      }

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to start checkout');
      }

      const link = payload?.data?.link;
      if (typeof link !== 'string' || !link) {
        throw new Error('Checkout link was not returned');
      }

      window.location.assign(link);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout');
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {billingStatus === 'success' && (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Plan upgraded successfully.
        </p>
      )}
      {billingStatus === 'failed' && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Payment could not be verified. Please try again.
        </p>
      )}
      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="w-full bg-white text-black hover:bg-white/90"
      >
        {isLoading ? 'Opening checkout...' : `Upgrade to ${planDetails.name}`}
      </Button>
    </div>
  );
}

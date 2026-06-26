import { requireDeveloper } from '@/qay/lib/auth-guard';
import { getUserQayPlan } from '@/qay/lib/billing/plan-limits';
import ComponentSubmissionManager from '@/qay/components/dashboard/ComponentSubmissionManager';

export default async function DashboardComponentsPage() {
  const user = await requireDeveloper();
  const plan = getUserQayPlan(user);

  return <ComponentSubmissionManager plan={plan} />;
}

'use client';

import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type PlanRestrictionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
};

export function PlanRestrictionDialog({
  open,
  onOpenChange,
  title = 'Upgrade needed',
  message = 'Your current plan does not include this action. Upgrade to continue.',
}: PlanRestrictionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button" variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Not now
          </Button>
          <Button asChild type="button">
            <Link href="/pricing">View plans</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

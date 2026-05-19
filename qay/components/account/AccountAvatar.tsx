import type { QayAccountProfile } from '@/qay/lib/account';

type AccountAvatarProps = {
  profile: Pick<QayAccountProfile, 'email' | 'full_name' | 'avatar_url'>;
  className?: string;
};

export function AccountAvatar({ profile, className = '' }: AccountAvatarProps) {
  const label = profile.full_name || profile.email || 'QAY';
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground ${className}`}>
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar_url} alt="" className="size-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

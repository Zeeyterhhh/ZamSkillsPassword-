import React from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  isDemo?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showDemoBadge?: boolean;
}

/**
 * Helper to compute 2-character initials from a person's full name or organization name.
 * Examples:
 *  "Aminu Bello Gusau" -> "AB"
 *  "Fatima Abubakar Mafara" -> "FA"
 *  "Ibrahim Hassan Kaura" -> "IH"
 *  "Zamfara Innovation Hub" -> "ZI"
 */
export const getInitials = (fullName: string = ''): string => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Helper to determine if an image URL is a seed/placeholder face from unsplash or dicebear
 */
export const isSeedAvatarUrl = (url?: string): boolean => {
  if (!url || !url.trim()) return true;
  if (url.includes('unsplash.com') || url.includes('dicebear.com')) return true;
  return false;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  isDemo = false,
  size = 'md',
  className = '',
  showDemoBadge = false
}) => {
  const initials = getInitials(name);
  const hasRealUploadedPhoto = Boolean(avatarUrl && avatarUrl.trim().length > 0 && !isSeedAvatarUrl(avatarUrl));

  // Preset size dimensions
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-2xl'
  }[size] || 'w-10 h-10 text-sm';

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center font-black select-none ${className}`}>
      {hasRealUploadedPhoto ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses} rounded-2xl object-cover border-2 border-emerald-800 shadow-sm`}
          onError={(e) => {
            // If image fails to load, fallback to avatar box
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-amber-300 border-2 border-emerald-700/80 flex items-center justify-center shadow-sm tracking-wider`}
          title={`${name}${isDemo ? ' (Demo Account)' : ''}`}
        >
          <span>{initials}</span>
        </div>
      )}

      {showDemoBadge && (
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border border-emerald-950 shadow-sm leading-tight">
          DEMO
        </span>
      )}
    </div>
  );
};

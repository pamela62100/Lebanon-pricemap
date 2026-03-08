/** Format a number as LBP with commas: 138500 → "138,500 LBP" */
export function formatLBP(amount: number): string {
  return `${amount.toLocaleString('en-US')} LBP`;
}

/** Format a number with commas only: 138500 → "138,500" */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('en-US');
}

/** Merge class names, filtering out falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Check if a date is older than N hours */
export function isOlderThan(dateStr: string, hours: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diff > hours;
}

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Get relative time string: "2 hours ago", "3 days ago" */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Get countdown string: "3d 14h 45m" */
export function getCountdown(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Get feedback type icon */
export function getFeedbackIcon(type: string): string {
  switch (type) {
    case 'wrong_price': return '⚠️';
    case 'outdated': return '🕐';
    case 'wrong_store': return '📍';
    case 'fake_receipt': return '🚩';
    default: return '💬';
  }
}

/** Get feedback type label */
export function getFeedbackLabel(type: string): string {
  switch (type) {
    case 'wrong_price': return 'Wrong Price';
    case 'outdated': return 'Outdated';
    case 'wrong_store': return 'Wrong Store';
    case 'fake_receipt': return 'Fake Receipt';
    default: return 'General';
  }
}

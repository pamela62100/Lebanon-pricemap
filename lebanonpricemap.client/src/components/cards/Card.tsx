import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  icon?: React.ReactNode;
  header?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'standard' | 'interactive' | 'footer';
}

/**
 * Redesigned Card component following the 'Warm Dark Editorial Terminal' aesthetic.
 * Uses .card class from index.css for base styling and hover effects.
 */
export const Card: React.FC<CardProps> = ({ 
  icon, 
  header, 
  body, 
  footer, 
  className, 
  children, 
  onClick,
  variant = 'standard'
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;
  const hasFooter = variant === 'footer' || !!footer;

  return (
    <div 
      className={cn(
        'card h-full flex flex-col hover:border-primary/40 hover:shadow-glass group',
        isInteractive && 'cursor-pointer',
        className
      )} 
      onClick={onClick}
    >
      <div className={cn('p-6 flex-1', hasFooter && 'pb-4')}>
        {icon && <div className="mb-5 text-primary">{icon}</div>}
        {header && <h3 className="text-xl text-text-main mb-3 leading-snug font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{header}</h3>}
        {body && <div className="text-sm text-text-sub leading-relaxed font-medium">{body}</div>}
        {children}
      </div>

      {hasFooter && (
        <div className="px-5 py-3 border-t border-border-soft flex justify-end gap-2 bg-bg-muted/30">
          {footer}
        </div>
      )}
    </div>
  );
};
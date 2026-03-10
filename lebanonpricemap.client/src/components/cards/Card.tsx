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

export const Card: React.FC<CardProps> = ({
  icon,
  header,
  body,
  footer,
  className,
  children,
  onClick,
  variant = 'standard',
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;
  const hasFooter = variant === 'footer' || !!footer;

  return (
    <div
      className={cn(
        'bg-white border border-border-soft rounded-[28px] shadow-sm h-full flex flex-col transition-all duration-200',
        isInteractive && 'cursor-pointer hover:border-text-main/10 hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('p-5 sm:p-6 flex-1', hasFooter && 'pb-4')}>
        {icon ? <div className="mb-4 text-primary">{icon}</div> : null}

        {header ? (
          <h3
            className="text-xl sm:text-2xl text-text-main mb-2 leading-snug font-bold"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {header}
          </h3>
        ) : null}

        {body ? <div className="text-sm sm:text-base text-text-sub leading-relaxed">{body}</div> : null}

        {children}
      </div>

      {hasFooter ? (
        <div className="px-5 sm:px-6 py-4 border-t border-border-soft flex justify-end gap-2 bg-bg-muted/30">
          {footer}
        </div>
      ) : null}
    </div>
  );
};
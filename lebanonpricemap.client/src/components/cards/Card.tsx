import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  icon?: React.ReactNode;
  header?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  padding?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ icon, header, body, footer, className, padding, children, onClick }) => {
  return (
    <div className={cn('card', padding, className)} onClick={onClick}>
      {icon && <div className="mb-2">{icon}</div>}
      {header && <div className="card-header">{header}</div>}
      {body && <div className="card-body">{body}</div>}
      {footer && <div className="card-footer">{footer}</div>}
      {children}
    </div>
  );
};
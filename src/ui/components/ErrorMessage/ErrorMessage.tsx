import React, { FunctionComponent } from 'react';

import $ from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  message: string;
  variant?: 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onDismiss?: () => void;
  showIcon?: boolean;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  message,
  variant = 'error',
  size = 'medium',
  className,
  onDismiss,
  showIcon = true
}) => {
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (variant) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div 
      className={`${$.errorMessage} ${$[variant]} ${$[size]} ${className || ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={$.content}>
        {showIcon && <span className={$.icon}>{getIcon()}</span>}
        <span className={$.message}>{message}</span>
        {onDismiss && (
          <button
            className={$.dismissButton}
            onClick={onDismiss}
            aria-label="Dismiss error message"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

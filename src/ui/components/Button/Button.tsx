import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";
import cx from "classnames";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: 'small' | 'medium';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
}) => {
  const combinedDisabled = disabled || loading;
  
  return (
    <button
      className={cx($.button, {
        [$.primary]: variant === "primary",
        [$.secondary]: variant === "secondary",
        [$.danger]: variant === "danger",
        [$.small]: size === "small",
      })}
      type={type}
      onClick={onClick}
      disabled={combinedDisabled}
      aria-busy={loading}
      aria-disabled={combinedDisabled}
    >
      {loading && (
        <div 
          className={$.loadingSpinner} 
          data-testid="loading-spinner"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;

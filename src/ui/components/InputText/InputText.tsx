import React, { FunctionComponent } from "react";
import cx from "classnames";

import $ from "./InputText.module.css";

interface InputTextProps {
  name: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  showValidation?: boolean;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  error,
  touched = false,
  showValidation = false,
}) => {
  const hasError = showValidation && touched && error;
  
  return (
    <div className={$.inputContainer}>
      <input
        aria-label={name}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={cx($.inputText, {
          [$.error]: hasError,
        })}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {hasError && (
        <div 
          id={`${name}-error`}
          className={$.errorMessage}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default InputText;

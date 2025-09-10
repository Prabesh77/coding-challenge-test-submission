import React, { FunctionComponent, ReactNode } from 'react';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import Radio from '../Radio/Radio';
import $ from './Form.module.css';

// Base form field properties
interface BaseFormField {
  name: string;
  error?: string;
  touched?: boolean;
  showValidation?: boolean;
}

// InputText specific properties
interface InputTextField extends BaseFormField {
  type: 'text';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  extraProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 
    'name' | 'placeholder' | 'value' | 'onChange' | 'onBlur' | 'type'>;
}

// Radio specific properties
interface RadioField extends BaseFormField {
  type: 'radio';
  checked?: boolean;
  children?: ReactNode;
  extraProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 
    'id' | 'name' | 'onChange' | 'checked' | 'type' | 'value'>;
}

// Union type for all form field types
export type FormField = InputTextField | RadioField;

export interface FormProps {
  legend: string;
  loading?: boolean;
  fields: FormField[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  submitVariant?: 'primary' | 'secondary';
  submitSize?: 'small' | 'medium';
  className?: string;
}

const Form: FunctionComponent<FormProps> = ({
  legend,
  loading = false,
  fields,
  onSubmit,
  submitText,
  submitVariant = 'primary',
  submitSize = 'medium',
  className
}) => {
  const renderField = (field: FormField, index: number) => {
    switch (field.type) {
      case 'text': {
        const { extraProps, ...inputTextProps } = field;
        return (
          <InputText
            key={`${field.name}-${index}`}
            name={field.name}
            placeholder={field.placeholder || ""}
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={field.error}
            touched={field.touched}
            showValidation={field.showValidation}
            {...extraProps}
          />
        );
      }
      case 'radio': {
        const { extraProps, ...radioProps } = field;
        return (
          <Radio
            key={`${field.name}-${index}`}
            id={field.name}
            name={field.name}
            checked={field.checked}
            {...extraProps}
          >
            {field.children}
          </Radio>
        );
      }
      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit} className={`${$.form} ${className || ''}`}>
      <fieldset className={$.fieldset}>
        <legend className={$.legend}>{legend}</legend>
        {fields.map((field, index) => (
          <div key={`${field.name}-${index}`} className={$.formRow}>
            {renderField(field, index)}
          </div>
        ))}

        <Button 
          loading={loading} 
          type="submit"
          variant={submitVariant}
          size={submitSize}
        >
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;

import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  children: React.ReactNode;
}

const Radio: FunctionComponent<RadioProps> = ({ children, id, name, value, onChange, checked }) => {
  return (
    <div className={$.radio}>
      <input 
        type="radio" 
        id={id} 
        name={name} 
        value={value}
        onChange={onChange} 
        checked={checked}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;

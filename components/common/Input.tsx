
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-3 py-2 border border-nyt-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-nyt-primary focus:border-nyt-primary text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;

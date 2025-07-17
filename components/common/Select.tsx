
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ label, children, className = '', id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 border border-nyt-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-nyt-primary focus:border-nyt-primary text-sm bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;

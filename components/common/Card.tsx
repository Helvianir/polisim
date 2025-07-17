
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border border-nyt-border rounded-lg shadow-sm p-4 sm:p-6 ${className}`}>
      {title && <h3 className="font-serif text-xl font-bold mb-4 text-nyt-primary border-b border-nyt-border pb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;

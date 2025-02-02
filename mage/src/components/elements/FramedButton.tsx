import React, { ReactNode } from 'react';

interface FramedButtonProps {
  children: ReactNode;
}

const FramedButton: React.FC<FramedButtonProps> = ({ children }) => {
  return (
    <div className="btn text-xs px-2 py-1 border border-gray-300 rounded-md">
      <span className="noselect">{children}</span>
    </div>
  );
};

export default FramedButton;

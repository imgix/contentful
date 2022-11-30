import React, { ReactChild } from 'react';
import './Icon.css';

export const Icon = ({
  className,
  children,
}: {
  className?: string;
  children: ReactChild;
}) => (
  <div className={`container ${className ? className : ''}`}>{children}</div>
);

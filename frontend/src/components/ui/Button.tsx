import { ButtonHTMLAttributes } from 'react';

export default function Button({ className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-3 py-1 border-2 border-green-800 rounded-lg bg-green-200 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 ${className}`}
      {...rest}
    />
  );
}

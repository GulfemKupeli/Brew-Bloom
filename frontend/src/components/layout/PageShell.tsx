import { ReactNode } from 'react';

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-4xl mx-auto bg-white border-2 border-green-800 rounded-2xl shadow-lg p-4">
        {children}
      </div>
    </div>
  );
}

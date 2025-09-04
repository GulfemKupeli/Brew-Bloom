import { ReactNode } from 'react';

export default function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded-xl border-2 border-green-800 shadow-lg">
        {children}
        <button onClick={onClose} className="mt-2 text-sm text-green-700 underline focus:outline-none">Close</button>
      </div>
    </div>
  );
}

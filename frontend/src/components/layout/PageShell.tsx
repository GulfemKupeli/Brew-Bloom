// frontend/src/components/layout/PageShell.tsx
import { useLocation } from 'react-router-dom'
import timerBg from '../../assets/timer_page_background.png'
// garden and kitchen backgrounds will come later

export default function PageShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  let bg: string | undefined
  if (pathname === '/') {
    bg = `url(${timerBg})`
  } else if (pathname.startsWith('/garden')) {
    // placeholder color until you add a real image
    bg = 'linear-gradient(to bottom, #a7f3d0, #d1fae5)' // minty gradient
  } else if (pathname.startsWith('/kitchen')) {
    // placeholder color until you add a real image
    bg = 'linear-gradient(to bottom, #fde68a, #fef3c7)' // warm yellow gradient
  }

  return (
    <div className="relative min-h-screen">
      {bg && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: bg }}
          aria-hidden
        />
      )}
      <div className="mx-auto max-w-6xl p-4">{children}</div>
    </div>
  )
}

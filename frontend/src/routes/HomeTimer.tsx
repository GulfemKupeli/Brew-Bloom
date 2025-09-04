import DeskTimer from '../components/timer/DeskTimer'
import TimerControls from '../components/timer/TimerControls'

export default function HomeTimer() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background layer */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/timer_page_background.png')" }}
        aria-hidden
      />

      {/* Foreground content */}
      <div className="w-full max-w-2xl grid gap-4">
        <DeskTimer />
        <TimerControls />
      </div>
    </section>
  )
}

// frontend/src/routes/HomeTimer.tsx
import DeskTimer from '../components/timer/DeskTimer'
// import TimerControls from '../components/timer/TimerControls' // ← remove this import

export default function HomeTimer() {
  return (
    <section className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md p-6 shadow-lg">
        <DeskTimer />

      </div>
    </section>
  )
}

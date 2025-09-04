import DeskTimer from '../components/timer/DeskTimer';

export default function HomeTimer() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/timer_page_background.png')" }}
    >
      <DeskTimer />
    </div>
  );
}

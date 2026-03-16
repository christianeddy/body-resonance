interface BreathingCircleProps {
  phase: string;
  isPlaying: boolean;
  phaseDuration: number;
  className?: string;
}

const BreathingCircle = ({ phase, isPlaying, phaseDuration, className = "" }: BreathingCircleProps) => {
  const lower = phase.toLowerCase();
  let scale = 1;
  if (!isPlaying) {
    scale = 1;
  } else if (lower.includes("inhal")) {
    scale = 1.35;
  } else if (lower.includes("exhal")) {
    scale = 0.75;
  }

  const duration = isPlaying ? `${phaseDuration}s` : "0.8s";

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: 260, height: 260 }}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          background: "radial-gradient(circle, hsl(175 40% 35% / 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: `scale(${scale * 1.3})`,
          transition: `transform ${duration} cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      {/* Ring border */}
      <div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          border: "1.5px solid hsl(175 30% 40% / 0.3)",
          transform: `scale(${scale})`,
          transition: `transform ${duration} cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      {/* Core circle */}
      <div
        className="rounded-full"
        style={{
          width: 180,
          height: 180,
          background: "radial-gradient(circle at 40% 40%, hsl(175 35% 30% / 0.6), hsl(180 25% 12% / 0.9) 70%)",
          boxShadow: "inset 0 0 40px hsl(175 40% 20% / 0.3), 0 0 60px hsl(175 40% 30% / 0.1)",
          transform: `scale(${scale})`,
          transition: `transform ${duration} cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
};

export default BreathingCircle;

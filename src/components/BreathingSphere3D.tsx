import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface BreathingSphereProps {
  /** Current phase: "inhale" | "exhale" | "hold" | "" */
  phase: string;
  /** Is the animation playing? */
  isPlaying: boolean;
  /** Phase duration in seconds */
  phaseDuration: number;
}

const AnimatedSphere = ({ phase, isPlaying, phaseDuration }: BreathingSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  // Determine target scale based on phase
  useMemo(() => {
    if (!isPlaying) {
      targetScale.current = 1;
      return;
    }
    const lower = phase.toLowerCase();
    if (lower.includes("inhal")) targetScale.current = 1.6;
    else if (lower.includes("exhal")) targetScale.current = 0.7;
    else if (lower.includes("reten")) targetScale.current = currentScale.current; // hold
    else targetScale.current = 1;
  }, [phase, isPlaying]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth lerp towards target scale
    const speed = isPlaying ? 1.2 / Math.max(phaseDuration, 1) : 2;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, delta * speed * 2);
    meshRef.current.scale.setScalar(currentScale.current);

    // Gentle rotation — thought-like organic movement
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

    // Animate distortion based on phase
    if (materialRef.current) {
      const lower = phase.toLowerCase();
      let targetDistort = 0.3;
      if (lower.includes("inhal")) targetDistort = 0.5;
      else if (lower.includes("exhal")) targetDistort = 0.2;
      else if (lower.includes("reten")) targetDistort = 0.6; // "thinking" — more distortion
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, isPlaying ? targetDistort : 0.25, delta * 2);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, isPlaying ? 3 : 1.5, delta * 2);
    }
  });

  return (
    <>
      {/* Main sphere */}
      <Sphere ref={meshRef} args={[1, 128, 128]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[0.6, 64, 64]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
      </Sphere>

      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      {/* Key light — top-right blue */}
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#3b82f6" />
      {/* Rim light — left subtle */}
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#818cf8" />
      {/* Back light */}
      <pointLight position={[0, -2, -3]} intensity={0.4} color="#1e3a8a" />
    </>
  );
};

interface BreathingSphere3DProps {
  phase: string;
  isPlaying: boolean;
  phaseDuration: number;
  className?: string;
}

const BreathingSphere3D = ({ phase, isPlaying, phaseDuration, className = "" }: BreathingSphere3DProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: 260, height: 260 }}>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, hsl(221 83% 53% / 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: isPlaying ? "scale(1.3)" : "scale(1)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AnimatedSphere phase={phase} isPlaying={isPlaying} phaseDuration={phaseDuration} />
      </Canvas>
    </div>
  );
};

export default BreathingSphere3D;

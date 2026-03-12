import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface BreathingSphereProps {
  phase: string;
  isPlaying: boolean;
  phaseDuration: number;
}

const AnimatedSphere = ({ phase, isPlaying, phaseDuration }: BreathingSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const lower = phase.toLowerCase();
    if (!isPlaying) {
      targetScale.current = 1;
    } else if (lower.includes("inhal")) {
      targetScale.current = 1.45;
    } else if (lower.includes("exhal")) {
      targetScale.current = 0.75;
    } else if (lower.includes("reten")) {
      // hold
    } else {
      targetScale.current = 1;
    }

    const speed = isPlaying ? 1.5 / Math.max(phaseDuration, 1) : 2;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, delta * speed * 2);
    
    const s = currentScale.current;
    meshRef.current.scale.setScalar(s);
    if (wireRef.current) wireRef.current.scale.setScalar(s * 1.01);
    if (glowRef.current) glowRef.current.scale.setScalar(s * 1.15);

    // Slow rotation
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.1;
      wireRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }
  });

  return (
    <>
      {/* Outer glow shell */}
      <Sphere ref={glowRef} args={[1, 32, 32]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Core sphere — glass-like */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color="#0f172a"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          roughness={0.05}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Wireframe overlay — tech feel */}
      <Sphere ref={wireRef} args={[1, 24, 18]}>
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.12}
        />
      </Sphere>

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[2, 4, 3]} intensity={1.8} color="#60a5fa" />
      <directionalLight position={[-3, -1, 2]} intensity={0.4} color="#818cf8" />
      <pointLight position={[0, 2, -2]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[2, -1, 3]} intensity={0.3} color="#93c5fd" />
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
    <div className={`relative ${className}`} style={{ width: 300, height: 300 }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, hsl(221 83% 53% / 0.08) 0%, transparent 60%)",
          filter: "blur(30px)",
          transform: isPlaying ? "scale(1.5)" : "scale(1.1)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AnimatedSphere phase={phase} isPlaying={isPlaying} phaseDuration={phaseDuration} />
      </Canvas>
    </div>
  );
};

export default BreathingSphere3D;

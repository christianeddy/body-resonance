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
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target
    const lower = phase.toLowerCase();
    if (!isPlaying) {
      targetScale.current = 1;
    } else if (lower.includes("inhal")) {
      targetScale.current = 1.5;
    } else if (lower.includes("exhal")) {
      targetScale.current = 0.7;
    } else if (lower.includes("reten")) {
      // hold — keep current
    } else {
      targetScale.current = 1;
    }

    // Smooth lerp
    const speed = isPlaying ? 1.5 / Math.max(phaseDuration, 1) : 2;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, delta * speed * 2);
    meshRef.current.scale.setScalar(currentScale.current);

    // Gentle slow rotation
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshPhysicalMaterial
        color="#2563eb"
        emissive="#1d4ed8"
        emissiveIntensity={0.15}
        roughness={0.15}
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
        envMapIntensity={0.8}
      />
    </Sphere>
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
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, hsl(221 83% 53% / 0.12) 0%, transparent 65%)",
          filter: "blur(24px)",
          transform: isPlaying ? "scale(1.4)" : "scale(1.1)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        {/* Key light — top right, white-blue */}
        <directionalLight position={[3, 4, 3]} intensity={2} color="#93c5fd" />
        {/* Fill light — left */}
        <directionalLight position={[-2, 0, 2]} intensity={0.5} color="#60a5fa" />
        {/* Rim light — back */}
        <pointLight position={[0, -2, -3]} intensity={0.6} color="#3b82f6" />
        {/* Top highlight */}
        <pointLight position={[1, 3, 2]} intensity={0.8} color="#ffffff" />

        <AnimatedSphere phase={phase} isPlaying={isPlaying} phaseDuration={phaseDuration} />
      </Canvas>
    </div>
  );
};

export default BreathingSphere3D;

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 150 }) => {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 12,
        ],
        velocity: [
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.008,
        ],
        phase: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.1,
        radius: 0.5 + Math.random() * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const positions = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const particle = particles[i];

      // Orbital/curved motion with sine waves
      const angle = time * particle.speed + particle.phase;
      const x = particle.position[0] + Math.sin(angle) * particle.radius * 0.3;
      const y =
        particle.position[1] +
        Math.sin(angle * 0.7 + particle.phase) * particle.radius * 0.2;
      const z = particle.position[2] + Math.cos(angle) * particle.radius * 0.3;

      // Slow drift
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];

      // Boundary wrapping for continuous effect
      if (Math.abs(particle.position[0]) > 6) particle.position[0] *= -0.9;
      if (Math.abs(particle.position[1]) > 4) particle.position[1] *= -0.9;
      if (Math.abs(particle.position[2]) > 6) particle.position[2] *= -0.9;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = new Float32Array(count * 3);
  particles.forEach((p, i) => {
    positions[i * 3] = p.position[0];
    positions[i * 3 + 1] = p.position[1];
    positions[i * 3 + 2] = p.position[2];
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00d9ff"
        size={0.08}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default Particles;

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const BookMesh = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + state.clock.elapsedTime * 0.15;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Book spine */}
      <mesh position={[-0.52, 0, 0]}>
        <boxGeometry args={[0.08, 1.4, 1.0]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Left cover */}
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.0, 1.4, 0.04]} />
        <meshStandardMaterial color="#2563eb" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Right cover */}
      <mesh position={[0.25, 0, 0]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.0, 1.4, 0.04]} />
        <meshStandardMaterial color="#2563eb" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Pages left */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.9, 1.3, 0.3]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} metalness={0} />
      </mesh>
      {/* Pages right */}
      <mesh position={[0.15, 0, 0]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.9, 1.3, 0.3]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} metalness={0} />
      </mesh>
      {/* Glowing symbol on cover */}
      <mesh position={[-0.26, 0, 0.03]} rotation={[0, 0.2, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const StarField = ({ count = 800 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      speed: Math.random() * 0.002 + 0.001,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.03 + 0.01,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed * 100 + p.offset) * 0.5,
        p.position[1] + Math.cos(t * p.speed * 80 + p.offset) * 0.3,
        p.position[2] + Math.sin(t * p.speed * 60 + p.offset * 2) * 0.4
      );
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + p.offset) * 0.3));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
    </instancedMesh>
  );
};

const HeroScene3D = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, -3, 2]} color="#3b82f6" intensity={3} distance={15} />
          <pointLight position={[0, 3, 2]} color="#8b5cf6" intensity={2} distance={15} />
          <pointLight position={[3, 0, 3]} color="#06b6d4" intensity={1.5} distance={10} />
          <BookMesh />
          <StarField count={800} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene3D;

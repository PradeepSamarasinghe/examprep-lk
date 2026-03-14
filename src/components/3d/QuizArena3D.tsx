import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const GridTerrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 40, 40);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.5 + Math.random() * 0.1);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -5]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#0c1120"
        emissive="#3b82f6"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

const FloatingParticles = ({ count = 100 }: { count?: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => 
    Array.from({ length: count }, () => ({
      pos: [(Math.random() - 0.5) * 20, Math.random() * 8 - 2, (Math.random() - 0.5) * 20 - 5] as [number, number, number],
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.03 + 0.01,
    })),
  [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos[0] + Math.sin(t * p.speed + p.offset) * 0.3,
        p.pos[1] + Math.sin(t * p.speed * 0.7 + p.offset) * 0.5,
        p.pos[2]
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
    </instancedMesh>
  );
};

const QuizArena3D = () => {
  return (
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 1]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 5, 0]} color="#3b82f6" intensity={2} distance={20} />
          <pointLight position={[-5, 3, -5]} color="#8b5cf6" intensity={1} distance={15} />
          <GridTerrain />
          <FloatingParticles />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default QuizArena3D;

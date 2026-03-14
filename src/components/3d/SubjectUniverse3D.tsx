import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useState, Suspense, useCallback } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

const subjects = [
  { name: "Combined Maths", accuracy: 64, size: 0.4, color: "#3b82f6", orbitRadius: 2.8, speed: 0.3, icon: "📐" },
  { name: "Physics", accuracy: 78, size: 0.35, color: "#06b6d4", orbitRadius: 3.8, speed: 0.22, icon: "⚡" },
  { name: "Chemistry", accuracy: 69, size: 0.35, color: "#8b5cf6", orbitRadius: 4.6, speed: 0.17, icon: "🧪" },
  { name: "Biology", accuracy: 81, size: 0.38, color: "#10b981", orbitRadius: 5.5, speed: 0.12, icon: "🧬" },
];

const Planet = ({
  subject,
  index,
}: {
  subject: typeof subjects[0];
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const glowIntensity = subject.accuracy / 100;
  const startAngle = (index * Math.PI * 2) / subjects.length;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * subject.speed + startAngle;
    meshRef.current.position.x = Math.cos(t) * subject.orbitRadius;
    meshRef.current.position.z = Math.sin(t) * subject.orbitRadius;
    meshRef.current.position.y = Math.sin(t * 2) * 0.3;
  });

  const color = new THREE.Color(subject.color);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[subject.size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={glowIntensity * (hovered ? 1.5 : 0.8)}
        roughness={0.3}
        metalness={0.5}
      />
      {hovered && (
        <Html center distanceFactor={8}>
          <div className="glass-strong rounded-lg px-3 py-2 text-center pointer-events-none whitespace-nowrap">
            <p className="text-xs font-display font-bold text-foreground">{subject.icon} {subject.name}</p>
            <p className="text-[10px] text-muted-foreground">{subject.accuracy}% mastery</p>
          </div>
        </Html>
      )}
    </mesh>
  );
};

const CentralCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.6, 2]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={1.2}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const OrbitRings = () => {
  return (
    <>
      {subjects.map((s, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[s.orbitRadius - 0.005, s.orbitRadius + 0.005, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

const BackgroundStars = ({ count = 300 }: { count?: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const stars = useMemo(() => 
    Array.from({ length: count }, () => ({
      pos: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30] as [number, number, number],
      scale: Math.random() * 0.03 + 0.01,
    })),
  [count]);

  useFrame(() => {
    if (!ref.current) return;
    stars.forEach((s, i) => {
      dummy.position.set(...s.pos);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} />
    </instancedMesh>
  );
};

const SubjectUniverse3D = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 6, 10], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={5} distance={20} />
          <pointLight position={[5, 5, 5]} color="#8b5cf6" intensity={1} distance={15} />
          <CentralCore />
          <OrbitRings />
          {subjects.map((s, i) => (
            <Planet key={s.name} subject={s} index={i} />
          ))}
          <BackgroundStars />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground pointer-events-none">
        Hover over a planet to see subject details
      </div>
    </div>
  );
};

export default SubjectUniverse3D;

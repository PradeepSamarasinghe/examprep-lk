import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, Suspense } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export interface SubjectItem {
  name: string;
  icon: string;
  accuracy: number;
  color?: string;
}

const Planet = ({
  subject,
  index,
  total,
}: {
  subject: SubjectItem;
  index: number;
  total: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Dynamic properties based on index
  const orbitRadius = 2.5 + index * 1.0;
  const speed = 0.3 - index * 0.04;
  const size = 0.3 + (subject.accuracy / 200); // Scale based on accuracy
  const startAngle = (index * Math.PI * 2) / total;
  
  const glowIntensity = subject.accuracy / 100;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + startAngle;
    meshRef.current.position.x = Math.cos(t) * orbitRadius;
    meshRef.current.position.z = Math.sin(t) * orbitRadius;
    meshRef.current.position.y = Math.sin(t * 2) * 0.2;
  });

  const planetColor = new THREE.Color(subject.color || "#3b82f6");

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={planetColor}
        emissive={planetColor}
        emissiveIntensity={glowIntensity * (hovered ? 2 : 1)}
        roughness={0.4}
        metalness={0.6}
      />
      {hovered && (
        <Html center distanceFactor={8}>
          <div className="glass-strong rounded-lg px-3 py-2 text-center pointer-events-none whitespace-nowrap z-50">
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
      <icosahedronGeometry args={[0.5, 2]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={1.5}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const OrbitRings = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5 + i * 1.0 - 0.01, 2.5 + i * 1.0 + 0.01, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

const BackgroundStars = ({ count = 200 }: { count?: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const starsArray = useMemo(() => 
    Array.from({ length: count }, () => {
      const position = new THREE.Vector3().setFromSphericalCoords(
        15 + Math.random() * 20,
        Math.acos(1 - 2 * Math.random()),
        2 * Math.PI * Math.random()
      );
      return {
        position,
        scale: Math.random() * 0.05 + 0.01
      };
    }),
  [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!ref.current) return;
    starsArray.forEach((s, i) => {
      dummy.position.copy(s.position);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  );
};

interface SubjectUniverseProps {
  subjects: SubjectItem[];
  label?: string;
}

const SubjectUniverse3D = ({ subjects, label }: SubjectUniverseProps) => {
  const displaySubjects = subjects.slice(0, 5); // Limit to 5 for visual clarity
  
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 40 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={8} distance={20} />
          <CentralCore />
          <OrbitRings count={displaySubjects.length} />
          {displaySubjects.map((s, i) => (
            <Planet key={s.name} subject={s} index={i} total={displaySubjects.length} />
          ))}
          <BackgroundStars />
        </Suspense>
      </Canvas>
      {label && (
        <div className="absolute bottom-4 left-4 text-[10px] text-muted-foreground uppercase tracking-widest pointer-events-none opacity-50">
          {label}
        </div>
      )}
    </div>
  );
};

export default SubjectUniverse3D;

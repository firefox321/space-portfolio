"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";

const mouseRef = { x: 0, y: 0 };

function StarField() {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 7000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(8, 26);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = t * 0.01;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.02;
    pointsRef.current.position.x = mouseRef.x * 0.5;
    pointsRef.current.position.y = mouseRef.y * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color("#e5e7eb")}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.8}
      />
    </points>
  );
}

function Asteroid() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.2, 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const scale = 0.7 + THREE.MathUtils.randFloat(0, 0.6);
      pos.setX(i, pos.getX(i) * scale);
      pos.setY(i, pos.getY(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;
    meshRef.current.rotation.x = t * 0.04;
    meshRef.current.rotation.y = t * 0.06;
    meshRef.current.position.x = 6 + mouseRef.x * 1.2;
    meshRef.current.position.y = -3 + mouseRef.y * 0.8;
    meshRef.current.position.z = -8;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={[6, -3, -8]}>
      <meshStandardMaterial
        color="#3f3f46"
        roughness={0.9}
        metalness={0.1}
        emissive="#1c1917"
      />
    </mesh>
  );
}

function Astronaut() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.08;
    groupRef.current.position.x = -5 + mouseRef.x * 1.5;
    groupRef.current.position.y = 2 + mouseRef.y * 0.6;
    groupRef.current.position.z = -6;
    groupRef.current.children[0].rotation.y = t * 0.2;
    const arm = groupRef.current.getObjectByName("arm");
    if (arm) arm.rotation.x = Math.sin(t * 1.2) * 0.4;
  });

  return (
    <group ref={groupRef} position={[-5, 2, -6]}>
      <group rotation={[0, 0, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.18, 0.35, 4, 8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} metalness={0.05} />
        </mesh>
        <group name="arm" position={[0.28, 0.35, 0]} rotation={[0.3, 0, 0]}>
          <mesh position={[0.12, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
        </group>
        <group position={[-0.28, 0.35, 0]} rotation={[-0.2, 0, 0]}>
          <mesh position={[-0.1, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.24, 4, 8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
        </group>
        <mesh position={[0.12, -0.15, 0.05]}>
          <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
        <mesh position={[-0.12, -0.15, 0.05]}>
          <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function BackgroundMouseSync() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

export function BackgroundStars() {
  return (
    <div className="bg-stars" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
        <color attach="background" args={["#02010a"]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 5]} intensity={0.8} color="#f97316" />
        <pointLight position={[-8, -5, 3]} intensity={0.4} color="#7c3aed" />
        <BackgroundMouseSync />
        <StarField />
        <Suspense fallback={null}>
          <Asteroid />
          <Astronaut />
        </Suspense>
      </Canvas>
    </div>
  );
}


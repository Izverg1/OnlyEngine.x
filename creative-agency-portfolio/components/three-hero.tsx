"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Float, 
  OrbitControls, 
  Sparkles, 
  Stars,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Box,
  Torus,
  TorusKnot,
  Icosahedron,
  Environment,
  ContactShadows
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Vignette,
  Noise
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// Animated Sphere Component
function AnimatedSphere({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

// DNA Helix Component
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  
  const helixPoints = useMemo(() => {
    const points = []
    for (let i = 0; i < 100; i++) {
      const t = i / 10
      const x = Math.sin(t) * 2
      const y = (i - 50) * 0.15
      const z = Math.cos(t) * 2
      points.push({ position: [x, y, z] as [number, number, number], scale: 0.1 + Math.sin(t) * 0.05 })
    }
    return points
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <group ref={groupRef} position={[5, 0, -2]}>
      {helixPoints.map((point, i) => (
        <mesh key={i} position={point.position}>
          <sphereGeometry args={[point.scale, 8, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#3b82f6" : "#a855f7"} 
            emissive={i % 2 === 0 ? "#3b82f6" : "#a855f7"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// Morphing Torus Knot
function MorphingTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 170, friction: 26 }
  })
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <animated.mesh
      ref={meshRef}
      position={[-5, 0, -2]}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <MeshWobbleMaterial
        attach="material"
        color="#10b981"
        speed={2}
        factor={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </animated.mesh>
  )
}

// Particle Field
function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const particlesCount = 5000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 30
      positions[i + 2] = (Math.random() - 0.5) * 30
    }
    return positions
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.02
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  )
}

// Floating Icosahedrons
function FloatingIcosahedrons() {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.3
        child.rotation.x = state.clock.elapsedTime * 0.5
        child.rotation.z = state.clock.elapsedTime * 0.3
      })
    }
  })
  
  return (
    <group ref={meshRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 2, 0, -5]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={["#f472b6", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][i]}
            emissive={["#f472b6", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][i]}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene Component
function Scene() {
  const { camera } = useThree()
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.5
  })
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#60a5fa"
      />
      
      {/* 3D Objects */}
      <AnimatedSphere position={[0, 0, 0]} color="#3b82f6" />
      <AnimatedSphere position={[3, 2, -3]} color="#a855f7" />
      <AnimatedSphere position={[-3, -2, -3]} color="#10b981" />
      
      <DNAHelix />
      <MorphingTorusKnot />
      <FloatingIcosahedrons />
      <ParticleField />
      
      {/* Environment */}
      <Sparkles
        count={200}
        scale={[20, 20, 20]}
        size={2}
        speed={0.5}
        color="#60a5fa"
      />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.3}
        scale={20}
        blur={2}
        color="#000000"
      />
      
      {/* Post Processing */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration offset={[0.002, 0.002]} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
        <Noise opacity={0.02} />
      </EffectComposer>
      
      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  )
}

import { useState } from 'react'

export function ThreeHero() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
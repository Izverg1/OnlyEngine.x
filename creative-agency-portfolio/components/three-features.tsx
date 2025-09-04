"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Torus, Octahedron, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

// DNA Helix for Neural Engine
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 50; i++) {
      const angle = i * 0.2
      pts.push({
        x: Math.cos(angle) * 2,
        y: i * 0.2 - 5,
        z: Math.sin(angle) * 2,
        x2: Math.cos(angle + Math.PI) * 2,
        z2: Math.sin(angle + Math.PI) * 2,
      })
    }
    return pts
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <group key={i}>
          <Sphere args={[0.15]} position={[point.x, point.y, point.z]}>
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.15]} position={[point.x2, point.y, point.z2]}>
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
          </Sphere>
          {i % 3 === 0 && (
            <Box args={[4, 0.05, 0.05]} position={[0, point.y, 0]} rotation={[0, i * 0.2, 0]}>
              <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={0.3} opacity={0.6} transparent />
            </Box>
          )}
        </group>
      ))}
    </group>
  )
}

// Quantum Field for Distribution
function QuantumField() {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      
      colors[i3] = Math.random() * 0.5 + 0.5
      colors[i3 + 1] = Math.random() * 0.5 + 0.5
      colors[i3 + 2] = 1
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
      meshRef.current.rotation.y += 0.01
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.002
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <>
      <Torus ref={meshRef} args={[3, 0.5, 16, 100]}>
        <MeshDistortMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={2}
        />
      </Torus>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors sizeAttenuation={false} />
      </points>
    </>
  )
}

// Data Visualization for Analytics
function DataVisualization() {
  const groupRef = useRef<THREE.Group>(null)
  
  const bars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      height: Math.random() * 4 + 1,
      x: (i - 10) * 0.5,
      color: `hsl(${120 + Math.random() * 60}, 70%, 50%)`
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.children.forEach((child, i) => {
        child.scale.y = Math.sin(state.clock.elapsedTime + i * 0.2) * 0.3 + 1
      })
    }
  })

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <Box key={i} args={[0.3, bar.height, 0.3]} position={[bar.x, bar.height / 2, 0]}>
          <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={0.3} />
        </Box>
      ))}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Octahedron args={[1.5]} position={[0, 4, 0]}>
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.8}
            wireframe
          />
        </Octahedron>
      </Float>
    </group>
  )
}

// Security Shield
function SecurityShield() {
  const shieldRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.005
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.01
      innerRef.current.rotation.z += 0.01
      innerRef.current.scale.setScalar(Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1)
    }
  })

  return (
    <group ref={shieldRef}>
      {/* Outer shield */}
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          args={[3, 4, 0.1]}
          position={[
            Math.sin((i / 6) * Math.PI * 2) * 2,
            0,
            Math.cos((i / 6) * Math.PI * 2) * 2
          ]}
          rotation={[0, (i / 6) * Math.PI * 2, 0]}
        >
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.3}
            opacity={0.3}
            transparent
          />
        </Box>
      ))}
      
      {/* Inner core */}
      <Octahedron ref={innerRef} args={[1]}>
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#f43f5e"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Octahedron>
    </group>
  )
}

export function ThreeFeatures({ type }: { type: 'dna' | 'quantum' | 'data' | 'shield' }) {
  return (
    <div className="absolute inset-0 opacity-50">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ade80" />
        
        {type === 'dna' && <DNAHelix />}
        {type === 'quantum' && <QuantumField />}
        {type === 'data' && <DataVisualization />}
        {type === 'shield' && <SecurityShield />}
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
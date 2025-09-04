"use client"

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, MeshDistortMaterial, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

function FloatingScreen() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main screen */}
      <Box args={[8, 4.5, 0.1]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#1e293b"
          emissive="#3b82f6"
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Screen border */}
      <Box args={[8.2, 4.7, 0.05]} position={[0, 0, -0.05]}>
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0}
        />
      </Box>
      
      {/* Floating UI elements */}
      {Array.from({ length: 5 }, (_, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Box 
            args={[1.5, 0.8, 0.02]} 
            position={[
              (i - 2) * 2,
              Math.sin(i) * 0.5,
              0.5 + i * 0.1
            ]}
          >
            <meshStandardMaterial
              color={`hsl(${200 + i * 20}, 70%, 50%)`}
              emissive={`hsl(${200 + i * 20}, 70%, 50%)`}
              emissiveIntensity={0.3}
              opacity={0.8}
              transparent
            />
          </Box>
        </Float>
      ))}
      
      {/* Play button */}
      <group position={[0, 0, 0.2]}>
        <Sphere args={[0.5]} onClick={() => console.log('Play')}>
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={hovered ? 1 : 0.5}
            metalness={0.5}
          />
        </Sphere>
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          ▶
        </Text>
      </group>
    </group>
  )
}

function OrbitingParticle({ radius, speed, color, size }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed
      meshRef.current.position.x = Math.cos(t) * radius
      meshRef.current.position.z = Math.sin(t) * radius
      meshRef.current.position.y = Math.sin(t * 2) * 1
    }
  })

  return (
    <Trail width={2} length={10} color={color} attenuation={(t) => t * t}>
      <Sphere ref={meshRef} args={[size]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </Sphere>
    </Trail>
  )
}

export function ThreeDemo() {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4ade80" />
      
      <FloatingScreen />
      
      {/* Orbiting particles */}
      <OrbitingParticle radius={6} speed={0.5} color="#3b82f6" size={0.1} />
      <OrbitingParticle radius={7} speed={-0.3} color="#10b981" size={0.15} />
      <OrbitingParticle radius={5} speed={0.7} color="#f59e0b" size={0.1} />
      <OrbitingParticle radius={8} speed={-0.4} color="#ec4899" size={0.12} />
      
      {/* Background sphere */}
      <Sphere args={[15, 32, 32]}>
        <meshStandardMaterial
          color="#030712"
          side={THREE.BackSide}
          emissive="#1e293b"
          emissiveIntensity={0.1}
        />
      </Sphere>
    </Canvas>
  )
}
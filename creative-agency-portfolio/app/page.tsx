"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from 'next/dynamic'
import { 
  ArrowRight,
  Check,
  Star,
  Award
} from "lucide-react"
import {
  NeuralNetworkIcon,
  QuantumIcon,
  HologramIcon,
  CrystalIcon,
  VortexIcon,
  MatrixIcon,
  PrismIcon,
  FractalIcon,
  WaveformIcon,
  HelixIcon,
  PortalIcon,
  OrbitalIcon
} from "@/components/custom-icons"
import { motion } from "framer-motion"

// Dynamically import Three.js components to avoid SSR issues
const ThreeHero = dynamic(() => import('@/components/three-hero').then(mod => mod.ThreeHero), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-blue-400 animate-pulse">Loading 3D Experience...</div>
    </div>
  )
})

const ThreeFeatures = dynamic(() => import('@/components/three-features').then(mod => mod.ThreeFeatures), {
  ssr: false,
  loading: () => null
})

const ThreeDemo = dynamic(() => import('@/components/three-demo').then(mod => mod.ThreeDemo), {
  ssr: false,
  loading: () => null
})

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const stats = [
    { label: "AI Models", value: "50+", icon: NeuralNetworkIcon },
    { label: "Platforms", value: "15+", icon: MatrixIcon },
    { label: "Data Processed", value: "10TB+", icon: CrystalIcon },
    { label: "API Calls/Day", value: "1M+", icon: QuantumIcon }
  ]

  const features = [
    {
      title: "Neural Content Engine",
      description: "Advanced transformer models generate hyper-realistic content with unprecedented quality and diversity",
      icon: HelixIcon,
      gradient: "from-violet-500 to-purple-500"
    },
    {
      title: "Quantum Distribution",
      description: "Parallel processing across multiple platforms with AI-optimized scheduling algorithms",
      icon: VortexIcon,
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Predictive Analytics",
      description: "Machine learning models predict viral content patterns and optimize engagement strategies",
      icon: WaveformIcon,
      gradient: "from-emerald-500 to-green-500"
    },
    {
      title: "Zero-Knowledge Security",
      description: "Military-grade encryption with distributed ledger technology for complete privacy",
      icon: PrismIcon,
      gradient: "from-rose-500 to-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <ThreeHero />
        </Suspense>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/30">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-70" />
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl">
              <OrbitalIcon className="h-7 w-7 text-white" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              OnlyEngine.x
            </span>
            <div className="text-xs text-gray-400">AI Content Platform</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">Dashboard</Link>
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</Link>
          <Link href="#demo" className="text-gray-300 hover:text-white transition-colors font-medium">Demo</Link>
          <Link href="/auth/login">
            <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-6">
              Launch App
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md text-blue-300 border-blue-500/30 px-4 py-1.5 mb-6">
              <HologramIcon className="h-3 w-3 mr-2" />
              Next-Gen AI Platform • Version 3.0
            </Badge>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 leading-none">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Content
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-white"
              >
                Revolution
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-3xl md:text-4xl lg:text-5xl mt-4 font-light text-gray-400"
              >
                Powered by AI
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              Harness the power of advanced neural networks to generate, optimize, 
              and distribute content at unprecedented scale.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mb-12"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg shadow-2xl shadow-purple-500/25">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-10 py-7 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Live Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with 3D Animations */}
      <section id="features" className="relative z-20 py-32 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-purple-500/20 backdrop-blur-md text-purple-300 border-purple-500/30 px-4 py-1.5 mb-4">
              <Award className="h-3 w-3 mr-2" />
              Quantum-Powered Technology Stack
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <span className="text-white block mt-2">AI Infrastructure</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of AI with immersive 3D visualizations and quantum-enhanced processing
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {features.map((feature, index) => {
              const animationType = ['dna', 'quantum', 'data', 'shield'][index] as 'dna' | 'quantum' | 'data' | 'shield'
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group relative h-[500px]"
                >
                  {/* 3D Background */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <Suspense fallback={null}>
                      <ThreeFeatures type={animationType} />
                    </Suspense>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent rounded-3xl group-hover:from-black/75 group-hover:via-black/20 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-2xl w-fit`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{feature.description}</p>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer">
                      <span className="font-medium">Experience the magic</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Border glow effect */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r ${feature.gradient} blur-sm -z-10`} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section with 3D Interactive Experience */}
      <section id="demo" className="relative z-20 py-32 overflow-hidden bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Immersive
              </span>
              <span className="text-white block mt-2">AI Experience</span>
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Step into the future with our interactive 3D platform demonstration
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden"
          >
            {/* 3D Demo Background */}
            <div className="absolute inset-0">
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <div className="text-blue-400 animate-pulse text-xl">Loading 3D Demo...</div>
                </div>
              }>
                <ThreeDemo />
              </Suspense>
            </div>
            
            {/* Interactive Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            
            {/* Demo UI Elements */}
            <div className="absolute top-8 left-8">
              <Badge className="bg-green-500/20 backdrop-blur-md text-green-300 border-green-500/30 px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live Demo • Interactive
              </Badge>
            </div>
            
            <div className="absolute bottom-8 left-8">
              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Next-Gen Platform</div>
                <div className="text-xl font-bold text-white">OnlyEngine.x in Action</div>
                <div className="text-sm text-gray-400 mt-2">Experience real-time AI processing</div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 shadow-2xl shadow-green-500/25">
                Launch Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute top-8 right-8 space-y-4">
              {[
                { label: "AI Processing", value: "99.7%", color: "text-green-400" },
                { label: "Response Time", value: "0.3s", color: "text-blue-400" },
                { label: "Active Users", value: "8.4K", color: "text-purple-400" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-black/30 backdrop-blur-md rounded-lg px-4 py-3 border border-white/10"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Immersive Design */}
      <section className="relative z-20 py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent" />
          {/* Floating particles effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Glowing star effect */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              whileInView={{ scale: 1, rotate: 180 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative mx-auto mb-8 w-20 h-20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl opacity-60 rounded-full animate-pulse" />
              <Star className="relative h-20 w-20 text-yellow-400 mx-auto filter drop-shadow-lg" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold mb-8"
            >
              <span className="text-white">Ready to Enter</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-4">
                The AI Dimension?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform your creative process with quantum-powered AI technology.
              <span className="block mt-2 text-lg text-gray-400">
                Join the revolution that's redefining content creation.
              </span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-10 text-2xl shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                  Begin Your Journey
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="ml-4"
                  >
                    <PortalIcon className="h-8 w-8" />
                  </motion.div>
                </Button>
              </Link>
              
              <Link href="#demo">
                <Button size="lg" className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/10 px-12 py-10 text-xl">
                  Explore Demo
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-500 text-lg">🚀 No credit card required • ⚡ Instant access • 🌟 Unlimited creativity</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 px-8 py-12 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FractalIcon className="h-5 w-5 text-blue-400" />
            <span className="text-gray-400">© 2025 KARLSON LLC / iamkarlson • OnlyEngine.x</span>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">Terms</Link>
            <Link href="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</Link>
            <Link href="/support" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
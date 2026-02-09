import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import ContactForm from './components/ContactForm';
import { Model as SpaceStation } from './components/SpaceStation';
import { Model as SpaceStationModules } from './components/SpaceStationModules';

const CAMERA_POSITIONS = {
  home: new THREE.Vector3(4, 5, -16),
  projects: new THREE.Vector3(4, 5, -16),
  lostfocus: new THREE.Vector3(10, 28, -35),
  contact: new THREE.Vector3(4, 5, -8),
};

const CAMERA_TARGETS = {
  home: new THREE.Vector3(0, 0, 0),
  projects: new THREE.Vector3(0, 0, 0),
  lostfocus: new THREE.Vector3(0, 0, 0),
  contact: new THREE.Vector3(6, 0, 0),
};

function CameraController({ section, controlsRef }) {
  const { camera } = useThree();
  const posTarget = CAMERA_POSITIONS[section] || CAMERA_POSITIONS.home;
  const lookTarget = CAMERA_TARGETS[section] || CAMERA_TARGETS.home;
  const arrived = useRef(false);
  const prevSection = useRef(section);

  useFrame(() => {
    if (prevSection.current !== section) {
      arrived.current = false;
      prevSection.current = section;
    }

    // Projects: let OrbitControls handle everything freely
    if (section === 'projects') {
      arrived.current = true;
      return;
    }

    if (arrived.current) return;

    const speed = section === 'contact' ? 0.05 : 0.03;
    camera.position.lerp(posTarget, speed);

    // Sync OrbitControls position and target
    if (controlsRef.current) {
      controlsRef.current.object.position.copy(camera.position);
      controlsRef.current.target.lerp(lookTarget, speed);
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(posTarget) < 0.1) {
      arrived.current = true;
    }
  });

  return null;
}

function GlowingParticles({ count = 300 }) {
  const meshRef = useRef();

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      varying float vAlpha;
      varying float vSeed;

      void main() {
        vec3 pos = position;
        vSeed = aSeed;

        pos.x += sin(uTime * 0.3 + aSeed * 6.28) * 0.5;
        pos.y += cos(uTime * 0.2 + aSeed * 4.0) * 0.5;
        pos.z += sin(uTime * 0.25 + aSeed * 5.0) * 0.5;

        vAlpha = 0.3 + 0.7 * pow(sin(uTime * (0.5 + aSeed * 0.5) + aSeed * 6.28) * 0.5 + 0.5, 2.0);

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.5 + aSeed * 2.5) * (8.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying float vSeed;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float glow = exp(-d * 4.0);
        vec3 col = mix(vec3(0.4, 0.8, 0.7), vec3(0.9, 0.95, 1.0), vSeed);
        gl_FragColor = vec4(col * glow * 2.0, glow * vAlpha * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  useFrame((_, delta) => {
    shaderMaterial.uniforms.uTime.value += delta;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [positions, seeds]);

  return <points ref={meshRef} geometry={geometry} material={shaderMaterial} />;
}

function SydneyTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-AU', {
          timeZone: 'Australia/Sydney',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-xs text-white/40 tracking-wide">
      <span className="block text-white/25 uppercase mb-0.5">Sydney, AU</span>
      {time}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('home');

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const controlsRef = useRef();
  const isLostFocus = section === 'lostfocus';
  const isContact = section === 'contact';
  const showHeroText = section === 'home';

  return (
    <div className="min-h-screen bg-black">
      {loading && <Loader onComplete={handleLoadComplete} />}

      {/* 3D Space Station - always full screen */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [4, 5, -16], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
          }}
        >
          <Environment preset="city" environmentIntensity={0.6} />

          <ambientLight intensity={0.25} color="#889aaa" />
          <directionalLight position={[10, 15, 10]} intensity={3.0} color="#ddeeff" />
          <directionalLight position={[-10, 8, -5]} intensity={1.2} color="#88aadd" />
          <directionalLight position={[0, -8, 8]} intensity={0.6} color="#aabbcc" />
          <pointLight position={[0, 3, 0]} intensity={1.5} color="#ccddff" distance={25} />
          <pointLight position={[-5, 0, -5]} intensity={0.6} color="#66ccaa" distance={20} />
          <pointLight position={[5, -2, 5]} intensity={0.5} color="#aaccff" distance={20} />

          <CameraController section={section} controlsRef={controlsRef} />
          <SpaceStation />
          <SpaceStationModules position={[4, -4, 3]} scale={0.3} />
          <GlowingParticles />

          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0008, 0.0008)}
              radialModulation
              modulationOffset={0.2}
            />
            <Vignette
              offset={0.3}
              darkness={0.7}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={isLostFocus ? 0.1 : 0.3}
            minDistance={5}
            maxDistance={50}
            enableRotate={!isContact}
            enableZoom={!isContact}
            enablePan={!isContact}
          />
        </Canvas>
      </div>

      {/* Blur overlay for lost focus */}
      <div
        className={`fixed inset-0 z-[5] transition-all duration-1000 pointer-events-none ${
          isLostFocus
            ? 'backdrop-blur-md bg-black/30'
            : 'backdrop-blur-0 bg-transparent'
        }`}
      />

      {/* UI 层 */}
      <Navbar section={section} onNavigate={setSection} />

      {/* Hero text overlay */}
      <div
        className={`fixed inset-0 z-10 pointer-events-none transition-opacity duration-700 ${
          showHeroText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[40%] left-[6%] -translate-y-1/2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Hi, I am{' '}
            <span className="metallic-text">BLUEKY</span>{' '}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
        </div>

        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 text-left max-w-xs md:max-w-sm">
          <p className="text-xl md:text-3xl lg:text-4xl font-semibold glow-text leading-snug">
            Computer Science
            <br />
            Student at UNSW
          </p>
          <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed">
            Junior developer passionate about building scalable fullstack solutions. Experienced in systems engineering and data structures, with strong cross-team collaboration skills. Bilingual in English and Mandarin.
          </p>
        </div>
      </div>

      {/* Contact form - overlaid on left side */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[55%] z-30 transition-all duration-700 ease-out ${
          isContact
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[20%] opacity-0 pointer-events-none'
        }`}
      >
        <ContactForm />
      </div>

      {/* Footer bar */}
      <div className="fixed bottom-6 left-8 right-8 z-20 flex justify-between items-end pointer-events-none">
        <SydneyTime />
        <span className="text-xs text-white/40 tracking-wide">&copy; 2026 Blueky</span>
      </div>

      <main className="relative z-10">
      </main>
    </div>
  );
}

export default App;

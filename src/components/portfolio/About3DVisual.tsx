import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const About3DVisual: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    let isDisposed = false;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 2. Central 3D System Core (Icosahedron Wireframe + Glowing Nodes)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xE5B869,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // Outer geometric polyhedral cage
    const outerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xFFF6E5,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const outerCage = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCage);

    // Vertices / Nodes as glowing points
    const nodeCount = outerGeo.attributes.position.count;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const posAttr = outerGeo.attributes.position;

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = posAttr.getX(i);
      nodePositions[i * 3 + 1] = posAttr.getY(i);
      nodePositions[i * 3 + 2] = posAttr.getZ(i);
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d')!;
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(229, 184, 105, 0.9)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
    const pointTex = new THREE.CanvasTexture(pCanvas);

    const nodeMat = new THREE.PointsMaterial({
      size: 0.14,
      map: pointTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    coreGroup.add(nodePoints);

    // 3. Orbiting Data Packet Rings (representing REST & WebSocket packets)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const orbitCount = 180;
    const orbitPos = new Float32Array(orbitCount * 3);
    const orbitAngles = new Float32Array(orbitCount);
    const orbitRadii = new Float32Array(orbitCount);
    const orbitSpeeds = new Float32Array(orbitCount);
    const orbitTilts = new Float32Array(orbitCount);

    for (let i = 0; i < orbitCount; i++) {
      orbitAngles[i] = Math.random() * Math.PI * 2;
      orbitRadii[i] = 1.5 + Math.random() * 0.55;
      orbitSpeeds[i] = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.9);
      orbitTilts[i] = (Math.random() - 0.5) * 0.7;
    }

    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
    const orbitMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0xE5B869,
      map: pointTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });
    const orbitPoints = new THREE.Points(orbitGeo, orbitMat);
    ringGroup.add(orbitPoints);

    // 4. Mouse Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX * 0.6 - targetX) * 0.05;
      targetY += (mouseY * 0.6 - targetY) * 0.05;

      coreGroup.rotation.y = elapsed * 0.45 + targetX;
      coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.2 + targetY;

      ringGroup.rotation.z = elapsed * 0.25;
      ringGroup.rotation.x = Math.PI * 0.2 + targetY * 0.5;

      // Update orbiting packets
      const positions = orbitGeo.attributes.position as THREE.BufferAttribute;
      const arr = positions.array as Float32Array;

      for (let i = 0; i < orbitCount; i++) {
        orbitAngles[i] += orbitSpeeds[i] * delta;
        const ang = orbitAngles[i];
        const r = orbitRadii[i];
        const tilt = orbitTilts[i];

        arr[i * 3] = r * Math.cos(ang);
        arr[i * 3 + 1] = r * Math.sin(ang) * Math.cos(tilt);
        arr[i * 3 + 2] = r * Math.sin(ang) * Math.sin(tilt);
      }
      positions.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pointTex.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-[#0a0a0a]/80 border border-white/10 hover:border-[#E5B869]/50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Status Pill */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-pulse" />
        <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">
          3D Distributed Architecture Node
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none z-10 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
        Interactive WebGL • Mouse Reactive
      </div>
    </div>
  );
};

export default About3DVisual;

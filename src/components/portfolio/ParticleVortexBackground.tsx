import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleVortexBackgroundProps {
  className?: string;
}

export const ParticleVortexBackground: React.FC<ParticleVortexBackgroundProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let animId: number;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Elevated perspective looking down into the hyperboloid (exact Qronos angle)
    camera.position.set(0, 1.2, 11.5);
    camera.lookAt(0, -0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 2. Parametric Ruled Hyperboloid Vortex Mesh (Exact Qronos 1:1 Wireframe Geometry)
    // Pure Monochrome White / Silver palette on deep black
    const forwardLines = 115;
    const pointsPerForward = 95;
    const forwardCount = forwardLines * pointsPerForward;

    const counterLines = 70;
    const pointsPerCounter = 80;
    const counterCount = counterLines * pointsPerCounter;

    const ringCount = 15;
    const pointsPerRing = 120;
    const ringTotal = ringCount * pointsPerRing;

    const starCount = 1200;

    const totalPoints = forwardCount + counterCount + ringTotal + starCount;

    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    // Pure White / Silver monochrome palette
    const colorPureWhite = new THREE.Color(0xffffff);
    const colorSilverLight = new THREE.Color(0xe2e8f0);
    const colorSilver = new THREE.Color(0x94a3b8);
    const colorSlate = new THREE.Color(0x475569);
    const colorDarkSlate = new THREE.Color(0x1e293b);

    let pIndex = 0;

    // Function to calculate hyperboloid coordinates (t in [-1, 1], phi is base angle)
    const getHyperboloidPoint = (t: number, phi: number, isForward: boolean) => {
      let r: number;
      let y: number;
      let theta: number;

      const waistR = 2.2;

      if (t >= 0) {
        // Top flare: expands upward & outward into top screen corners
        const factor = Math.pow(t, 1.35);
        r = waistR + 14.2 * factor;
        y = t * 6.2;
        const twist = t * (isForward ? 2.6 : -2.6);
        theta = phi + twist;
      } else {
        // Bottom flare: expands into wide concentric orbital floor
        const k = Math.abs(t);
        const factor = Math.pow(k, 1.55);
        r = waistR + 20.0 * factor;
        y = -k * 3.8;
        const twist = k * (isForward ? -3.0 : 3.0);
        theta = phi + twist;
      }

      return {
        x: r * Math.cos(theta),
        y,
        z: r * Math.sin(theta),
        r,
      };
    };

    // A. Forward Streamlines (Pure White & Silver)
    for (let l = 0; l < forwardLines; l++) {
      const basePhi = (l / forwardLines) * Math.PI * 2;
      for (let p = 0; p < pointsPerForward; p++) {
        const t = (p / (pointsPerForward - 1)) * 2 - 1; // -1 to +1
        const pt = getHyperboloidPoint(t, basePhi, true);

        positions[pIndex * 3] = pt.x;
        positions[pIndex * 3 + 1] = pt.y;
        positions[pIndex * 3 + 2] = pt.z;

        const pColor = new THREE.Color();
        const absY = Math.abs(pt.y);

        if (absY < 0.75) {
          // Intense pure white core at the waist
          pColor.lerpColors(colorPureWhite, colorSilverLight, absY / 0.75);
        } else if (absY < 2.5) {
          pColor.lerpColors(colorSilverLight, colorSilver, (absY - 0.75) / 1.75);
        } else {
          pColor.lerpColors(colorSilver, colorSlate, Math.min(1, (absY - 2.5) / 3.0));
        }

        colors[pIndex * 3] = pColor.r;
        colors[pIndex * 3 + 1] = pColor.g;
        colors[pIndex * 3 + 2] = pColor.b;

        pIndex++;
      }
    }

    // B. Counter-Helical Streamlines (creates diamond lattice weave)
    for (let c = 0; c < counterLines; c++) {
      const basePhi = (c / counterLines) * Math.PI * 2;
      for (let p = 0; p < pointsPerCounter; p++) {
        const t = (p / (pointsPerCounter - 1)) * 2 - 1;
        const pt = getHyperboloidPoint(t, basePhi, false);

        positions[pIndex * 3] = pt.x;
        positions[pIndex * 3 + 1] = pt.y;
        positions[pIndex * 3 + 2] = pt.z;

        const pColor = new THREE.Color();
        const absY = Math.abs(pt.y);

        if (absY < 0.9) {
          pColor.lerpColors(colorPureWhite, colorSilverLight, absY / 0.9);
        } else {
          pColor.lerpColors(colorSilverLight, colorDarkSlate, Math.min(1, (absY - 0.9) / 3.2));
        }

        colors[pIndex * 3] = pColor.r * 0.82;
        colors[pIndex * 3 + 1] = pColor.g * 0.82;
        colors[pIndex * 3 + 2] = pColor.b * 0.82;

        pIndex++;
      }
    }

    // C. Latitude Coordinate Rings (concentric loops defining depth)
    const ringTValues = [-0.95, -0.8, -0.65, -0.5, -0.35, -0.2, -0.05, 0.05, 0.2, 0.4, 0.6, 0.75, 0.88, 0.95, 0.99];
    for (let rIdx = 0; rIdx < ringCount; rIdx++) {
      const t = ringTValues[rIdx];
      for (let p = 0; p < pointsPerRing; p++) {
        const phi = (p / pointsPerRing) * Math.PI * 2;
        const pt = getHyperboloidPoint(t, phi, true);

        positions[pIndex * 3] = pt.x;
        positions[pIndex * 3 + 1] = pt.y;
        positions[pIndex * 3 + 2] = pt.z;

        const pColor = new THREE.Color().lerpColors(colorSilver, colorDarkSlate, 0.4);
        colors[pIndex * 3] = pColor.r * 0.65;
        colors[pIndex * 3 + 1] = pColor.g * 0.65;
        colors[pIndex * 3 + 2] = pColor.b * 0.65;

        pIndex++;
      }
    }

    // D. Wide-Angle Ambient Floating Space Dust (Monochrome Silver/White)
    for (let s = 0; s < starCount; s++) {
      const sx = (Math.random() - 0.5) * 38.0;
      const sy = (Math.random() - 0.5) * 24.0;
      const sz = (Math.random() - 0.5) * 16.0 - 2.0;

      positions[pIndex * 3] = sx;
      positions[pIndex * 3 + 1] = sy;
      positions[pIndex * 3 + 2] = sz;

      const pColor = Math.random() > 0.35 ? colorPureWhite : colorSilverLight;
      const dim = 0.3 + Math.random() * 0.5;
      colors[pIndex * 3] = pColor.r * dim;
      colors[pIndex * 3 + 1] = pColor.g * dim;
      colors[pIndex * 3 + 2] = pColor.b * dim;

      pIndex++;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High quality glowing circle point texture (monochrome white/silver)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const radGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radGrad.addColorStop(0.25, 'rgba(240, 243, 246, 0.95)');
    radGrad.addColorStop(0.55, 'rgba(195, 205, 218, 0.45)');
    radGrad.addColorStop(0.85, 'rgba(148, 163, 184, 0.12)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = radGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pointTexture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.10,
      map: pointTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.92,
    });

    const vortexMesh = new THREE.Points(geometry, material);
    const vortexGroup = new THREE.Group();
    vortexGroup.add(vortexMesh);
    scene.add(vortexGroup);

    // 3. Mouse & Scroll Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      scrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Smooth 60fps Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous hypnotic rotation
      vortexMesh.rotation.y = elapsedTime * 0.08 + scrollProgress * Math.PI * 2.5;

      // Mouse tracking interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Dynamic 3D tilt
      vortexGroup.rotation.x = currentMouseY * 0.22 + Math.sin(elapsedTime * 0.4) * 0.03;
      vortexGroup.rotation.z = -currentMouseX * 0.15;

      // Scroll camera elevation tracking
      const targetCamY = 1.2 - scrollProgress * 3.8;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, -0.4 - scrollProgress * 1.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pointTexture.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black ${className}`}
    >
      {/* Subtle radial vignette for text readability */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/75 pointer-events-none" />
    </div>
  );
};

export default ParticleVortexBackground;

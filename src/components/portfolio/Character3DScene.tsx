import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import gsap from 'gsap';

interface Character3DSceneProps {
  className?: string;
  onLoaded?: () => void;
  isIntroComplete?: boolean;
  scrollProgress?: number;
}

interface LoadedAssets {
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  waveAction: THREE.AnimationAction | null;
  walkAction: THREE.AnimationAction | null;
  jumpAction: THREE.AnimationAction | null;
  standAction: THREE.AnimationAction | null;
  armGestureAction: THREE.AnimationAction | null;
  stand1Action: THREE.AnimationAction | null;
  danceAction: THREE.AnimationAction | null;
  scaleFactor: number;
}

let cachedAssetsPromise: Promise<LoadedAssets> | null = null;

function loadCharacterAssets(): Promise<LoadedAssets> {
  if (cachedAssetsPromise) return cachedAssetsPromise;

  cachedAssetsPromise = new Promise(async (resolve, reject) => {
    try {
      const fbxLoader = new FBXLoader();

      // 1. Load Base Rigged Character directly from Mixamo Waving.fbx
      const wavingFbx = await new Promise<any>((res, rej) => {
        fbxLoader.load('/character/Waving.fbx', res, undefined, rej);
      });

      const model = wavingFbx;

      // Auto-center and normalize scale to elegant avatar height (~1.65m)
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const targetHeight = 1.65;
      const scaleFactor = targetHeight / (size.y || 1);
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      model.position.set(
        -center.x * scaleFactor,
        -box.min.y * scaleFactor,
        -center.z * scaleFactor
      );

      // Apply original character colors (midnight navy suit, white shirt, face, hair, watch, sneakers)
      const textureLoader = new THREE.TextureLoader();
      const colorMap = textureLoader.load('/character/texture_0.png');
      colorMap.flipY = false;
      colorMap.colorSpace = THREE.SRGBColorSpace;

      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            map: colorMap,
            roughness: 0.65,
            metalness: 0.1,
          });
        }
      });

      const mixer = new THREE.AnimationMixer(model);
      let waveAction: THREE.AnimationAction | null = null;
      let walkAction: THREE.AnimationAction | null = null;
      let jumpAction: THREE.AnimationAction | null = null;
      let standAction: THREE.AnimationAction | null = null;

      // 2. Play Double-Hand Waving Animation directly on the Mixamo model (plays 1 full complete greeting cycle)
      if (wavingFbx.animations && wavingFbx.animations.length > 0) {
        const waveClip = wavingFbx.animations[0];
        waveAction = mixer.clipAction(waveClip);
        waveAction.setLoop(THREE.LoopOnce, 1);
        waveAction.clampWhenFinished = true;
      }

      // 3. Load Strut Walking Animation from FBX
      try {
        const strutFbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Strut Walking.fbx', res, undefined, rej);
        });
        if (strutFbx.animations && strutFbx.animations.length > 0) {
          const walkClip = strutFbx.animations[0];
          // Make in-place walk cycle by locking forward displacement
          const hipsPosTrack = walkClip.tracks.find((t: any) => t.name.includes('Hips.position'));
          if (hipsPosTrack) {
            const startZ = hipsPosTrack.values[2];
            for (let i = 2; i < hipsPosTrack.values.length; i += 3) {
              hipsPosTrack.values[i] = startZ;
            }
          }
          walkAction = mixer.clipAction(walkClip);
          walkAction.setLoop(THREE.LoopRepeat, Infinity);
        }
      } catch (err) {
        console.warn('Strut walking animation fallback:', err);
      }

      // 4. Load Jumping Animation from FBX
      try {
        const jumpFbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Jumping.fbx', res, undefined, rej);
        });
        if (jumpFbx.animations && jumpFbx.animations.length > 0) {
          const jumpClip = jumpFbx.animations[0];
          jumpAction = mixer.clipAction(jumpClip);
          jumpAction.setLoop(THREE.LoopOnce, 1);
          jumpAction.clampWhenFinished = true;
        }
      } catch (err) {
        console.warn('Jumping animation load fallback:', err);
      }

      // 5. Load Male Standing Pose for settled corner companion stance
      try {
        const standFbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Male Standing Pose.fbx', res, undefined, rej);
        });
        if (standFbx.animations && standFbx.animations.length > 0) {
          const standClip = standFbx.animations[0];
          standAction = mixer.clipAction(standClip);
          standAction.setLoop(THREE.LoopRepeat, Infinity);
        }
      } catch (err) {
        console.warn('Standing pose animation load fallback:', err);
      }

      // 6. Load Arm Gesture for narrative/About section (plays exactly once)
      let armGestureAction: THREE.AnimationAction | null = null;
      try {
        const armFbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Arm Gesture.fbx', res, undefined, rej);
        });
        if (armFbx.animations && armFbx.animations.length > 0) {
          const armClip = armFbx.animations[0];
          armGestureAction = mixer.clipAction(armClip);
          armGestureAction.setLoop(THREE.LoopOnce, 1);
          armGestureAction.clampWhenFinished = true;
        }
      } catch (err) {
        console.warn('Arm Gesture animation load fallback:', err);
      }

      // 7. Load Male Standing Pose 1 for active services/CRM section
      let stand1Action: THREE.AnimationAction | null = null;
      try {
        const stand1Fbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Male Standing Pose 1.fbx', res, undefined, rej);
        });
        if (stand1Fbx.animations && stand1Fbx.animations.length > 0) {
          const stand1Clip = stand1Fbx.animations[0];
          stand1Action = mixer.clipAction(stand1Clip);
          stand1Action.setLoop(THREE.LoopRepeat, Infinity);
        }
      } catch (err) {
        console.warn('Standing pose 1 animation load fallback:', err);
      }

      // 8. Load Gangnam Style for celebratory footer finale dance
      let danceAction: THREE.AnimationAction | null = null;
      try {
        const danceFbx = await new Promise<any>((res, rej) => {
          fbxLoader.load('/character/Gangnam Style.fbx', res, undefined, rej);
        });
        if (danceFbx.animations && danceFbx.animations.length > 0) {
          const danceClip = danceFbx.animations[0];
          // Make in-place dance by stabilizing root hip translation
          const hipsPosTrack = danceClip.tracks.find((t: any) => t.name.includes('Hips.position'));
          if (hipsPosTrack) {
            const startX = hipsPosTrack.values[0];
            const startZ = hipsPosTrack.values[2];
            for (let i = 0; i < hipsPosTrack.values.length; i += 3) {
              hipsPosTrack.values[i] = startX;
              hipsPosTrack.values[i + 2] = startZ;
            }
          }
          danceAction = mixer.clipAction(danceClip);
          danceAction.setLoop(THREE.LoopRepeat, Infinity);
        }
      } catch (err) {
        console.warn('Gangnam Style animation load fallback:', err);
      }

      // Automatically crossfade from one-shot actions (wave greeting, arm gesture) into natural standing pose
      mixer.addEventListener('finished', (e: any) => {
        if (waveAction && standAction && e.action === waveAction) {
          waveAction.fadeOut(0.4);
          standAction.reset().fadeIn(0.4).play();
        }
        if (armGestureAction && standAction && e.action === armGestureAction) {
          armGestureAction.fadeOut(0.5);
          standAction.reset().fadeIn(0.5).play();
        }
      });

      resolve({
        model,
        mixer,
        waveAction,
        walkAction,
        jumpAction,
        standAction,
        armGestureAction,
        stand1Action,
        danceAction,
        scaleFactor,
      });
    } catch (e) {
      reject(e);
    }
  });

  return cachedAssetsPromise;
}

const SECTION_DIALOGUES: Record<string, { text: string }> = {
  hero: { text: "Hi, I'm Nithish" },
  about: { text: "Who I Am" },
  stack: { text: "" },
  service: { text: "What I Shipped" },
  project: { text: "What I Built" },
  contact: { text: "Let's Connect" },
  dance: { text: "Thank you for exploring!" },
  footer: { text: "Thank you for exploring!" },
};

export const Character3DScene: React.FC<Character3DSceneProps> = ({
  className = '',
  onLoaded,
  isIntroComplete = false,
  scrollProgress = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasLanded, setHasLanded] = useState(false);
  const hasLandedRef = useRef(false);
  const isWavingRef = useRef(false);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const [speechVisible, setSpeechVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const scrollDirectionRef = useRef<'down' | 'up'>('down');
  const lastScrollYRef = useRef(0);

  // Track which portfolio section is currently in view
  useEffect(() => {
    const handleSectionScroll = () => {
      const scrollY = window.scrollY;

      // Track scroll direction
      if (scrollY > lastScrollYRef.current + 4) {
        scrollDirectionRef.current = 'down';
      } else if (scrollY < lastScrollYRef.current - 4) {
        scrollDirectionRef.current = 'up';
      }
      lastScrollYRef.current = scrollY;

      if (scrollY < window.innerHeight * 0.5) {
        setActiveSection('hero');
        return;
      }

      // Check if near bottom of page (dance / footer)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 180) {
        setActiveSection('dance');
        return;
      }

      const viewportCenter = window.innerHeight * 0.5;
      const sectionIds = ['footer', 'dance', 'contact', 'project', 'service', 'stack', 'about'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleSectionScroll, { passive: true });
    handleSectionScroll();
    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, []);

  const characterPivotRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{
    wave: THREE.AnimationAction | null;
    walk: THREE.AnimationAction | null;
    jump: THREE.AnimationAction | null;
    stand: THREE.AnimationAction | null;
    armGesture: THREE.AnimationAction | null;
    stand1: THREE.AnimationAction | null;
    dance: THREE.AnimationAction | null;
    current: string;
  }>({
    wave: null,
    walk: null,
    jump: null,
    stand: null,
    armGesture: null,
    stand1: null,
    dance: null,
    current: 'none',
  });

  const baseScaleRef = useRef(1);
  const isIntroCompleteRef = useRef(isIntroComplete);
  const scrollProgressRef = useRef(scrollProgress);

  useEffect(() => {
    isIntroCompleteRef.current = isIntroComplete;
  }, [isIntroComplete]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Handle jump-in entrance when intro sequence completes
  useEffect(() => {
    if (!isIntroComplete || !characterPivotRef.current) return;

    const pivot = characterPivotRef.current;
    pivot.visible = true;

    // Reset initial jump drop position from viewport top with athletic lean
    pivot.position.set(0, 2.4, 0);
    pivot.rotation.set(0.10, 0, 0);
    pivot.scale.set(baseScaleRef.current, baseScaleRef.current, baseScaleRef.current);

    // Dynamic Gravitational Leap & Elastic Landing
    gsap.killTweensOf(pivot.position);
    gsap.killTweensOf(pivot.rotation);
    gsap.killTweensOf(pivot.scale);

    const tl = gsap.timeline({
      onComplete: () => {
        setHasLanded(true);
        hasLandedRef.current = true;
        isWavingRef.current = true;
        setSpeechVisible(true);

        // Switch smoothly to waving action
        const currentActions = actionsRef.current;
        if (currentActions.wave) {
          currentActions.wave.reset().fadeIn(0.25).play();
          currentActions.current = 'wave';
        }

        // Allow waving greeting to play full ~3.1s cycle, then transition to stand
        gsap.delayedCall(3.2, () => {
          if (isWavingRef.current && actionsRef.current.current === 'wave') {
            isWavingRef.current = false;
            if (actionsRef.current.stand) {
              actionsRef.current.wave?.fadeOut(0.4);
              actionsRef.current.stand.reset().fadeIn(0.4).play();
              actionsRef.current.current = 'stand';
            }
          }
        });
      },
    });

    // Clean, natural descent into center stage (0.55s)
    tl.to(
      pivot.position,
      {
        y: -0.05,
        duration: 0.55,
        ease: 'power2.in',
      },
      0
    );

    // Straighten forward athletic tilt upon ground contact
    tl.to(
      pivot.rotation,
      {
        x: 0,
        duration: 0.55,
        ease: 'power2.in',
      },
      0
    );

    // Landing squash & stretch elastic rebound
    tl.to(
      pivot.scale,
      {
        y: baseScaleRef.current * 0.82,
        x: baseScaleRef.current * 1.15,
        z: baseScaleRef.current * 1.15,
        duration: 0.10,
        ease: 'power2.out',
      },
      0.55
    );

    tl.to(
      pivot.scale,
      {
        x: baseScaleRef.current,
        y: baseScaleRef.current,
        z: baseScaleRef.current,
        duration: 0.45,
        ease: 'elastic.out(1.2, 0.45)',
      },
      0.65
    );
  }, [isIntroComplete]);

  const previousSectionRef = useRef<string>('hero');
  const hasPlayedAboutGestureRef = useRef(false);

  // Cinematic Choreography: Strut Walk transit, Directional Stage Wings for Stack, and Symmetrical Return
  useEffect(() => {
    if (!hasLanded || !characterPivotRef.current) return;

    const pivot = characterPivotRef.current;
    const actions = actionsRef.current;
    const prevSection = previousSectionRef.current;
    const currentSection = activeSection;
    previousSectionRef.current = currentSection;

    // Helper to crossfade between actions smoothly
    const switchAction = (newAction: THREE.AnimationAction | null, name: string, fadeDuration = 0.3) => {
      if (!newAction || actions.current === name) return;
      const allActions = [
        actions.wave,
        actions.walk,
        actions.jump,
        actions.stand,
        actions.armGesture,
        actions.stand1,
        actions.dance,
      ];
      allActions.forEach((act) => {
        if (act && act !== newAction) {
          act.fadeOut(fadeDuration);
        }
      });
      newAction.reset().fadeIn(fadeDuration).play();
      actions.current = name;
    };

    // Kill any ongoing tweens
    gsap.killTweensOf(pivot.position);
    gsap.killTweensOf(pivot.rotation);
    gsap.killTweensOf(pivot.scale);

    if (currentSection !== 'hero') {
      isWavingRef.current = false;
    }

    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      if (currentSection !== 'hero' && currentSection !== 'dance') {
        pivot.visible = false;
        if (shadowMeshRef.current) shadowMeshRef.current.visible = false;
        setSpeechVisible(false);
        return;
      } else {
        pivot.visible = true;
        if (shadowMeshRef.current) shadowMeshRef.current.visible = true;
      }
    } else {
      pivot.visible = true;
      if (shadowMeshRef.current) shadowMeshRef.current.visible = true;
    }

    if (currentSection === 'hero') {
      setSpeechVisible(true);
      if (!isWavingRef.current) {
        switchAction(actions.stand, 'stand', 0.35);
      }

      gsap.to(pivot.position, {
        x: 0,
        y: -0.05,
        z: 0,
        duration: 0.9,
        ease: 'power2.out',
      });
      gsap.to(pivot.scale, {
        x: baseScaleRef.current,
        y: baseScaleRef.current,
        z: baseScaleRef.current,
        duration: 0.9,
        ease: 'power2.out',
      });
      gsap.to(pivot.rotation, {
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    } else if (currentSection === 'about') {
      const targetScale = baseScaleRef.current * 0.68;

      if (prevSection === 'hero') {
        // DOWNWARD ENTRANCE: Turn right, play strut walk across to right corner, then gesture & stand
        setSpeechVisible(false);
        switchAction(actions.walk, 'walk', 0.2);

        // Turn facing right
        gsap.to(pivot.rotation, {
          y: Math.PI * 0.42,
          duration: 0.25,
          ease: 'power2.out',
        });

        // Scale smoothly during the walk
        gsap.to(pivot.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 1.0,
          ease: 'power1.inOut',
        });

        // Walk across from x=0 to x=2.10
        gsap.to(pivot.position, {
          x: 2.10,
          y: -0.16,
          z: -0.28,
          duration: 1.0,
          ease: 'power1.inOut',
          onComplete: () => {
            // Arrived at right corner: rotate inward toward about card
            gsap.to(pivot.rotation, {
              y: -Math.PI * 0.22,
              duration: 0.35,
              ease: 'power2.out',
            });

            // Perform arm gesture once, then stand
            if (!hasPlayedAboutGestureRef.current && actions.armGesture) {
              switchAction(actions.armGesture, 'armGesture', 0.25);
              hasPlayedAboutGestureRef.current = true;
              setSpeechVisible(true);

              // After arm gesture completes (~2.4s), transition to stand
              gsap.delayedCall(2.4, () => {
                if (actionsRef.current.current === 'armGesture') {
                  switchAction(actions.stand, 'stand', 0.3);
                }
              });
            } else {
              switchAction(actions.stand, 'stand', 0.25);
              setSpeechVisible(true);
            }
          },
        });
      } else {
        // UPWARD / BACKWARD RETURN FROM BELOW:
        // If he was on the left side, hide him immediately and teleport backstage to off-screen right (3.5)
        if (pivot.position.x < 0) {
          pivot.visible = false;
          pivot.position.set(3.5, -0.16, -0.28);
        }

        pivot.visible = true;
        setSpeechVisible(false);
        switchAction(actions.walk, 'walk', 0.2);

        // Face left inward
        gsap.to(pivot.rotation, {
          y: -Math.PI * 0.45,
          duration: 0.2,
          ease: 'power2.out',
        });

        gsap.to(pivot.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.75,
          ease: 'power2.out',
        });

        gsap.to(pivot.position, {
          x: 2.10,
          y: -0.16,
          z: -0.28,
          duration: 0.75,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(pivot.rotation, {
              y: -Math.PI * 0.22,
              duration: 0.35,
              ease: 'power2.out',
            });
            switchAction(actions.stand, 'stand', 0.25);
            setSpeechVisible(true);
          },
        });
      }
    } else if (currentSection === 'stack') {
      // In Stack Marquee, he ALWAYS exits to the nearest off-screen wing:
      // If he was on the right (x > 0), he walks off to the RIGHT (x = 3.8).
      // If he was on the left (x <= 0), he walks off to the LEFT (x = -3.8).
      // Zero cross-stage walking!
      setSpeechVisible(false);
      switchAction(actions.walk, 'walk', 0.2);

      const targetScale = baseScaleRef.current * 0.68;

      if (pivot.position.x > 0) {
        // Walk off-screen to the RIGHT wing
        gsap.to(pivot.rotation, {
          y: Math.PI * 0.48,
          duration: 0.2,
          ease: 'power2.out',
        });
        gsap.to(pivot.position, {
          x: 3.8,
          y: -0.16,
          z: -0.28,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            // Once safely off-screen right, hide him so he can never flash across
            pivot.visible = false;
          },
        });
      } else {
        // Walk off-screen to the LEFT wing
        gsap.to(pivot.rotation, {
          y: -Math.PI * 0.48,
          duration: 0.2,
          ease: 'power2.out',
        });
        gsap.to(pivot.position, {
          x: -3.8,
          y: -0.16,
          z: -0.28,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            // Once safely off-screen left, hide him
            pivot.visible = false;
          },
        });
      }

      gsap.to(pivot.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.7,
        ease: 'power2.out',
      });
    } else if (currentSection === 'service' || currentSection === 'project') {
      // Stage Left: Desired spot is x = -2.05 (cleanly in the left corner)
      const targetScale = baseScaleRef.current * 0.68;
      const targetX = -2.05;

      // If he was on the right side, hide him immediately and teleport backstage to off-screen left (-3.5)
      if (pivot.position.x > 0) {
        pivot.visible = false;
        pivot.position.set(-3.5, -0.16, -0.28);
      }

      // Now make him visible at off-screen left and walk into stage left
      pivot.visible = true;

      const targetAction =
        (currentSection === 'service' || currentSection === 'project') && actions.stand1
          ? actions.stand1
          : actions.stand;
      const targetActionName =
        (currentSection === 'service' || currentSection === 'project') && actions.stand1 ? 'stand1' : 'stand';

      if (Math.abs(pivot.position.x - targetX) > 0.4) {
        setSpeechVisible(false);
        switchAction(actions.walk, 'walk', 0.2);

        gsap.to(pivot.rotation, {
          y: Math.PI * 0.35,
          duration: 0.2,
          ease: 'power2.out',
        });

        gsap.to(pivot.position, {
          x: targetX,
          y: -0.16,
          z: -0.28,
          duration: 0.75,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(pivot.rotation, {
              y: Math.PI * 0.22,
              duration: 0.35,
              ease: 'power2.out',
            });
            switchAction(targetAction, targetActionName, 0.25);
            setSpeechVisible(true);
          },
        });
      } else {
        switchAction(targetAction, targetActionName, 0.25);
        setSpeechVisible(true);
        gsap.to(pivot.rotation, {
          y: Math.PI * 0.22,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      gsap.to(pivot.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.75,
        ease: 'power2.out',
      });
    } else if (currentSection === 'contact') {
      pivot.visible = true;
      // Stage Left
      const targetScale = baseScaleRef.current * 0.68;
      switchAction(actions.stand, 'stand', 0.25);
      setSpeechVisible(true);

      gsap.to(pivot.position, {
        x: -2.05,
        y: -0.16,
        z: -0.28,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.to(pivot.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.to(pivot.rotation, {
        y: Math.PI * 0.22,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (currentSection === 'dance' || currentSection === 'footer') {
      pivot.visible = true;
      const targetScale = baseScaleRef.current * 0.88;

      if (Math.abs(pivot.position.x) > 0.4) {
        // Walk smoothly from stage left into center stage, then burst into celebratory dance!
        setSpeechVisible(false);
        switchAction(actions.walk, 'walk', 0.2);

        gsap.to(pivot.rotation, {
          y: Math.PI * 0.42,
          duration: 0.25,
          ease: 'power2.out',
        });

        gsap.to(pivot.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.8,
          ease: 'power1.out',
        });

        gsap.to(pivot.position, {
          x: 0,
          y: 0.10,
          z: 0,
          duration: 0.8,
          ease: 'power1.out',
          onComplete: () => {
            gsap.to(pivot.rotation, {
              y: 0,
              duration: 0.35,
              ease: 'power2.out',
            });
            switchAction(actions.dance || actions.stand, 'dance', 0.25);
            setSpeechVisible(true);
          },
        });
      } else {
        // Already near center
        switchAction(actions.dance || actions.stand, 'dance', 0.3);
        setSpeechVisible(true);

        gsap.to(pivot.position, {
          x: 0,
          y: 0.10,
          z: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.to(pivot.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.to(pivot.rotation, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  }, [activeSection, hasLanded]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.95, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting (Clean, luxury Dark Aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keySpot = new THREE.DirectionalLight(0xfff8ee, 2.8);
    keySpot.position.set(2.0, 4.0, 3.5);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    const rimGold = new THREE.DirectionalLight(0xE5B869, 2.8);
    rimGold.position.set(-3.0, 2.5, -2.5);
    scene.add(rimGold);

    const rimAmber = new THREE.DirectionalLight(0xD4A373, 1.4);
    rimAmber.position.set(3.0, 1.8, -2.5);
    scene.add(rimAmber);

    // 3. Dynamic Moving Ground Shadow (No circular ring pedestal, pure soft natural shadow)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const shadowGrad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = shadowGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.9 })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;

    // 4. Ground Shadow on Floor Level (not parented to sky pivot)
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;
    shadowMesh.visible = false;

    // 5. Character Pivot
    const characterPivot = new THREE.Group();
    characterPivot.visible = false; // Hidden until intro finishes
    scene.add(characterPivot);
    characterPivotRef.current = characterPivot;

    // Load Character & Animations
    loadCharacterAssets()
      .then((assets) => {
        if (isDisposed) return;

        characterPivot.add(assets.model);
        mixerRef.current = assets.mixer;
        baseScaleRef.current = 1.0;

        actionsRef.current.wave = assets.waveAction;
        actionsRef.current.walk = assets.walkAction;
        actionsRef.current.jump = assets.jumpAction;
        actionsRef.current.stand = assets.standAction;
        actionsRef.current.armGesture = assets.armGestureAction;
        actionsRef.current.stand1 = assets.stand1Action;
        actionsRef.current.dance = assets.danceAction;

        if (hasLandedRef.current && assets.waveAction) {
          assets.waveAction.reset().fadeIn(0.3).play();
          actionsRef.current.current = 'wave';
        }

        onLoaded?.();
      })
      .catch((err) => {
        console.error('Failed to load character assets:', err);
      });

    // 6. Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      if (shadowMeshRef.current && characterPivotRef.current) {
        const pivot = characterPivotRef.current;
        const sMesh = shadowMeshRef.current;
        sMesh.visible = pivot.visible;
        sMesh.position.x = pivot.position.x;
        sMesh.position.z = pivot.position.z;
        const heightRatio = Math.max(0, Math.min(1, (pivot.position.y + 0.05) / 2.5));
        const shadowScale = (1 - heightRatio * 0.35) * pivot.scale.x;
        sMesh.scale.set(shadowScale, shadowScale, shadowScale);
        (sMesh.material as THREE.MeshBasicMaterial).opacity = (1 - heightRatio * 0.7) * 0.85;
      }

      renderer.render(scene, camera);
    };

    render();

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      {/* Floating White Dialogue Bubble */}
      {isIntroComplete && hasLanded && activeSection !== 'stack' && (
        <div
          className={`fixed z-40 pointer-events-none transition-all duration-500 ease-out ${
            speechVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-3'
          }`}
          style={
            activeSection === 'service' || activeSection === 'project' || activeSection === 'contact'
              ? {
                  bottom: '390px',
                  left: '42px',
                }
              : activeSection === 'about'
              ? {
                  bottom: '390px',
                  right: '70px',
                }
              : activeSection === 'dance' || activeSection === 'footer'
              ? {
                  bottom: '475px',
                  left: 'calc(50% + 55px)',
                }
              : {
                  top: '30%',
                  left: 'min(calc(50% + 55px), calc(100vw - 240px))',
                }
          }
        >
          <div className="relative bg-white text-gray-900 px-4 py-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center space-x-2 border border-gray-100 backdrop-blur-md">
            <span className="text-sm md:text-base font-bold tracking-tight text-gray-900 whitespace-nowrap">
              {SECTION_DIALOGUES[activeSection]?.text || "Hi, I'm Nithish"}
            </span>

            {/* Speech bubble pointer pointing towards Nithish */}
            <div
              className={`absolute w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100 ${
                activeSection === 'service' || activeSection === 'project' || activeSection === 'contact'
                  ? '-bottom-1.5 left-10'
                  : activeSection === 'about'
                  ? '-bottom-1.5 right-6'
                  : '-bottom-1.5 left-5'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Character3DScene;

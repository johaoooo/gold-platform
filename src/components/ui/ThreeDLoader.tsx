'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDLoaderProps {
  onComplete: () => void;
}

export default function ThreeDLoader({ onComplete }: ThreeDLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05090a);
    scene.fog = new THREE.FogExp2(0x05090a, 0.03);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0x22c55e, 0.4);
    fillLight.position.set(-2, 1, 3);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0x22c55e, 0.3);
    backLight.position.set(0, 1, -3);
    scene.add(backLight);
    
    const rimLight = new THREE.PointLight(0xffaa44, 0.5);
    rimLight.position.set(1, 2, 2);
    scene.add(rimLight);

    // ========== PORTEUR DE PROJET (Côté gauche - Idée/Vision) ==========
    const porteurGroup = new THREE.Group();
    porteurGroup.position.set(-1.5, -0.2, 0);

    // Corps
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.35, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.1 })
    );
    body.position.y = 0.4;
    body.castShadow = true;
    porteurGroup.add(body);

    // Tête
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.2 })
    );
    head.position.y = 0.9;
    head.castShadow = true;
    porteurGroup.add(head);

    // Idée/Étoile au-dessus de la tête
    const starGroup = new THREE.Group();
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.5 });
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 0.25, 6),
        starMaterial
      );
      spike.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0);
      spike.rotation.z = angle;
      starGroup.add(spike);
    }
    const starCenter = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      starMaterial
    );
    starGroup.add(starCenter);
    starGroup.position.y = 1.25;
    porteurGroup.add(starGroup);

    // Bras gauche (avec idée)
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 })
    );
    leftArm.position.set(-0.5, 0.7, 0);
    leftArm.rotation.z = 0.4;
    leftArm.rotation.x = 0.2;
    porteurGroup.add(leftArm);

    // Bras droit (tend vers l'investisseur)
    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 })
    );
    rightArm.position.set(0.5, 0.7, 0);
    rightArm.rotation.z = -0.3;
    rightArm.rotation.x = -0.2;
    porteurGroup.add(rightArm);

    // Main droite avec petite ampoule/idée
    const handLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
    );
    handLight.position.set(0.85, 0.55, 0.15);
    porteurGroup.add(handLight);

    scene.add(porteurGroup);

    // ========== INVESTISSEUR (Côté droit - Argent/Capital) ==========
    const investisseurGroup = new THREE.Group();
    investisseurGroup.position.set(1.5, -0.2, 0);

    // Corps
    const investBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.35, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.2, metalness: 0.3 })
    );
    investBody.position.y = 0.4;
    investBody.castShadow = true;
    investisseurGroup.add(investBody);

    // Tête
    const investHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.2 })
    );
    investHead.position.y = 0.9;
    investHead.castShadow = true;
    investisseurGroup.add(investHead);

    // Pièces d'or autour de la tête
    const coinGroup = new THREE.Group();
    const coinMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16),
        coinMaterial
      );
      coin.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.35 + 0.05, 0);
      coin.rotation.x = Math.PI / 2;
      coinGroup.add(coin);
    }
    coinGroup.position.y = 1.1;
    investisseurGroup.add(coinGroup);

    // Bras gauche (tend vers le porteur)
    const investLeftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.2 })
    );
    investLeftArm.position.set(-0.5, 0.7, 0);
    investLeftArm.rotation.z = 0.3;
    investLeftArm.rotation.x = 0.2;
    investisseurGroup.add(investLeftArm);

    // Bras droit
    const investRightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.2 })
    );
    investRightArm.position.set(0.5, 0.7, 0);
    investRightArm.rotation.z = -0.4;
    investRightArm.rotation.x = -0.2;
    investisseurGroup.add(investRightArm);

    // Main gauche avec pièce d'or
    const goldCoin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.1 })
    );
    goldCoin.position.set(-0.85, 0.55, 0.15);
    goldCoin.rotation.x = Math.PI / 2;
    investisseurGroup.add(goldCoin);

    scene.add(investisseurGroup);

    // ========== CONNEXION (particules entre les deux) ==========
    const connectionPoints: THREE.Mesh[] = [];
    const connectionMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.3 });
    for (let i = 0; i < 30; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        connectionMaterial
      );
      particle.visible = false;
      scene.add(particle);
      connectionPoints.push(particle);
    }

    // Ground reflection effect
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 3),
      new THREE.MeshStandardMaterial({ color: 0x0a120b, roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.3 })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.5;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    let time = 0;
    let animationFrame: number;
    let connectionProgress = 0;

    // Animation
    const animate = () => {
      time += 0.02;
      connectionProgress = Math.min(connectionProgress + 0.01, 1);
      
      // Animation de rapprochement
      const handshakeProgress = Math.sin(time * 0.8) * 0.08;
      
      // Porteur se penche vers l'investisseur
      porteurGroup.position.x = -1.5 + handshakeProgress * 0.5;
      porteurGroup.rotation.z = -handshakeProgress * 0.1;
      
      // Investisseur se penche vers le porteur
      investisseurGroup.position.x = 1.5 - handshakeProgress * 0.5;
      investisseurGroup.rotation.z = handshakeProgress * 0.1;
      
      // Mouvement des bras pour la poignée de main
      rightArm.rotation.z = -0.3 - handshakeProgress * 0.4;
      investLeftArm.rotation.z = 0.3 + handshakeProgress * 0.4;
      
      // Animation des symboles
      starGroup.rotation.y = time;
      starGroup.scale.setScalar(1 + Math.sin(time * 8) * 0.1);
      
      coinGroup.rotation.y = time * 0.5;
      goldCoin.rotation.z = Math.sin(time * 5) * 0.2;
      handLight.material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.3;
      
      // Particules de connexion
      connectionPoints.forEach((particle, i) => {
        const t = (time * 0.5 + i * 0.1) % 1;
        const x = -1.2 + t * 2.4;
        const y = 0.3 + Math.sin(t * Math.PI * 2) * 0.2;
        const z = Math.sin(t * Math.PI * 4) * 0.1;
        particle.position.set(x, y, z);
        particle.visible = t < connectionProgress;
        particle.scale.setScalar(0.8 + Math.sin(time * 10 + i) * 0.3);
      });
      
      // Update progress
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 0.8, 100));
      }
      
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Complete after 4 seconds
    setTimeout(() => {
      setLoadingComplete(true);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center">
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '500px' }} />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64">
        <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-green-500/60 text-sm mt-3 font-mono">
          {loadingComplete ? '✓ Connexion établie' : `${Math.floor(progress)}%`}
        </p>
      </div>
    </div>
  );
}

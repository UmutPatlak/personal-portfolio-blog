import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Scene, Camera, Renderer ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // ─── Theme Colors ───
    const getThemeColors = () => {
      const isLight = document.documentElement.classList.contains('light');
      if (isLight) {
        return {
          lineColor: 0x4f46e5,   // Refined Indigo
          pointColor: 0x0891b2,  // Cyan
          lineOpacity: 0.14,
          pointOpacity: 0.22,
          blending: THREE.NormalBlending,
        };
      }
      return {
        lineColor: 0x06b6d4,   // Neon Cyan
        pointColor: 0x38bdf8,  // Glow Sky
        lineOpacity: 0.18,
        pointOpacity: 0.32,
        blending: THREE.AdditiveBlending,
      };
    };

    let themeColors = getThemeColors();

    // ─── Base Morph Geometry Setup ───
    // We use a parameterized sphere grid as the common topological base.
    // Every shape (Icosahedron, Octahedron, Torus, Cube, Sphere) maps 1:1
    // to the exact same vertex buffer so transitions are 100% seamless and glitch-free.
    const widthSegs = 28;
    const heightSegs = 28;
    const baseGeom = new THREE.SphereGeometry(1, widthSegs, heightSegs);
    const posAttr = baseGeom.getAttribute('position') as THREE.BufferAttribute;
    const vertexCount = posAttr.count;

    // Compute 20 face normals for Icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawIcosaVerts: [number, number, number][] = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1],
    ];
    const icosaVerts = rawIcosaVerts.map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len] as [number, number, number];
    });

    const edgeDist = 2 / Math.sqrt(1 + phi * phi); // ~1.05146
    const icosaFaceNormals: [number, number, number][] = [];
    for (let a = 0; a < 12; a++) {
      const va = icosaVerts[a]!;
      for (let b = a + 1; b < 12; b++) {
        const vb = icosaVerts[b]!;
        const dAB = Math.hypot(va[0] - vb[0], va[1] - vb[1], va[2] - vb[2]);
        if (Math.abs(dAB - edgeDist) > 0.06) continue;
        for (let c = b + 1; c < 12; c++) {
          const vc = icosaVerts[c]!;
          const dBC = Math.hypot(vb[0] - vc[0], vb[1] - vc[1], vb[2] - vc[2]);
          const dCA = Math.hypot(vc[0] - va[0], vc[1] - va[1], vc[2] - va[2]);
          if (Math.abs(dBC - edgeDist) < 0.06 && Math.abs(dCA - edgeDist) < 0.06) {
            const nx = va[0] + vb[0] + vc[0];
            const ny = va[1] + vb[1] + vc[1];
            const nz = va[2] + vb[2] + vc[2];
            const nlen = Math.hypot(nx, ny, nz) || 1;
            icosaFaceNormals.push([nx / nlen, ny / nlen, nz / nlen]);
          }
        }
      }
    }

    // Precompute vertex position buffers for 5 morph shapes:
    // 0: Icosahedron (Hero - crystal form)
    // 1: Octahedron (Experience / About)
    // 2: Torus (Projects)
    // 3: Cube / Box (Skills)
    // 4: Sphere / Crystal Core (Contact)
    const posIcosahedron = new Float32Array(vertexCount * 3);
    const posOctahedron  = new Float32Array(vertexCount * 3);
    const posTorus       = new Float32Array(vertexCount * 3);
    const posCube        = new Float32Array(vertexCount * 3);
    const posSphere      = new Float32Array(vertexCount * 3);

    const basePositions = posAttr.array as Float32Array;

    for (let i = 0; i < vertexCount; i++) {
      const idx = i * 3;
      const x = basePositions[idx] ?? 0;
      const y = basePositions[idx + 1] ?? 0;
      const z = basePositions[idx + 2] ?? 0;

      const len = Math.hypot(x, y, z) || 1;
      const ux = x / len;
      const uy = y / len;
      const uz = z / len;

      // ─── Shape 0: Icosahedron ───
      let maxDot = -1;
      for (let f = 0; f < icosaFaceNormals.length; f++) {
        const fn = icosaFaceNormals[f]!;
        const dot = ux * fn[0] + uy * fn[1] + uz * fn[2];
        if (dot > maxDot) maxDot = dot;
      }
      const rIcosa = (0.79465 / Math.max(0.01, maxDot)) * 1.32;
      posIcosahedron[idx]     = ux * rIcosa;
      posIcosahedron[idx + 1] = uy * rIcosa;
      posIcosahedron[idx + 2] = uz * rIcosa;

      // ─── Shape 1: Octahedron ───
      const dOcta = Math.abs(ux) + Math.abs(uy) + Math.abs(uz);
      const rOcta = (1.1 / Math.max(0.01, dOcta)) * 1.15;
      posOctahedron[idx]     = ux * rOcta;
      posOctahedron[idx + 1] = uy * rOcta;
      posOctahedron[idx + 2] = uz * rOcta;

      // ─── Shape 2: Torus ───
      const col = i % (widthSegs + 1);
      const row = Math.floor(i / (widthSegs + 1));
      const theta = (col / widthSegs) * Math.PI * 2;
      const phiAngle = (row / heightSegs) * Math.PI;
      const R_torus = 1.05;
      const r_torus = 0.42;
      posTorus[idx]     = (R_torus + r_torus * Math.cos(2 * phiAngle)) * Math.cos(theta);
      posTorus[idx + 1] = (R_torus + r_torus * Math.cos(2 * phiAngle)) * Math.sin(theta);
      posTorus[idx + 2] = r_torus * Math.sin(2 * phiAngle);

      // ─── Shape 3: Cube (Box) ───
      const dCube = Math.max(Math.abs(ux), Math.abs(uy), Math.abs(uz));
      const rCube = 0.95 / Math.max(0.01, dCube);
      posCube[idx]     = ux * rCube;
      posCube[idx + 1] = uy * rCube;
      posCube[idx + 2] = uz * rCube;

      // ─── Shape 4: Sphere ───
      const rSphere = 1.25;
      posSphere[idx]     = ux * rSphere;
      posSphere[idx + 1] = uy * rSphere;
      posSphere[idx + 2] = uz * rSphere;
    }

    const shapes: Float32Array[] = [posIcosahedron, posOctahedron, posTorus, posCube, posSphere];

    // Initialize base geometry with Shape 0
    (posAttr.array as Float32Array).set(posIcosahedron);
    posAttr.needsUpdate = true;

    // ─── Wireframe Mesh & Vertex Points ───
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: themeColors.lineColor,
      wireframe: true,
      transparent: true,
      opacity: themeColors.lineOpacity,
      blending: themeColors.blending,
      depthWrite: false,
    });
    const wireframeMesh = new THREE.Mesh(baseGeom, wireframeMaterial);
    rootGroup.add(wireframeMesh);

    // Glowing vertex points
    const pointsMaterial = new THREE.PointsMaterial({
      color: themeColors.pointColor,
      size: 0.045,
      transparent: true,
      opacity: themeColors.pointOpacity,
      blending: themeColors.blending,
      depthWrite: false,
    });
    const pointsMesh = new THREE.Points(baseGeom, pointsMaterial);
    rootGroup.add(pointsMesh);

    // ─── Theme Change Listener ───
    const themeObserver = new MutationObserver(() => {
      themeColors = getThemeColors();
      wireframeMaterial.color.setHex(themeColors.lineColor);
      wireframeMaterial.opacity = themeColors.lineOpacity;
      wireframeMaterial.blending = themeColors.blending;

      pointsMaterial.color.setHex(themeColors.pointColor);
      pointsMaterial.opacity = themeColors.pointOpacity;
      pointsMaterial.blending = themeColors.blending;

      wireframeMaterial.needsUpdate = true;
      pointsMaterial.needsUpdate = true;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // ─── Scroll & Mouse Tracking ───
    let currentScrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const computeScrollProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      return Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    const handleScroll = () => {
      targetScrollProgress = computeScrollProgress();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    targetScrollProgress = computeScrollProgress();
    currentScrollProgress = targetScrollProgress;

    // ─── Positioning & Responsiveness ───
    // Obje viewport içinde sabit kalır (sayfayla kaymaz / text'in üzerine geçmez).
    // Masaüstünde sağ tarafta sakin ve estetik bir konumda durur.
    // Mobilde merkezde hafif küçültülmüş olarak yer alır.
    const updateViewportPosition = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

      const isMobile = width < 768;
      if (isMobile) {
        rootGroup.position.set(0, -0.2, 0);
        rootGroup.scale.setScalar(0.7);
      } else {
        // Desktop: Right side ambient placement
        rootGroup.position.set(2.35, 0.0, 0);
        rootGroup.scale.setScalar(1.0);
      }
    };

    window.addEventListener('resize', updateViewportPosition, { passive: true });
    updateViewportPosition();

    // ─── Animation Loop (RAF) ───
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.getDelta();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation (lerp)
      const lerpFactor = prefersReducedMotion ? 1 : 0.06;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * lerpFactor;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // ─── Vertex Morphing Engine ───
      // 4 morph segments connecting 5 shapes:
      // 0.00 -> Shape 0 (Icosahedron)
      // 0.25 -> Shape 1 (Octahedron)
      // 0.50 -> Shape 2 (Torus)
      // 0.75 -> Shape 3 (Cube)
      // 1.00 -> Shape 4 (Sphere)
      const totalSegments = shapes.length - 1; // 4
      const scaledProgress = currentScrollProgress * totalSegments;
      const segmentIndex = Math.min(totalSegments - 1, Math.floor(scaledProgress));
      const segmentFraction = scaledProgress - segmentIndex;

      // Smoothstep easing for organic vertex morph transition
      const morphT = segmentFraction * segmentFraction * (3 - 2 * segmentFraction);

      const shapeA = shapes[segmentIndex]!;
      const shapeB = shapes[segmentIndex + 1] ?? shapeA;
      const currentPositions = posAttr.array as Float32Array;

      const len = currentPositions.length;
      for (let j = 0; j < len; j += 3) {
        const ax = shapeA[j]!;
        const ay = shapeA[j + 1]!;
        const az = shapeA[j + 2]!;
        const bx = shapeB[j]!;
        const by = shapeB[j + 1]!;
        const bz = shapeB[j + 2]!;

        currentPositions[j]     = ax + (bx - ax) * morphT;
        currentPositions[j + 1] = ay + (by - ay) * morphT;
        currentPositions[j + 2] = az + (bz - az) * morphT;
      }
      posAttr.needsUpdate = true;

      // ─── Smooth Rotation with Scroll & Ambient Idle ───
      const idleSpeed = prefersReducedMotion ? 0 : 0.2;
      const scrollRotationMultiplier = prefersReducedMotion ? 0 : 1;

      rootGroup.rotation.y =
        elapsedTime * idleSpeed +
        currentScrollProgress * Math.PI * 3.5 * scrollRotationMultiplier +
        mouseX * 0.15;
      rootGroup.rotation.x =
        elapsedTime * (idleSpeed * 0.6) +
        currentScrollProgress * Math.PI * 1.6 * scrollRotationMultiplier +
        mouseY * 0.15;
      rootGroup.rotation.z =
        currentScrollProgress * Math.PI * 0.75 * scrollRotationMultiplier;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup on Unmount ───
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateViewportPosition);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      themeObserver.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      baseGeom.dispose();
      wireframeMaterial.dispose();
      pointsMaterial.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

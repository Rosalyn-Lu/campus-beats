// src/components/ParticleImage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ url }) {
  const pointsRef = useRef();
  const [positions, setPositions] = useState(null);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 70; const height = 70; // 粒子采样率（越大越卡）
      canvas.width = width; canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;

      const pos = []; const col = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i]; const g = data[i+1]; const b = data[i+2]; const a = data[i+3];
          if (a > 10 && (r + g + b) > 40) {
            pos.push((x / width - 0.5) * 2, -(y / height - 0.5) * 2, (Math.random() - 0.5) * 0.3);
            col.push(r / 255, g / 255, b / 255);
          }
        }
      }
      setPositions(new Float32Array(pos));
      setColors(new Float32Array(col));
    };
  }, [url]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function ParticleImage({ url }) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 1.8], fov: 75 }} gl={{ antialias: false, alpha: true }}>
        <Particles url={url} />
      </Canvas>
    </div>
  );
}
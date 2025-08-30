/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, TorusKnot, Edges } from '@react-three/drei';
import { useSpring } from 'react-spring';
import { a } from '@react-spring/three';
import * as THREE from 'three';

interface HarmonyPanel3DProps {
  onClose: () => void;
  blockNumber: number;
  // props to be passed to the group
  [x: string]: any;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_opacity;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = vUv * 3.0;
    
    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.1 * u_time);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);
    
    float f = fbm(st + r);

    vec3 colorPurple = vec3(0.5, 0.0, 1.0); 
    vec3 colorGold = vec3(1.0, 0.84, 0.0); 
    vec3 colorBlack = vec3(0.0, 0.0, 0.0); 

    vec3 color = mix(colorPurple, colorGold, clamp((f*f)*2.0, 0.0, 1.0));
    color = mix(color, colorBlack, clamp(length(q), 0.0, 1.0));
    color = mix(color, colorGold, clamp(length(r.x), 0.0, 1.0));
    color = mix(color, colorPurple, smoothstep(0.1, 0.6, f));

    gl_FragColor = vec4(color, u_opacity);
  }
`;

// FIX: Create animated versions of Drei components to handle opacity spring.
const AnimatedEdges = a(Edges);
const AnimatedText = a(Text);

const HarmonyPanel3D: React.FC<HarmonyPanel3DProps> = ({ onClose, blockNumber, ...props }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);
  const knotRef = useRef<THREE.Mesh>(null!);
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  
  const uniforms = useMemo(() => ({
    u_time: { value: 0.0 },
    u_opacity: { value: 0.0 },
  }), []);

  const [spring, api] = useSpring(() => ({
    emissiveIntensity: 0.5,
  }));

  const { opacity, scale } = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 280, friction: 30 }
  });

  useEffect(() => {
    // Don't pulse on initial render (block 0)
    if (blockNumber > 0) {
      api.start({
        from: { emissiveIntensity: 20 }, // Bright flash
        to: { emissiveIntensity: 0.5 },   // Fade back to resting glow
        config: { duration: 1500, easing: (t) => 1 - Math.pow(1 - t, 4) }, // Ease out
      });
    }
  }, [blockNumber, api]);


  useFrame(({ clock }, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
      // Animate shader opacity
      shaderRef.current.uniforms.u_opacity.value = opacity.get();
    }
    if (knotRef.current) {
        knotRef.current.rotation.y += delta * 0.2;
        knotRef.current.rotation.x += delta * 0.1;
    }
  });


  return (
    <a.group {...props} scale={scale}>
        {/* FIX: Removed opacity from a.group as it is not a valid prop. Opacity is now animated on child materials directly. */}
        <a.group>
            <RoundedBox args={[6, 4, 0.2]} radius={0.1}>
                 <AnimatedEdges color="#00ffff" toneMapped={false} material-transparent material-opacity={opacity} />
                <shaderMaterial
                    ref={shaderRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                />
            </RoundedBox>

            <TorusKnot ref={knotRef} args={[0.5, 0.1, 128, 16]} position={[0, 0, 0.3]}>
                <a.meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={spring.emissiveIntensity}
                    toneMapped={false}
                    transparent
                    opacity={opacity}
                />
            </TorusKnot>

            <group 
                position={[0, -2.2, 0.11]}
                onPointerOver={() => setIsButtonHovered(true)}
                onPointerOut={() => setIsButtonHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <RoundedBox
                    args={[1.5, 0.5, 0.1]}
                    radius={0.05}
                >
                    <a.meshBasicMaterial color={isButtonHovered ? '#00FFFF' : '#FFFFFF'} transparent opacity={opacity.to(o => o * (isButtonHovered ? 0.4 : 0.2))} />
                </RoundedBox>
                {/* FIX: Replaced wrapper a.group with AnimatedText and applied animated fillOpacity. */}
                <AnimatedText position={[0, 0, 0.06]} fontSize={0.2} color={isButtonHovered ? '#000000' : '#00FFFF'} anchorX="center" anchorY="middle" material-toneMapped={false} fillOpacity={opacity}>
                    Close
                </AnimatedText>
            </group>
        </a.group>
    </a.group>
  );
};

export default HarmonyPanel3D;
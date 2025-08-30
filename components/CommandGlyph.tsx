/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring } from 'react-spring';
import { a } from '@react-spring/three';
import { SystemCommand } from '../App';

interface CommandGlyphProps {
    command: SystemCommand;
    position: [number, number, number];
    onExecute: () => void;
    isExecuting: boolean;
}

const GlyphGeometry: React.FC<{ type: SystemCommand['glyph'] }> = ({ type }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        
        // Ambient animations
        switch (type) {
            case 'awaken':
                if (meshRef.current) meshRef.current.scale.setScalar(Math.sin(time * 2) * 0.1 + 0.9);
                break;
            case 'manifest':
                if (groupRef.current) groupRef.current.children.forEach((child, i) => {
                    const angle = time * 0.5 + i * Math.PI;
                    child.position.x = Math.cos(angle) * 0.7;
                    child.position.z = Math.sin(angle) * 0.7;
                });
                break;
            case 'serpent':
                if (meshRef.current) meshRef.current.rotation.y = time * 0.3;
                break;
            case 'nexus':
                if (meshRef.current) {
                    meshRef.current.rotation.x = time * 0.1;
                    meshRef.current.rotation.y = time * 0.2;
                }
                break;
            case 'hierarchy':
                 if (groupRef.current) groupRef.current.children.forEach((child, i) => {
                    child.rotation.y = time * 0.2 * (i % 2 === 0 ? 1 : -1);
                });
                break;
            case 'harmony':
                 if (meshRef.current) {
                     meshRef.current.rotation.y = time * 0.2;
                     meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.2;
                 }
                break;
        }
    });

    // Return unique geometry based on glyph type
    switch (type) {
        case 'awaken':
            return <icosahedronGeometry args={[0.6, 0]} ref={meshRef as any} />;
        case 'manifest':
            return (
                <group ref={groupRef}>
                    <mesh position={[-0.5, 0, 0]}><sphereGeometry args={[0.3, 16, 16]} /></mesh>
                    <mesh position={[0.5, 0, 0]}><sphereGeometry args={[0.3, 16, 16]} /></mesh>
                </group>
            );
        case 'serpent':
            return <torusKnotGeometry args={[0.5, 0.1, 100, 16, 2, 3]} ref={meshRef as any} />;
        case 'nexus':
            return <torusKnotGeometry args={[0.6, 0.2, 100, 16, 3, 5]} ref={meshRef as any} />;
        case 'hierarchy':
             return (
                <group ref={groupRef}>
                    <mesh position={[0, 0.4, 0]}><boxGeometry args={[1.2, 0.1, 1.2]} /></mesh>
                    <mesh position={[0, 0, 0]}><boxGeometry args={[1.0, 0.1, 1.0]} /></mesh>
                    <mesh position={[0, -0.4, 0]}><boxGeometry args={[0.8, 0.1, 0.8]} /></mesh>
                </group>
            );
        case 'harmony':
            return <torusGeometry args={[0.5, 0.2, 16, 100]} ref={meshRef as any} />;
        default:
            return <boxGeometry args={[1, 1, 1]} />;
    }
};

const CommandGlyph: React.FC<CommandGlyphProps> = ({ command, position, onExecute, isExecuting }) => {
    const [isHovered, setIsHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const { camera } = useThree();

    const { spring } = useSpring({
        spring: isHovered ? 1.2 : 1,
        config: { mass: 0.5, tension: 400, friction: 15 }
    });

    const { posY } = useSpring({
        posY: isHovered ? position[1] + 0.2 : position[1],
        config: { tension: 300, friction: 20 }
    });
    
    // Animate emissive intensity based on camera distance, hover, and a pulse.
    useFrame(({ clock }) => {
        if (groupRef.current && materialRef.current) {
            const worldPosition = new THREE.Vector3();
            groupRef.current.getWorldPosition(worldPosition);
            
            const distance = camera.position.distanceTo(worldPosition);

            // Map distance to a base intensity
            const minDistance = 5;
            const maxDistance = 15;
            const maxIntensity = 1.5;
            const minIntensity = 0.5;

            const distanceFactor = THREE.MathUtils.smoothstep(distance, maxDistance, minDistance);
            const baseIntensity = THREE.MathUtils.lerp(minIntensity, maxIntensity, distanceFactor);
            
            // Add a bonus for hover state
            const hoverBonus = 1.0;
            const targetIntensity = isHovered ? baseIntensity + hoverBonus : baseIntensity;

            // Add a subtle, continuous pulse
            const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1;
            const finalTargetIntensity = targetIntensity + pulse;

            // Smoothly interpolate the material's intensity for a fluid feel
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                finalTargetIntensity,
                0.1 // smoothing factor
            );
        }
    });

    const handleClick = () => {
        if (!isExecuting) {
            onExecute();
        }
    };
    
    return (
        <a.group
            ref={groupRef}
            position-x={position[0]}
            position-y={posY}
            position-z={position[2]}
            onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
            onPointerOut={() => setIsHovered(false)}
            onClick={handleClick}
            scale={spring}
        >
            <mesh>
                <GlyphGeometry type={command.glyph} />
                <meshStandardMaterial
                    ref={materialRef}
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.5} // Initial value
                    transparent
                    opacity={0.8}
                    wireframe
                    toneMapped={false}
                />
            </mesh>
            
            {/* Holographic text revealed on hover */}
            {isHovered && (
                <group>
                    <Text
                        position={[0, -1, 0]}
                        fontSize={0.2}
                        color="#00FFFF"
                        anchorX="center"
                        material-toneMapped={false}
                    >
                        {command.name}
                    </Text>
                    <Text
                        position={[0, -1.25, 0]}
                        fontSize={0.12}
                        color="#FFFFFF"
                        anchorX="center"
                        maxWidth={2}
                        textAlign="center"
                        material-toneMapped={false}
                    >
                        {command.description}
                    </Text>
                </group>
            )}
        </a.group>
    );
};

export default CommandGlyph;
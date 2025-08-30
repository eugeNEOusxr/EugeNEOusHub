/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Text, RoundedBox, Edges } from '@react-three/drei';
import { useSpring } from 'react-spring';
import { a } from '@react-spring/three';

interface Terminal3DProps {
    position: [number, number, number];
    output: string[];
    isMobile: boolean;
    isVisible: boolean;
}

// FIX: Create animated versions of Drei components to handle opacity spring.
const AnimatedEdges = a(Edges);
const AnimatedText = a(Text);

const Terminal3D: React.FC<Terminal3DProps> = ({ position, output, isMobile, isVisible }) => {
    const width = isMobile ? 3.5 : 5;
    const height = isMobile ? 3 : 4;
    const lineHeight = 0.1;

    const { pos, opacity } = useSpring({
        pos: isVisible
            ? [position[0], position[1], position[2]]
            : isMobile
                ? [position[0], position[1] - (height + 2), position[2]] // Slide down
                : [position[0] + (width + 2), position[1], position[2]], // Slide right
        opacity: isVisible ? 1 : 0,
        config: { mass: 1, tension: 280, friction: 40 }
    });

    // A simple parser for colored text
    const renderLine = (line: string, index: number) => {
        let color = '#00FF00'; // Default green
        if (line.includes('[Zora]:')) color = '#FFA500'; // Orange
        if (line.includes('[You]:')) color = '#00FFFF';  // Cyan
        if (line.includes('REC ●')) color = '#FF0000';   // Red
        if (line.includes('ZCHAIN_LOG')) color = '#FFFF00'; // Yellow
        return (
            <AnimatedText
                key={index}
                position={[0, -index * lineHeight, 0]}
                fontSize={0.07}
                color={color}
                anchorX="left"
                anchorY="top"
                maxWidth={width - 0.2}
                material-toneMapped={false}
                fillOpacity={opacity}
            >
                {line}
            </AnimatedText>
        );
    };

    return (
        <a.group position={pos as any}>
            {/* Frame */}
            <RoundedBox args={[width, height, 0.02]} radius={0.05} position={[0, 0, -0.01]}>
                <AnimatedEdges color="#00ffff" toneMapped={false} material-transparent material-opacity={opacity} />
                <meshBasicMaterial transparent opacity={0} />
            </RoundedBox>

            {/* Background Panel */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <a.meshBasicMaterial color="#000000" transparent opacity={opacity.to(o => o * 0.6)} />
            </mesh>
            
            {/* Text Content */}
            <group position={[-width / 2 + 0.1, height / 2 - 0.1, 0.01]}>
                <group>
                    {output.slice(-35).map(renderLine)}
                </group>
            </group>
        </a.group>
    );
};

export default Terminal3D;
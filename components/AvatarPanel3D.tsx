/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, Suspense } from 'react';
import { useTexture, Text, RoundedBox, Edges, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { interactiveButtonMaterial, panelMaterial } from './materials';

interface AvatarPanel3DProps {
    position: [number, number, number];
    avatarUrl: string;
    isAvatarLoading: boolean;
    slogan: string;
    onCustomizeClick: () => void;
    blockNumber: number;
}

const AvatarImage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    const texture = useTexture(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    return <meshBasicMaterial map={texture} toneMapped={false} />;
};

const AvatarPanel3D: React.FC<AvatarPanel3DProps> = ({ position, avatarUrl, isAvatarLoading, slogan, onCustomizeClick, blockNumber }) => {
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    
    return (
        <group position={position}>
            {/* Main Panel */}
            <RoundedBox args={[3.2, 5.2, 0.2]} radius={0.1} material={panelMaterial}>
                 <Edges color="#00ffff" toneMapped={false} />
            </RoundedBox>

            {/* Title */}
            <Text position={[0, 2.3, 0.12]} fontSize={0.25} color="#FFFFFF" anchorX="center" anchorY="middle" material-toneMapped={false}>
                User Profile
            </Text>

            {/* Avatar Container */}
            <mesh position={[0, 0.7, 0.11]}>
                <planeGeometry args={[2.8, 2.8]} />
                <Grid
                    args={[10, 10]}
                    cellSize={0.2}
                    cellColor="#00ffff"
                    sectionSize={1}
                    sectionThickness={1.5}
                    sectionColor="#00ffff"
                    fadeDistance={10}
                    fadeStrength={0.75}
                    infiniteGrid
                />
            </mesh>
            <mesh position={[0, 0.7, 0.12]}>
                <planeGeometry args={[2.75, 2.75]} />
                <Suspense fallback={<meshBasicMaterial color="#111111" />}>
                   {avatarUrl && <AvatarImage imageUrl={avatarUrl} />}
                </Suspense>
            </mesh>
            {isAvatarLoading && (
                 <Text position={[0, 0.7, 0.13]} fontSize={0.2} color="#00FFFF" anchorX="center" anchorY="middle" material-toneMapped={false}>
                    Generating...
                </Text>
            )}

            {/* Slogan */}
            <Text
                position={[0, -0.9, 0.12]}
                fontSize={0.1}
                color="#00FFFF"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.8}
                textAlign="center"
                fontStyle="italic"
                material-toneMapped={false}
            >
                {slogan}
            </Text>

            {/* Button */}
            <group position={[0, -1.5, 0.11]}>
                 <RoundedBox
                    args={[2.8, 0.6, 0.1]}
                    radius={0.05}
                    material={interactiveButtonMaterial}
                    onPointerOver={() => setIsButtonHovered(true)}
                    onPointerOut={() => setIsButtonHovered(false)}
                    onClick={onCustomizeClick}
                >
                     <meshBasicMaterial color={isButtonHovered ? '#00FFFF' : '#FFFFFF'} transparent opacity={isButtonHovered ? 0.4 : 0.2} />
                </RoundedBox>
                <Text position={[0, 0, 0.06]} fontSize={0.18} color={isButtonHovered ? '#000000' : '#00FFFF'} anchorX="center" anchorY="middle" material-toneMapped={false}>
                    {isAvatarLoading ? 'Please Wait' : 'Customize Avatar'}
                </Text>
            </group>

             {/* ZChain Status */}
            <Text position={[-0.9, -2.3, 0.12]} fontSize={0.13} color="#FFFFFF" anchorX="center" material-toneMapped={false}>
                ZChain Status
            </Text>
            <Text position={[-0.9, -2.5, 0.12]} fontSize={0.1} color="#00FF00" anchorX="center" material-toneMapped={false}>
                ONLINE
            </Text>

            {/* Block Number */}
            <Text position={[0.9, -2.3, 0.12]} fontSize={0.13} color="#FFFFFF" anchorX="center" material-toneMapped={false}>
                Block
            </Text>
            <Text position={[0.9, -2.5, 0.12]} fontSize={0.1} color="#00FFFF" anchorX="center" material-toneMapped={false}>
                #{blockNumber}
            </Text>

        </group>
    );
};

export default AvatarPanel3D;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import AvatarPanel3D from './AvatarPanel3D';
import CommandGrid3D from './CommandGrid3D';
import Terminal3D from './Terminal3D';
import VideoPlayer3D from './VideoPlayer3D';
import HarmonyPanel3D from './HarmonyPanel3D';
import { SystemCommand } from '../App';

interface SceneProps {
    avatarUrl: string;
    isAvatarLoading: boolean;
    slogan: string;
    onCustomizeClick: () => void;
    blockNumber: number;
    commands: SystemCommand[];
    onExecuteCommand: (command: SystemCommand) => void;
    isExecuting: boolean;
    terminalOutput: string[];
    isTerminalVisible: boolean;
    triggerFocus: string | null;
    onFocusComplete: () => void;
    showVideo: boolean;
    onCloseVideo: () => void;
    showHarmonyPanel: boolean;
    onCloseHarmonyPanel: () => void;
}

const Scene: React.FC<SceneProps> = (props) => {
    const { viewport } = useThree();
    const controlsRef = useRef<CameraControls>(null!);
    const shakeGroupRef = useRef<THREE.Group>(null!);
    const shakeState = useRef({ time: 0, intensity: 0, initialDuration: 1 });
    
    const isMobile = viewport.width < 8;

    // Dynamic layout based on viewport
    const avatarPosition: [number, number, number] = isMobile ? [0, 3, 0] : [-5, 0, 0];
    const commandGridPosition: [number, number, number] = isMobile ? [0, -1, 0] : [2.5, 1, 0];
    const terminalPosition: [number, number, number] = isMobile ? [0, -5.5, 0] : [7.5, 0, 0];


    const startCameraShake = (duration: number, intensity: number) => {
        shakeState.current = { time: duration, intensity, initialDuration: duration };
    };

    useEffect(() => {
        controlsRef.current?.setPosition(0, 0, 12, false);
        controlsRef.current?.setTarget(0, 0, 0, false);
    }, []);

    useEffect(() => {
        let focusTimeoutId: number;
        let shakeTimeoutId: number;

        if (props.triggerFocus && controlsRef.current) {
            let targetPosition: [number, number, number] | undefined;
            let cameraZ = 5; // Default zoom

            if (props.triggerFocus === 'terminal') {
                targetPosition = terminalPosition;
                cameraZ = isMobile ? 8 : 10;
            } else if (props.triggerFocus === 'avatar') {
                targetPosition = avatarPosition;
            } else {
                // It's a command ID, find the glyph's position
                const commandIndex = props.commands.findIndex(c => c.id === props.triggerFocus);
                if (commandIndex !== -1) {
                    const cols = isMobile ? 3 : 6;
                    const glyphSpacing = 2.5;

                    const row = Math.floor(commandIndex / cols);
                    const col = commandIndex % cols;
                    
                    const localX = col * glyphSpacing - ((cols - 1) * glyphSpacing) / 2;
                    const localY = -row * glyphSpacing;

                    targetPosition = [
                        commandGridPosition[0] + localX,
                        commandGridPosition[1] + localY,
                        commandGridPosition[2]
                    ];
                    cameraZ = 4; // Zoom in closer for glyphs
                }
            }
            
            if (targetPosition) {
                const newCameraPosition: [number, number, number] = [targetPosition[0], targetPosition[1], cameraZ];
                controlsRef.current.setLookAt(...newCameraPosition, ...targetPosition, true);
                
                const animationDuration = 1000; // ms
                focusTimeoutId = setTimeout(() => {
                    // Start shake only when focusing on a command card
                    if (props.triggerFocus && !['terminal', 'avatar'].includes(props.triggerFocus)) {
                        const shakeDuration = 300; // ms - Refined: quicker shake
                        const shakeIntensity = 0.15; // Refined: more intense shake
                        startCameraShake(shakeDuration / 1000, shakeIntensity);
                        
                        shakeTimeoutId = setTimeout(() => {
                            props.onFocusComplete();
                        }, shakeDuration);
                    } else {
                        // No shake for other targets
                        props.onFocusComplete();
                    }
                }, animationDuration);
            } else {
               props.onFocusComplete();
            }
        }
        return () => {
            clearTimeout(focusTimeoutId);
            clearTimeout(shakeTimeoutId);
        };
    }, [props.triggerFocus, props, commandGridPosition, avatarPosition, terminalPosition, isMobile]);

    useFrame(({ mouse }, delta) => {
        if (shakeState.current.time > 0) {
            if (shakeGroupRef.current) {
                const { time, intensity, initialDuration } = shakeState.current;
                const decay = time / initialDuration;
                const group = shakeGroupRef.current;
                
                group.position.x = (Math.random() - 0.5) * intensity * decay;
                group.position.y = (Math.random() - 0.5) * intensity * decay;
                
                shakeState.current.time -= delta;
            }
        } else if (shakeGroupRef.current) {
            // Smoothly return to center when shake is over
            shakeGroupRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }
    });

    return (
        <>
            <CameraControls ref={controlsRef} makeDefault />
            
            <EffectComposer>
                <Bloom intensity={0.5} kernelSize={3} luminanceThreshold={0.5} luminanceSmoothing={0.4} />
            </EffectComposer>

            <group ref={shakeGroupRef}>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Stars radius={200} depth={50} count={3000} factor={6} saturation={0} fade speed={0.5} />
                <hemisphereLight intensity={0.5} groundColor="black" />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <AvatarPanel3D
                    position={avatarPosition}
                    avatarUrl={props.avatarUrl}
                    isAvatarLoading={props.isAvatarLoading}
                    slogan={props.slogan}
                    onCustomizeClick={props.onCustomizeClick}
                    blockNumber={props.blockNumber}
                />
                
                <CommandGrid3D
                    position={commandGridPosition}
                    commands={props.commands}
                    onExecuteCommand={props.onExecuteCommand}
                    isExecuting={props.isExecuting}
                    isMobile={isMobile}
                />
                
                <Terminal3D 
                    position={terminalPosition}
                    output={props.terminalOutput}
                    isMobile={isMobile}
                    isVisible={props.isTerminalVisible}
                />
            </group>
            
            {props.showVideo && <VideoPlayer3D videoId="zO2w_2_S_L4" onClose={props.onCloseVideo} />}
            {props.showHarmonyPanel && <HarmonyPanel3D position={[0, 0, 1]} onClose={props.onCloseHarmonyPanel} blockNumber={props.blockNumber} />}
        </>
    );
};

export default Scene;
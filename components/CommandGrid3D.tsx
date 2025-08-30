/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Text } from '@react-three/drei';
import { SystemCommand } from '../App';
import CommandGlyph from './CommandGlyph';

interface CommandGrid3DProps {
    position: [number, number, number];
    commands: SystemCommand[];
    onExecuteCommand: (command: SystemCommand) => void;
    isExecuting: boolean;
    isMobile: boolean;
}

const CommandGrid3D: React.FC<CommandGrid3DProps> = ({ position, commands, onExecuteCommand, isExecuting, isMobile }) => {
    const cols = isMobile ? 3 : 6;
    const glyphSpacing = 2.5;

    return (
        <group position={position}>
            <Text position={[0, 1.5, 0]} fontSize={0.3} color="#FFFFFF" anchorX="center" material-toneMapped={false}>
                Command Altar
            </Text>
            {commands.map((command, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                const x = col * glyphSpacing - ((cols - 1) * glyphSpacing) / 2;
                const y = -row * glyphSpacing;

                return (
                    <CommandGlyph
                        key={command.id}
                        command={command}
                        position={[x, y, 0]}
                        onExecute={() => onExecuteCommand(command)}
                        isExecuting={isExecuting}
                    />
                );
            })}
        </group>
    );
};

export default CommandGrid3D;
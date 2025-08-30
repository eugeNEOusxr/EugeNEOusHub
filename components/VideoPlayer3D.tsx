/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Html } from '@react-three/drei';
import { useSpring } from 'react-spring';
import { a } from '@react-spring/three';

interface VideoPlayer3DProps {
  videoId: string;
  onClose: () => void;
}

const VideoPlayer3D: React.FC<VideoPlayer3DProps> = ({ videoId, onClose }) => {
    const { scale } = useSpring({ from: { scale: 0 }, to: { scale: 1 } });
  
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&vq=hd2160`;

    return (
        <a.group scale={scale}>
            <Html
                transform
                occlude
                position={[0, 0, 2]}
                scale={[0.7, 0.7, 0.7]}
                style={{
                    width: '1280px',
                    height: '720px',
                    backgroundColor: 'black',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px solid #00ffff',
                    boxShadow: '0 0 40px #00ffff'
                }}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid white',
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: '1'
                        }}
                    >
                        &times;
                    </button>
                </div>
            </Html>
        </a.group>
    );
};

export default VideoPlayer3D;
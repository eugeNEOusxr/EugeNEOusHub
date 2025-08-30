/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as THREE from 'three';

// Material for the main panels
export const panelMaterial = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    metalness: 0.2,
    roughness: 0.5,
});

// Material for buttons and interactive elements
export const interactiveButtonMaterial = new THREE.MeshBasicMaterial({
    color: '#00FFFF',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
});

// Material for glowing text
export const glowingTextMaterial = new THREE.MeshBasicMaterial({
    color: '#00FFFF',
    toneMapped: false // This makes the color emissive-like
});
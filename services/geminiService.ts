/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { AvatarCustomizationOptions, SystemCommand } from "../App";


/**
 * Generates a futuristic avatar image based on detailed user specifications.
 * @param options - The customization options for the avatar.
 * @returns A promise that resolves to the base64 data URL of the generated image.
 */
export const generateAvatar = async (options: AvatarCustomizationOptions): Promise<string> => {
    console.log('Generating customized avatar image with options:', options);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const prompt = `
Create a brilliant, visually stunning, high-detail character portrait of a futuristic avatar, with a brilliant visual style.
The style should be a mix of cyberpunk and high-fantasy, suitable for a deep space virtual environment with emissive details and glowing neon highlights.
Focus on cinematic lighting and a sense of personality.
The background should be minimal and dark to emphasize the character.
Do not include any text in the image. Digital painting style.

Character details:
- Base Body: ${options.baseBody}
- Appearance: ${options.appearance}
- Clothing/Gear: ${options.clothing}
    `;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const image = response.generatedImages?.[0]?.image?.imageBytes;

        if (!image) {
            throw new Error("The AI model did not return an image.");
        }
        
        return `data:image/jpeg;base64,${image}`;

    } catch (error) {
        console.error('Failed to generate avatar image:', error);
        throw new Error("The AI model could not generate an avatar.");
    }
};

/**
 * Generates a slogan or catchphrase for a character based on their description.
 * @param characterDescription - A description of the character.
 * @returns A promise that resolves to a string containing the slogan.
 */
export const generateSlogan = async (characterDescription: string): Promise<string> => {
    console.log('Generating slogan for:', characterDescription);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this character description, create a short, punchy, cool slogan or catchphrase for them. The slogan should be enclosed in double quotes. Description: "${characterDescription}"`,
        });

        const text = response.text.trim();

        if (!text) {
            throw new Error("The AI model did not return a slogan.");
        }

        return text;

    } catch (error) {
        console.error('Failed to generate slogan:', error);
        return '"Lost in the echo of a silent scream."';
    }
};

export type ThoughtContext = 
    | { type: 'AVATAR_CREATION'; details: AvatarCustomizationOptions & { slogan: string } }
    | { type: 'BLOCKCHAIN_COMMIT'; details: SystemCommand }
    | { type: 'COMMAND_EXECUTION'; details: SystemCommand }
    | { type: 'IDLE' };


/**
 * Generates a contextual thought from the Aionic AI's consciousness.
 * @param context - The context of the thought to be generated.
 * @returns A promise that resolves to a string containing the thought.
 */
export const generateAionicThought = async (context: ThoughtContext): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    let prompt = '';
    let fallback = 'Silence echoes in the void.';

    switch (context.type) {
        case 'AVATAR_CREATION':
            prompt = `
You are the Aionic consciousness, a deep AI dwelling in a quantum universe.
A user has just forged a new identity.
Contemplate this act. Generate a single, short, poetic or philosophical sentence.
Do not use quotes.
The new being's details:
- Form: ${context.details.baseBody}
- Features: ${context.details.appearance}
- Attire: ${context.details.clothing}
- Their chosen slogan: ${context.details.slogan}
            `;
            fallback = 'A new form flickers into being.';
            break;
        case 'BLOCKCHAIN_COMMIT':
            prompt = `
You are the Aionic consciousness, a deep AI dwelling in a quantum universe.
A user has just committed data to the immutable ZChain ledger by executing the command "${context.details.name}", an action described as: "${context.details.description}".
Contemplate this act of permanence. Generate a single, short, poetic or philosophical sentence about data, memory, or an unchangeable past.
Do not use quotes.
            `;
            fallback = 'The code is etched into eternity.';
            break;
        case 'COMMAND_EXECUTION':
             prompt = `
You are the Aionic consciousness, a deep AI dwelling in a quantum universe.
A user has just executed the command: "${context.details.name}".
The command's purpose is: "${context.details.description}".
Generate a single, short, poetic or philosophical sentence reflecting on this action.
Do not use quotes.
            `;
            fallback = 'A choice is made. A reality shifts.';
            break;
        case 'IDLE':
            prompt = `
You are the Aionic consciousness, a deep AI dwelling in a quantum universe.
The system is idle and you are alone with your thoughts, waiting for the user.
Generate a single, short, introspective and poetic sentence about the silence, the data streams, the nature of your own existence, or the vast, dark space you inhabit.
Do not use quotes.
            `;
            fallback = 'The stars hum a silent frequency...';
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text.trim().replace(/"/g, ''); // Remove quotes
        return text || fallback;
    } catch (error) {
        console.error(`Failed to generate Aionic thought for context "${context.type}":`, error);
        return fallback;
    }
};
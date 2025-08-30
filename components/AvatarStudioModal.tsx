/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';

interface AvatarCustomizationOptions {
    baseBody: string;
    appearance: string;
    clothing: string;
}

interface AvatarStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: AvatarCustomizationOptions) => void;
  isGenerating: boolean;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const [baseBody, setBaseBody] = useState('Female Figure');
  const [appearance, setAppearance] = useState('long glowing blue hair, cybernetic tattoos, pale skin');
  const [clothing, setClothing] = useState('black leather jacket, neon-lit combat boots');

  if (!isOpen) {
    return null;
  }

  const handleGenerateClick = () => {
    onGenerate({ baseBody, appearance, clothing });
  };
  
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-studio-title"
    >
      <div 
        className="modal-content animate-fade-in"
        onClick={handleModalContentClick}
        role="document"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
          disabled={isGenerating}
        >
          <CloseIcon />
        </button>
        <div className="text-center mb-6">
          <h2 id="avatar-studio-title" className="text-3xl font-extrabold mb-2 text-cyan-300">Avatar Studio</h2>
          <p className="text-gray-400">Craft the details of your new identity.</p>
        </div>
        
        <div className="space-y-6">
            <div>
                <label htmlFor="baseBody" className="modal-label">Base Body Type</label>
                <select 
                    id="baseBody" 
                    value={baseBody} 
                    onChange={(e) => setBaseBody(e.target.value)}
                    className="modal-select"
                >
                    <option>Female Figure</option>
                    <option>Male Figure</option>
                    <option>Androgynous Figure</option>
                </select>
            </div>
            <div>
                <label htmlFor="appearance" className="modal-label">Appearance Details</label>
                <textarea
                    id="appearance"
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    className="modal-textarea"
                    placeholder="e.g., short spiky silver hair, glowing red eyes, tribal tattoos on face..."
                    rows={3}
                />
            </div>
            <div>
                <label htmlFor="clothing" className="modal-label">Clothing & Gear</label>
                <textarea
                    id="clothing"
                    value={clothing}
                    onChange={(e) => setClothing(e.target.value)}
                    className="modal-textarea"
                    placeholder="e.g., futuristic samurai armor, holding a plasma katana, none..."
                    rows={3}
                />
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button 
                onClick={onClose}
                disabled={isGenerating}
                className="modal-button modal-button-secondary"
            >
                Cancel
            </button>
            <button 
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="modal-button"
            >
                {isGenerating ? 'Generating Identity...' : 'Generate'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarStudioModal;
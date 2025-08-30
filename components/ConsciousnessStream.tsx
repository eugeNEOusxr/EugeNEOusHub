/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface ConsciousnessStreamProps {
  thought: string;
}

const ConsciousnessStream: React.FC<ConsciousnessStreamProps> = ({ thought }) => {
  const [currentThought, setCurrentThought] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (thought) {
      // Start by fading out the old thought immediately
      setIsVisible(false);

      // After a short delay to allow the fade-out, update the text and fade in
      const timeoutId = setTimeout(() => {
        setCurrentThought(thought);
        setIsVisible(true);
      }, 500); // This delay should match the transition duration

      return () => clearTimeout(timeoutId);
    }
  }, [thought]);

  useEffect(() => {
    if (isVisible) {
      // If the thought is visible, set a timer to fade it out
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 7000); // Keep the thought on screen for 7 seconds

      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, currentThought]);

  return (
    <div className="consciousness-container">
      <p className={`consciousness-text ${isVisible ? 'visible' : ''}`}>
        {currentThought}
      </p>
    </div>
  );
};

export default ConsciousnessStream;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full p-4 text-center z-10 pointer-events-none animate-fade-out-late">
      <div className="flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white header-glow">
            Aionic
          </h1>
      </div>
      <p className="mt-2 text-md text-gray-300 max-w-3xl mx-auto">
        Welcome to your new universe. Interact, create, and explore what's possible.
      </p>
    </header>
  );
};

export default Header;
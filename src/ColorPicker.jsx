// src/ColorPicker.jsx
import React from 'react';
import jaune from './assets/colors/jaune.png';
import mauve from './assets/colors/mauve.png';
import vert from './assets/colors/vert.png';
import rouge from './assets/colors/rouge.png';
import bleu from './assets/colors/bleu.png';
import gris from './assets/colors/gris.png';

const colors = [
  { name: 'jaune', image: jaune },
  { name: 'mauve', image: mauve },
  { name: 'vert', image: vert },
  { name: 'rouge', image: rouge },
  { name: 'bleu', image: bleu },
  { name: 'gris', image: gris }
];

export default function ColorPicker({ selectedColor, onChange }) {
  return (
    <div className="flex space-x-2 items-center">
      {colors.map(({ name, image }) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          className={`border-2 rounded p-1 ${selectedColor === name ? 'border-blue-500' : 'border-transparent'}`}
        >
          <img src={image} alt={name} className="w-8 h-8" />
        </button>
      ))}
    </div>
  );
}

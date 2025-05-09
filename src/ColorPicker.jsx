import React from 'react';
import jaune from './assets/colors/jaune.png';
import mauve from './assets/colors/mauve.png';
import vert from './assets/colors/vert.png';
import rouge from './assets/colors/rouge.png';
import bleu from './assets/colors/bleu.png';
import gris from './assets/colors/gris.png';

const colors = [
  { name: 'jaune', img: jaune },
  { name: 'mauve', img: mauve },
  { name: 'vert', img: vert },
  { name: 'rouge', img: rouge },
  { name: 'bleu', img: bleu },
  { name: 'gris', img: gris },
];

export default function ColorPicker({ selectedColor, onChange }) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onChange(color.name)}
          className={`p-1 border-2 rounded ${selectedColor === color.name ? 'border-blue-500' : 'border-transparent'}`}
        >
          <img src={color.img} alt={color.name} className="w-8 h-8 object-contain" />
        </button>
      ))}
    </div>
  );
}
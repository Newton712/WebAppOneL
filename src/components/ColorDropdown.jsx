import Select from 'react-select';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorImages = {
  jaune, mauve, vert, rouge, bleu, gris,
};

const options = Object.keys(colorImages).map((color) => ({
  value: color,
  label: color.charAt(0).toUpperCase() + color.slice(1),
  icon: colorImages[color],
}));

const customSingleValue = ({ data }) => (
  <div className="flex items-center">
    <img src={data.icon} alt={data.label} className="w-5 h-5 mr-2" />
    {data.label}
  </div>
);

const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
      <img src={data.icon} alt={data.label} className="w-5 h-5 mr-2" />
      {data.label}
    </div>
  );
};

export default function ColorDropdown({ selectedColor, onChange }) {
  const selectedOption = options.find(opt => opt.value === selectedColor);

  return (
    <div className="w-40">
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected.value)}
        getOptionLabel={(e) => (
          <div className="flex items-center">
            <img src={e.icon} alt={e.label} className="w-5 h-5 mr-2" />
            {e.label}
          </div>
        )}
        components={{ Option: customOption, SingleValue: customSingleValue }}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            borderColor: '#d1d5db',
            minHeight: '2.5rem',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100,
          }),
        }}
      />
    </div>
  );
}
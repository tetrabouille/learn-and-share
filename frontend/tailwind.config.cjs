function deriveColor(variable) {
  const colors = {};
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const getOpacity =
    (color) =>
    ({ opacityValue }) => {
      if (opacityValue === undefined) return `rgb(${color})`;
      return `rgb(${color} / ${opacityValue})`;
    };
  shades.forEach((shade) => {
    const color = `var(${variable}-${shade})`;
    colors[shade] = getOpacity(color);
  });
  return colors;
}

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    colors: {
      creme: deriveColor('--color-creme'),
      blue: deriveColor('--color-blue'),
      yellow: deriveColor('--color-yellow'),
      red: deriveColor('--color-red'),
      warm: deriveColor('--color-warm'),
      green: deriveColor('--color-green'),
      brown: deriveColor('--color-brown'),
      cold: deriveColor('--color-cold'),
      white: '#fff',
      black: '#000',
    },
  },

  plugins: [],
};

module.exports = config;

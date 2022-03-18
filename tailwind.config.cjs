module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        background: 'url(/svg/background.svg)'
      },
      fontFamily: {
        rubik: 'Rubik'
      },

      colors: {
        primary: {
          50: '#FF68DD',
          100: '#FF4FC4',
          200: '#FF35AA',
          300: '#F11C91',
          400: '#ED017A',
          500: '#BE005E',
          600: '#A40044',
          700: '#8B002B',
          800: '#710011',
          900: '#580000'
        },
        secondary: {
          50: '#D666FF',
          100: '#BD4DF0',
          200: '#A333D6',
          300: '#8A1ABD',
          400: '#7000A3',
          500: '#57008A',
          600: '#3D0070',
          700: '#240057',
          800: '#0A003D',
          900: '#000024'
        },
        tertiary: {
          50: '#BBFFFF',
          100: '#A2FFFF',
          200: '#88FFFF',
          300: '#6FFFFF',
          400: '#55FFFF',
          500: '#3CE6E6',
          600: '#22CCCC',
          700: '#09B3B3',
          800: '#009999',
          900: '#008080'
        },
        editor: {
          bg: '#151130',
          sidebar: '#120b27',
          textIcons: '#393969',
          active: '#A181FA',
          scrollBar: '#40346E',
          tabBar: '#120b27',
          tabBarAlt: '#151130',
          tab: '#150F2E',
          header: '#0C0E14',
          syntax: {
            blue: '#00abfb',
            cyan: '#00e7d5',
            yellow: '#ffd538',
            yellowDark: '#ffb458',
            orange: '#ff6c3c',
            red: '#ff3e8b',
            pink: '#da6fd2',
            green: '#3EDE7F'
          }
        },
        background: '#00001E',
        purpleop: 'rgba(36, 0, 87, 0.6)',
        pinkop: 'rgba(237, 1, 122, .6)'
      }
    }
  },
  plugins: []
};

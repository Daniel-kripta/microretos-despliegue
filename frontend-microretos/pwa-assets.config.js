import { defineConfig } from '@vite-pwa/assets-generator/config'

// Iconos de la app instalable (favicon, Android, iOS) a partir de pwa/icono-dualab.png:
// el logo de src/assets/favicon_color.png sin márgenes transparentes, en cuadrado.
// Se regeneran con `npm run iconos` (escribe en pwa/ y los copia a public/).
//  - transparent: favicon y manifest, el logo casi a sangre sobre transparente.
//  - maskable: Android recorta el icono en círculo o squircle → logo al ~70 % sobre azul noche
//    para que no se corten las puntas.
//  - apple: iOS pinta en negro lo transparente → fondo azul noche.
// Azul noche (#17283E, --color-azul-noche): color de estructura de la marca (TopBar, SidePanel)
// y theme_color del manifest.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
      padding: 0.05,
    },
    maskable: {
      sizes: [512],
      padding: 0.3,
      resizeOptions: { background: '#17283E' },
    },
    apple: {
      sizes: [180],
      padding: 0.2,
      resizeOptions: { background: '#17283E' },
    },
  },
  images: ['pwa/icono-dualab.png'],
})

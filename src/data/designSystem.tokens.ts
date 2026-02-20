import type { ColorToken, TypographyToken } from './designSystem.types'

export const colorTokens: ColorToken[] = [
  { name: 'Main Purple', hex: '#635FC7', rgb: '99, 95, 199', hsl: '242°, 48%, 58%' },
  { name: 'Main Purple (Hover)', hex: '#A8A4FF', rgb: '168, 164, 255', hsl: '243°, 100%, 82%' },
  { name: 'Black', hex: '#000112', rgb: '0, 1, 18', hsl: '237°, 100%, 4%' },
  { name: 'Very Dark Grey (Dark BG)', hex: '#20212C', rgb: '32, 33, 44', hsl: '235°, 16%, 15%' },
  { name: 'Dark Grey', hex: '#2B2C37', rgb: '43, 44, 55', hsl: '235°, 12%, 19%' },
  { name: 'Lines (Dark)', hex: '#3E3F4E', rgb: '62, 63, 78', hsl: '236°, 11%, 27%' },
  { name: 'Medium Grey', hex: '#828FA3', rgb: '130, 143, 163', hsl: '216°, 15%, 57%' },
  { name: 'Lines (Light)', hex: '#E4EBFA', rgb: '228, 235, 250', hsl: '221°, 69%, 94%', swatchTextColor: 'dark' },
  { name: 'Light Grey (Light BG)', hex: '#F4F7FD', rgb: '244, 247, 253', hsl: '220°, 69%, 97%', swatchTextColor: 'dark' },
  { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0°, 0%, 100%', swatchTextColor: 'dark' },
  { name: 'Red', hex: '#EA5555', rgb: '234, 85, 85', hsl: '0°, 76%, 63%' },
  { name: 'Red (Hover)', hex: '#FF9898', rgb: '255, 152, 152', hsl: '0°, 100%, 80%' },
]

export const typographyTokens: TypographyToken[] = [
  { label: 'Plus Jakarta Sans Bold 24px 100% Line', sample: 'Heading (XL)', className: 'headingXl' },
  { label: 'Plus Jakarta Sans Bold 18px 100% Line', sample: 'Heading (L)', className: 'headingL' },
  { label: 'Plus Jakarta Sans Bold 15px 100% Line', sample: 'Heading (M)', className: 'headingM' },
  { label: 'Plus Jakarta Sans Bold 12px 100% Line 2.4px Letter Spacing', sample: 'Heading (S)', className: 'headingS' },
  {
    label: 'Plus Jakarta Sans Medium 13px 23px Line',
    sample:
      'Body (L) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit. Pellentesque aliquet lectus tortor, vitae sodales odio, eget blandit nunc risus id nunc. Sed pulvinar, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam nunc. Pellentesque suscipit, egestas nec, est aliquam volutpat augue, eget posuere sapien arcu vehicula nunc. In ultrices libero eu magna.',
    className: 'bodyL',
  },
  {
    label: 'Plus Jakarta Sans Bold 12px 100% Line',
    sample:
      'Body (M) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit. Pellentesque aliquet lectus tortor, vitae sodales odio, eget blandit nunc risus id nunc. Sed pulvinar, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam nunc. Pellentesque suscipit, egestas nec, est aliquam volutpat augue, eget posuere sapien arcu vehicula nunc. In ultrices libero eu magna.',
    className: 'bodyM',
  },
]

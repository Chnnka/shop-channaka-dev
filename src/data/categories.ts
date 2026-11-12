import type { CategoryDefinition } from '../types/artwork';

const framing = {
  key: 'framing',
  label: 'Framing',
  type: 'text' as const,
  placeholder: 'e.g. Unframed, ships flat in archival sleeve'
};

export const categories: CategoryDefinition[] = [
{
  id: 'pencil-drawing',
  label: 'Pencil Drawings',
  singular: 'Pencil Drawing',
  description: 'Graphite studies built slowly through layered hatching and soft shading.',
  coverImage: "/905241ee-feb6-4971-ad0b-15f3146f4431.jpg",

  dimensions: 'required',
  weight: 'hidden',
  mediumLabel: 'Medium',
  fields: [
  { key: 'surface', label: 'Paper / surface', type: 'text', placeholder: 'e.g. Fabriano 200gsm drawing paper' },
  framing]

},
{
  id: 'canvas-painting',
  label: 'Canvas Paintings',
  singular: 'Canvas Painting',
  description: 'Oil and acrylic works on stretched canvas, ready to hang.',
  coverImage: "/sigiriya_01.jpg",

  dimensions: 'required',
  weight: 'optional',
  mediumLabel: 'Medium',
  fields: [
  { key: 'canvasType', label: 'Canvas type', type: 'text', placeholder: 'e.g. Cotton canvas on pine stretcher' },
  framing]

},
{
  id: 'mixed-media-painting',
  label: 'Mixed Media Paintings',
  singular: 'Mixed Media Painting',
  description: 'Layered, tactile surfaces combining paint, paper, paste and leaf.',
  coverImage: "/pp_01.png",

  dimensions: 'required',
  weight: 'optional',
  mediumLabel: 'Materials',
  fields: [
  { key: 'techniques', label: 'Materials & techniques', type: 'textarea', placeholder: 'Describe layering, collage, textures…' },
  framing]

},
{
  id: 'mixed-media-drawing',
  label: 'Mixed Media Drawings',
  singular: 'Mixed Media Drawing',
  description: 'Ink, charcoal, tea washes and chalk on toned papers.',
  coverImage: "/1000558209.jpeg",

  dimensions: 'required',
  weight: 'hidden',
  mediumLabel: 'Materials',
  fields: [
  { key: 'techniques', label: 'Materials & techniques', type: 'textarea', placeholder: 'e.g. Ink line, tea wash, charcoal' },
  { key: 'surface', label: 'Surface type', type: 'text', placeholder: 'e.g. Toned kraft paper 300gsm' }]

},
{
  id: 'pebble-painting',
  label: 'River Rock Paintings',
  singular: 'River Rock Painting',
  description: 'Small hand-painted river stones — tiny, tactile, one of a kind.',
  coverImage: "/IMG_7749f.jpg",

  dimensions: 'optional',
  weight: 'required',
  mediumLabel: 'Paint',
  fields: [
  { key: 'stoneType', label: 'Stone type', type: 'text', placeholder: 'e.g. Smooth river basalt' },
  { key: 'coating', label: 'Protective coating', type: 'text', placeholder: 'e.g. Matte UV-resistant varnish' }]

},
{
  id: 'wall-painting',
  label: 'Wall Paintings',
  singular: 'Wall Painting',
  description: 'Murals painted on site, or large portable wall panels.',
  coverImage: "/036__mandala_second_WEB.jpg",

  dimensions: 'required',
  weight: 'hidden',
  mediumLabel: 'Medium',
  fields: [
  { key: 'surface', label: 'Surface / wall type', type: 'text', placeholder: 'e.g. Primed interior plaster' },
  {
    key: 'installation',
    label: 'Installation',
    type: 'select',
    options: ['Painted directly on wall', 'Portable panel'],
    helpText: 'Site-specific murals are shown as commissioned work.'
  }]

},
{
  id: 'paper-painting',
  label: 'Paper Paintings',
  singular: 'Paper Painting',
  description: 'Watercolour and gouache on paper, light and luminous.',
  coverImage: "/FB_IMG_1489405940590.jpg",

  dimensions: 'required',
  weight: 'hidden',
  mediumLabel: 'Medium',
  fields: [
  { key: 'paperType', label: 'Paper type', type: 'text', placeholder: 'e.g. Arches cold-press 300gsm' },
  framing]

}];
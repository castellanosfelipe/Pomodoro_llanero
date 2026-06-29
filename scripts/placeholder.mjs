/**
 * Constructor de placeholders SVG para la fauna. Compartido por
 * `gen-placeholders.mjs` (genera todos) y `sync-fauna.mjs` (sólo los que faltan).
 */

const PALETTE = {
  mamifero: ["#3f7d4f", "#1b2a4a"],
  ave: ["#e07a3f", "#1b2a4a"],
  reptil: ["#2f7a8c", "#13202e"],
  default: ["#6b4f7d", "#1b2a4a"],
};

const ICON = {
  ave: '<path d="M250 470 C320 430 360 360 430 360 C500 360 540 430 610 470" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.85"/><circle cx="430" cy="345" r="14" fill="#ffffff" opacity="0.85"/>',
  mamifero:
    '<rect x="330" y="380" width="200" height="90" rx="30" fill="#ffffff" opacity="0.85"/><rect x="350" y="460" width="20" height="60" fill="#ffffff" opacity="0.85"/><rect x="490" y="460" width="20" height="60" fill="#ffffff" opacity="0.85"/><circle cx="540" cy="370" r="26" fill="#ffffff" opacity="0.85"/>',
  reptil:
    '<path d="M280 440 q40 -40 80 0 q40 40 80 0 q40 -40 80 0 q40 40 80 0" stroke="#ffffff" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.85"/>',
  default: '<circle cx="430" cy="420" r="70" fill="#ffffff" opacity="0.85"/>',
};

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

export function svgFor(animal) {
  const [c1, c2] = PALETTE[animal.category] ?? PALETTE.default;
  const icon = ICON[animal.category] ?? ICON.default;
  const name = escapeXml(animal.commonName.es);
  const sci = escapeXml(animal.scientificName);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 600" width="860" height="600" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="860" height="600" fill="url(#bg)"/>
  ${icon}
  <text x="430" y="120" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="18" letter-spacing="3" fill="#ffffff" opacity="0.7">FAUNA DEL LLANO · PLACEHOLDER</text>
  <text x="430" y="540" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${name}</text>
  <text x="430" y="578" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="22" font-style="italic" fill="#ffffff" opacity="0.85">${sci}</text>
</svg>
`;
}

/**
 * Constructor de placeholders SVG para la fauna. Compartido por
 * `gen-placeholders.mjs` (genera todos) y `sync-fauna.mjs` (sólo los que faltan).
 *
 * Cada categoría usa una **silueta de un animal/elemento llanero** (chigüiro,
 * corocora en vuelo, caimán, pez, caballo, palma de moriche).
 */

const PALETTE = {
  mamifero: ["#3f7d4f", "#1b2a4a"],
  ave: ["#e07a3f", "#1b2a4a"],
  reptil: ["#2f7a8c", "#13202e"],
  pez: ["#2f7a8c", "#102530"],
  paisaje: ["#e07a3f", "#1b2a4a"],
  cultura: ["#3f7d4f", "#1b2a4a"],
  default: ["#6b4f7d", "#1b2a4a"],
};

// Siluetas centradas en el lienzo de 860×600 (ver `svgFor`).
const ICON = {
  // Chigüiro (mirando a la izquierda): cuerpo, cabeza, hocico, orejas, patas.
  mamifero: `<g fill="#ffffff" opacity="0.9">
    <ellipse cx="470" cy="330" rx="150" ry="82"/>
    <ellipse cx="320" cy="315" rx="62" ry="55"/>
    <ellipse cx="262" cy="332" rx="27" ry="24"/>
    <circle cx="298" cy="255" r="17"/>
    <circle cx="338" cy="253" r="17"/>
    <rect x="360" y="398" width="30" height="72" rx="12"/>
    <rect x="430" y="402" width="30" height="68" rx="12"/>
    <rect x="560" y="398" width="30" height="72" rx="12"/>
  </g>`,
  // Corocora en vuelo: alas, cuerpo, cabeza y pico largo curvo.
  ave: `<g fill="#ffffff" opacity="0.9">
    <path d="M120 350 C240 288 360 300 432 348 C504 300 624 288 744 350 C624 330 512 346 432 374 C352 346 240 330 120 350 Z"/>
    <ellipse cx="432" cy="360" rx="34" ry="16"/>
    <circle cx="466" cy="350" r="13"/>
  </g>
  <path d="M476 352 q66 0 92 40" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity="0.9"/>`,
  // Caimán de perfil: cuerpo alargado, hocico, cola, ojo y cuatro patas.
  reptil: `<g fill="#ffffff" opacity="0.9">
    <path d="M110 352 Q150 344 210 346 Q310 332 392 336 Q486 332 566 342 Q660 350 726 330 L742 340 Q664 362 580 362 Q486 368 392 364 Q310 368 210 362 Q150 362 110 356 Z"/>
    <circle cx="220" cy="332" r="11"/>
    <rect x="250" y="360" width="20" height="44" rx="7"/>
    <rect x="330" y="362" width="20" height="44" rx="7"/>
    <rect x="470" y="362" width="20" height="44" rx="7"/>
    <rect x="560" y="360" width="20" height="44" rx="7"/>
  </g>`,
  // Pez (caribe) hacia la derecha, con aleta caudal y ojo.
  pez: `<g fill="#ffffff" opacity="0.9">
    <path d="M310 332 Q440 274 566 332 Q606 360 566 388 Q440 446 310 388 Q286 360 310 332 Z"/>
    <path d="M312 360 L236 322 L256 360 L236 398 Z"/>
    <circle cx="524" cy="346" r="11" fill="#13202e"/>
  </g>`,
  // Caballo llanero de perfil.
  cultura: `<g fill="#ffffff" opacity="0.9">
    <ellipse cx="448" cy="348" rx="132" ry="60"/>
    <path d="M330 332 Q292 248 312 214 L350 212 Q352 268 392 318 Z"/>
    <path d="M312 216 Q280 210 266 236 Q262 256 294 256 L330 246 Z"/>
    <path d="M306 206 l6 -24 l13 19 z"/>
    <rect x="356" y="398" width="22" height="84" rx="8"/>
    <rect x="404" y="402" width="22" height="80" rx="8"/>
    <rect x="486" y="398" width="22" height="84" rx="8"/>
    <rect x="528" y="402" width="22" height="80" rx="8"/>
    <path d="M576 316 Q620 356 600 442 Q588 398 562 380 Z"/>
  </g>`,
  // Palma de moriche (paisaje).
  paisaje: `<g fill="#ffffff" opacity="0.9">
    <rect x="424" y="318" width="14" height="160" rx="5"/>
    <path d="M431 320 Q356 300 296 332 Q368 304 431 332 Z"/>
    <path d="M431 320 Q506 300 566 332 Q494 304 431 332 Z"/>
    <path d="M431 318 Q398 246 346 226 Q408 268 431 332 Z"/>
    <path d="M431 318 Q464 246 516 226 Q454 268 431 332 Z"/>
    <path d="M431 314 Q431 238 431 214 Q442 270 431 332 Z"/>
  </g>`,
};
ICON.default = ICON.mamifero;

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

export function svgFor(animal) {
  const [c1, c2] = PALETTE[animal.category] ?? PALETTE.default;
  const icon = ICON[animal.category] ?? ICON.default;
  const name = escapeXml(animal.commonName.es);
  const sci = escapeXml(animal.scientificName ?? "");
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

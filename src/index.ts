/**
 * fn-ui-avatars
 * Automatically generate consistent, colorful avatars using UI-Avatars API.
 * Colors are deterministic — the same name always produces the same color.
 */

export interface AvatarOptions {
  size?: number;
  fontSize?: number;
  length?: number;
  rounded?: boolean;
  color?: string; // Hex color without #
  palette?: string[]; // Optional array of hex colors to choose from
  format?: 'svg' | 'png';
  baseUrl?: string;
}

const DEFAULT_OPTIONS: Required<AvatarOptions> = {
  size: 192,
  fontSize: 0.33,
  length: 2,
  rounded: true,
  color: 'fff',
  palette: [],
  format: 'svg',
  baseUrl: 'https://ui-avatars.com/api/',
};

/**
 * Generates a numeric hash from a string.
 */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * Converts an integer to a 6-character hex color string (without #).
 */
export function intToRGB(i: number): string {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '000000'.substring(0, 6 - c.length) + c;
}

/**
 * Calculates relative YIQ luminance to decide if text should be dark or light.
 * Supports 3 or 6 character hex colors.
 */
function isLightColor(hex: string): boolean {
  let cleanHex = hex;

  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return false; // Default to dark if invalid color
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

/**
 * Generates a UI-Avatars URL for a given name.
 */
export function getAvatarUrl(name: string, options: AvatarOptions = {}): string {
  if (!name || typeof name !== 'string') {
    throw new Error('fn-ui-avatars: "name" must be a non-empty string.');
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const encoded = name.trim().replace(/\s+/g, '+');

  // Determine background color

  // Validate palette colors and filter out invalid hex codes
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  const validPalette = opts.palette ? opts.palette.filter(color => hexRegex.test(color)) : [];

  let background: string;
  if (validPalette.length > 0) {
    const index = Math.abs(hashCode(encoded)) % validPalette.length;
    background = validPalette[index].replace(/^#/, '');
  } else {
    background = intToRGB(hashCode(encoded));
  }

  // If color not provided, automatically calculate the contrast
  const textColor = options.color ? opts.color : (isLightColor(background) ? '000' : 'fff');

  const query = [
    `size=${opts.size}`,
    `font-size=${opts.fontSize}`,
    `length=${opts.length}`,
    `background=${background}`,
    `color=${textColor}`,
    `rounded=${opts.rounded}`,
    `name=${encoded}`,
    `format=${opts.format}`,
  ].join('&');

  return `${opts.baseUrl}?${query}`;
}

/**
 * Scans the DOM for matching elements and injects avatar src attributes
 * where no src is already set.
 */
export function loadAvatars(selector: string = 'img.fn-ui-avatars', options: AvatarOptions = {}): number {
  if (typeof document === 'undefined') {
    throw new Error('fn-ui-avatars: loadAvatars() requires a browser environment.');
  }

  const elements = document.querySelectorAll<HTMLImageElement>(selector);
  let count = 0;

  elements.forEach((el) => {
    if (!el.getAttribute('src')) {
      const name = el.dataset.name;
      if (name) {
        el.src = getAvatarUrl(name, options);
        count++;
      }
    }
  });

  return count;
}
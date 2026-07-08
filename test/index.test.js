/**
 * Basic tests for fn-ui-avatars — no external test runner required.
 * Run with: node test/index.test.js
 */

import { getAvatarUrl, hashCode, intToRGB } from '../dist/index.js';

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

function assertThrows(description, fn) {
  try {
    fn();
    console.error(`  ❌ FAIL: ${description} (expected an error, got none)`);
    failed++;
  } catch {
    console.log(`  ✅ ${description}`);
    passed++;
  }
}

// --- hashCode ---
console.log('\nhashCode()');
assert('returns a number', typeof hashCode('John Doe') === 'number');
assert('same input → same output', hashCode('John') === hashCode('John'));
assert('different inputs → different outputs', hashCode('John') !== hashCode('Jane'));

// --- intToRGB ---
console.log('\nintToRGB()');
const color = intToRGB(hashCode('John Doe'));
assert('returns a 6-char string', color.length === 6);
assert('returns only hex characters', /^[0-9A-F]{6}$/.test(color));
assert('deterministic output', intToRGB(hashCode('Alice')) === intToRGB(hashCode('Alice')));

// --- getAvatarUrl ---
console.log('\ngetAvatarUrl()');
const url = getAvatarUrl('John Doe');
assert('returns a string', typeof url === 'string');
assert('starts with https', url.startsWith('https://'));
assert('contains the name', url.includes('John+Doe'));
assert('contains a background color', url.includes('background='));
assert('multiple spaces are collapsed', getAvatarUrl('John  Doe').includes('John+Doe'));

const customUrl = getAvatarUrl('Jane Smith', { size: 64, rounded: false });
assert('respects custom size option', customUrl.includes('size=64'));
assert('respects custom rounded option', customUrl.includes('rounded=false'));

const sameColor1 = getAvatarUrl('Alice');
const sameColor2 = getAvatarUrl('Alice');
assert('same name always produces same URL', sameColor1 === sameColor2);

const diffColor1 = getAvatarUrl('Alice');
const diffColor2 = getAvatarUrl('Bob');
assert('different names produce different colors', diffColor1 !== diffColor2);

assertThrows('throws on empty string', () => getAvatarUrl(''));
assertThrows('throws on non-string input', () => getAvatarUrl(null));

const urlSpecialChars = getAvatarUrl('José Conceição');
assert('encodes special characters correctly', urlSpecialChars.includes('Jos%C3%A9+Concei%C3%A7%C3%A3o'));

console.log('\nSmart Contrast (YIQ) & Color Sanitization');
const urlContrast = getAvatarUrl('John Doe');
assert('automatically applies fff or 000 contrast', urlContrast.includes('&color=fff') || urlContrast.includes('&color=000'));

const urlColorWithHash = getAvatarUrl('John', { color: '#AABBCC' });
const urlColorWithoutHash = getAvatarUrl('John', { color: 'AABBCC' });
assert('removes the # symbol from color', urlColorWithHash.includes('&color=AABBCC'));
assert('color with or without # generates same URL', urlColorWithHash === urlColorWithoutHash);

console.log('\nCustom Palette');
// 'red' and 'blue' are invalid hex formats and should be ignored
const urlPalette = getAvatarUrl('John', { palette: ['#FF0000', 'red', '00FF00', 'blue'] });
assert('ignores invalid colors (red/blue) and picks a valid hex', urlPalette.includes('&background=FF0000') || urlPalette.includes('&background=00FF00'));

const urlAllTrash = getAvatarUrl('John', { palette: ['red', 'blue', 'invalid'] });
const urlDefault = getAvatarUrl('John');
assert('falls back to default hash if entire palette is invalid', urlAllTrash === urlDefault);

// --- Summary ---
console.log(`\n${'─'.repeat(40)}`);
console.log(`  ${passed + failed} tests: ${passed} passed, ${failed} failed`);
console.log(`${'─'.repeat(40)}\n`);

if (failed > 0) process.exit(1);

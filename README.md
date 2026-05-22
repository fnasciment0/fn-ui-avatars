[![npm version](https://img.shields.io/npm/v/fn-ui-avatars.svg)](https://www.npmjs.com/package/fn-ui-avatars)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fn-ui-avatars)](https://bundlephobia.com/result?p=fn-ui-avatars)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Auto-generate consistent, colorful initials avatars using the [UI-Avatars](https://ui-avatars.com/) API.

Colors are **deterministic** — the same name always produces the same background color, across sessions and devices. It also features **Smart Contrast**, automatically switching the text color between black and white to ensure maximum legibility based on the generated background.

---

## Installation

```bash
npm install fn-ui-avatars
```

---

## Usage

### In the browser (vanilla JS)

Add `data-name` to any `<img>` element and call `loadAvatars()` after the DOM is ready:

```html
<img class="fn-ui-avatars" data-name="Maria Silva" alt="Avatar">
<img class="fn-ui-avatars" data-name="João Ferreira" alt="Avatar">

<script type="module">
  import { loadAvatars } from 'fn-ui-avatars';

  document.addEventListener('DOMContentLoaded', () => {
    loadAvatars(); // targets 'img.fn-ui-avatars' by default
  });
</script>
```

### Via CDN (No bundler required)

If you are not using a build tool, you can import it directly from unpkg:

```html
<script type="module">
  import { loadAvatars } from 'https://unpkg.com/fn-ui-avatars/dist/index.js';

  document.addEventListener('DOMContentLoaded', () => {
    loadAvatars();
  });
</script>
```

### Generate a single URL

```js
import { getAvatarUrl } from 'fn-ui-avatars';

const url = getAvatarUrl('Maria Silva');
// → https://eu.ui-avatars.com/api/?size=192&...&name=Maria+Silva&...

document.querySelector('#my-avatar').src = url;
```

### With React (or any component framework)

```jsx
import { getAvatarUrl } from 'fn-ui-avatars';

function Avatar({ name }) {
  return <img src={getAvatarUrl(name)} alt={name} />;
}
```

### CommonJS (Node / older bundlers)

```js
const { getAvatarUrl, loadAvatars } = require('fn-ui-avatars');
```

---

## API

### `getAvatarUrl(name, options?)`

Returns a UI-Avatars URL string for the given name.

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Full name (e.g. `"Maria Silva"`). Required. |
| `options` | `object` | Optional configuration (see below). |

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `192` | Image size in pixels. |
| `fontSize` | `number` | `0.33` | Font size ratio (`0.1`–`1`). |
| `length` | `number` | `2` | Number of initials to display. |
| `rounded` | `boolean` | `true` | Circular avatar. |
| `color` | `string` | `'fff'` | Text color (hex without `#`). Automatically outputs 'fff' or '000' for best contrast, unless overridden. |
| `format` | `string` | `'svg'` | Image format: `'svg'` or `'png'`. |
| `baseUrl` | `string` | `'https://eu.ui-avatars.com/api/'` | Custom API base URL. |

---

### `loadAvatars(selector?, options?)`

Scans the DOM and injects `src` attributes into matching elements that have `data-name` set and no existing `src`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | `'img.fn-ui-avatars'` | CSS selector for target elements. |
| `options` | `object` | `{}` | Same options as `getAvatarUrl`. |

Returns the number of avatars injected.

> ⚠️ This function requires a browser environment (`document` must be defined).

---

### `hashCode(str)` / `intToRGB(i)`

Low-level utility functions, exported for advanced use cases (e.g. generating matching border colors, custom backgrounds).

```js
import { hashCode, intToRGB } from 'fn-ui-avatars';

const hex = intToRGB(hashCode('Maria Silva')); // → e.g. "4A7BCC"
```

---

## How colors work

Each name is hashed with a simple djb2-style algorithm, and the resulting integer is masked to produce a 6-digit hex color. This ensures:

- The same name **always** gets the same color.
- Different names get visually distinct colors.
- The text color automatically adapts to be legible on light or dark backgrounds.
- No configuration or storage required.

---

## Running tests

```bash
npm test
```

No external test runner needed — tests use only Node's built-in assert.

---

## License

MIT

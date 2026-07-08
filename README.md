[![npm version](https://img.shields.io/npm/v/fn-ui-avatars.svg)](https://www.npmjs.com/package/fn-ui-avatars)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fn-ui-avatars)](https://bundlephobia.com/result?p=fn-ui-avatars)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Auto-generate consistent, colorful initials avatars using the [UI-Avatars](https://ui-avatars.com/) API.

Colors are **deterministic** — the same name always produces the same background color, across sessions and devices. It also features **Smart Contrast**, automatically switching the text color between black and white to ensure maximum legibility based on the generated background.

> **✨ Live Demo:** [Try the interactive generator here!](https://fn-ui-avatars-docs.vercel.app/)

<br/>
<div align="center">
  <img src="https://ui-avatars.com/api/?name=Maria+Silva&background=4A7BCC&color=fff&rounded=true&size=128" alt="Avatar Maria" width="100" />
  &nbsp;&nbsp;
  <img src="https://ui-avatars.com/api/?name=John+Doe&background=FCD34D&color=000&rounded=true&size=128" alt="Avatar John" width="100" />
  &nbsp;&nbsp;
  <img src="https://ui-avatars.com/api/?name=Alice+Wonder&background=F87171&color=fff&rounded=true&size=128" alt="Avatar Alice" width="100" />
  &nbsp;&nbsp;
  <img src="https://ui-avatars.com/api/?name=Fabio+Nascimento&background=10B981&color=fff&rounded=true&size=128" alt="Avatar Fabio" width="100" />
</div>
<br/>

> **⚛️ Using React?**
> Check out the official React wrapper component: [**fn-ui-avatars-react**](https://github.com/fnasciment0/fn-ui-avatars-react) (or find it on [npm](https://www.npmjs.com/package/fn-ui-avatars-react)).

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
| `color` | `string` | `'fff'` | Text color (hex with or without `#`). Automatically outputs 'fff' or '000' for best contrast, unless overridden. |
| `palette` | `string[]` | `[]` |  An array of custom hex colors. If provided, the deterministic algorithm will pick the background color from this curated list instead of the full hex spectrum.
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
- **Smart Contrast:** Automatically adapts text to be legible on light or dark backgrounds:

<div align="center">
  <img src="https://ui-avatars.com/api/?name=Dark+Background&background=1F2937&color=fff&rounded=false&size=128" width="120" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://ui-avatars.com/api/?name=Light+Background&background=F3F4F6&color=000&rounded=false&size=128" width="120" />
</div>

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

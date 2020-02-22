# mouse-explorer

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/mystroken/mouse-explorer/issues)

> :mouse2: Browse along a section clipped into a viewport using a mouse.

<br>

## Installation

```bash
npm install @mystroken/mouse-explorer
```

## Usage

Look at the sources files for more information.

```javascript
import createMouseExplorer from '@mystroken/mouse-explorer';

const viewport = document.querySelector('#viewport');
const section = document.querySelector('#container');
const explorer = createMouseExplorer({ viewport, section });

explorer.on(({ x, y }) => {
    section.style.transform = `translate3d(${x},${y},0)`;
});
```

<br>
<br>

## Parameters

```javascript
const explorer = createMouseExplorer({
    ease: 0.21,
    viewport: document.querySelector('#viewport'),
    section: document.querySelector('#container'),
    center: true,
});
```

<br>

#### viewport

Determines the viewport that clips the section.

| Default  | Type          | Required |
| -------- | ------------- | -------- |
| `Window` | `HTMLElement` | **No**   |

<br>

#### section

Determines the section to be explored.

| Default | Type          | Required |
| ------- | ------------- | -------- |
| `null`  | `HTMLElement` | **Yes**  |

<br>

#### ease

Set the ease of movement (section moving inside the viewport).

| Default | Type     | Required |
| ------- | -------- | -------- |
| `0.21`  | `Number` | **No**   |

<br>

#### center

Tells the explorer to center or not the section on start.

| Default | Type      | Required |
| ------- | --------- | -------- |
| `false` | `Boolean` | **No**   |

<br>
<br>

## Methods

#### on(callback)
Add a callback to be called on each mouse move on the section.

<br>

#### off(callback)
Remove a callback.

<br>

#### positionAt(x, y)
Get position (in pixel) for a given [-1,1] coordinates.

| Argument | Types    | Info                                  | Required |
| -------- | -------- | ------------------------------------- | -------- |
| x        | `Number` | The given x-axis position (in pixel). | Yes      |
| y        | `Number` | The given y-axis position (in pixel). | Yes      |

```javascript
const explorer = createMouseExplorer({ viewport, section });

// Position at center
explorer.positionAt(0, 0);
// Returns corresponding 
// amount of pixels to slide in order 
// to place the section in 
// the middle of the viewport.
// { x: 284, y: 97 }
```

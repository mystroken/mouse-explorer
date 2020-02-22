# mouse-explorer

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/mystroken/mouse-explorer/issues)

> :mouse2: Browse along a section clipped into a viewport using a mouse.

<br>

## Installation

```bash
npm install @mystroken/mouse-explorer
```

<br>

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



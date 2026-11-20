# Tony Bony's Science Lab

Mr. Kahler's interactive science demos, hosted by Tony Bony.
Created by Scott Kahler · © 2026 S. Kahler Teaching

## How it's laid out

```
index.html        the gallery (reads demos.json)
play.html         wraps one demo with a "back to the Lab" bar: play.html?d=<id>
demos.json        the list of demos (edit this to add, hide, or reorder)
demos/*.html      each demo, a single self-contained HTML file
thumbs/<id>.jpg   640x400 card picture for each demo
assets/tony.svg   Tony (site logo and favicon)
games/<id>/       source for games built from shared parts (Rock Kitchen, Rock Cycle Kitchen)
shared/tony/      the one shared Tony: rig, costumes, CSS, JS (see shared/tony/README.md)
tools/build.py    builds games/<id>/src.html into demos/<id>.html
CLAUDE.md         working notes and rules for Claude sessions
```

## Games built from shared parts

Rock Kitchen and Rock Cycle Kitchen are built, not edited directly. Their Tony comes from
`shared/tony/`, so a change to Tony (like a new costume) reaches both on the next build.

1. Edit `games/<id>/src.html` or files in `shared/`.
2. Run `python3 tools/build.py` (needs Python 3, nothing else).
3. Commit the source and the rebuilt `demos/*.html` together, then push.

Tony's costumes: `TonyRig.wear('mininghat')`, `TonyRig.setOutfit(['mininghat','labcoat'])`.
Try them all in `demos/tony-wardrobe.html` (hidden from the gallery).

## Add or update a demo by hand

1. Drop the HTML file in `demos/` (e.g. `demos/my-demo.html`).
2. Add an entry to `demos.json`:
   ```json
   { "id": "my-demo", "title": "My Demo", "file": "demos/my-demo.html",
     "category": "physics", "grades": "4-9", "blurb": "One kid-friendly sentence." }
   ```
   `category` is one of the ids in `categories`. `grades` is like `"1-3"` or `"All"`.
   Add `"hidden": true` to keep a demo in the repo but off the gallery.
3. Optional: add `thumbs/my-demo.jpg` (640x400). Without one the card shows a dark tile.
4. Commit and push. GitHub Pages republishes in about a minute.

Updating an existing demo is just step 1 (overwrite the file) and step 4.

## Update from Claude

Each entry's `source` says where the master copy lives:
- `"type": "repo"` → `games/<id>/src.html` in this repo is the master. An `artifact` slug there is
  a published copy that Claude updates after building; it is never pulled back.
- `"type": "artifact"` with a `slug` → a Claude artifact. In a Claude session, say
  **"sync Tony's Lab"**: Claude pulls the current version of each artifact into `demos/`,
  refreshes thumbnails, and pushes.
- `"type": "local"` → a file on Scott's PC; copy it in by hand or attach it in Claude.

## Reusing Tony's canvas rig and moves (older canvas games)

`assets/tony-rig-canvas.js` is the canvas Tony (poses, miner hat, held props, headlamp beam).
`assets/tony-actions.js` adds reusable moves on top of it: `inspect` (pull a prop from behind his
back and study it under the headlamp) and `present` (hold a prop or answer card up to the viewer),
plus `TonyProps.rock()` and `TonyProps.card(text)`. Usage notes are at the top of that file.
Demos stay single self-contained files, so paste both scripts into a demo rather than linking them.

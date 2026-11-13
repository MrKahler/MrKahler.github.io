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
assets/tony.svg   Tony
```

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
- `"type": "artifact"` with a `slug` → a Claude artifact. In a Claude session, say
  **"sync Tony's Lab"**: Claude pulls the current version of each artifact into `demos/`,
  refreshes thumbnails, and pushes.
- `"type": "local"` → a file on Scott's PC; copy it in by hand or attach it in Claude.

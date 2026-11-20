# Tony Bony's Science Lab: notes for Claude

Scott Kahler ("Mr. Kahler") teaches science at Legacy Homeschool Co-op. This repo
(MrKahler.github.io, served by GitHub Pages) is the source of truth for his demos and games.

## Where things live

```
games/<id>/src.html   source for games built from shared parts (edit these)
shared/tony/          THE Tony rig, costumes, CSS and JS (see shared/tony/README.md)
shared/fonts/         Fredoka / Nunito woff2 files, built into games offline
shared/vendor/        GSAP and other third-party code
tools/build.py        builds games/<id>/src.html -> demos/<id>.html (one offline file)
demos/*.html          what the site serves; built games are OUTPUT, never edit them by hand
demos.json            gallery list; "source" says where each demo's master copy is
```

`demos.json` source types:
- `"repo"`: master copy is `games/<id>/src.html` here. If it has an `artifact` slug, that
  Claude artifact is a published COPY, never pulled from.
- `"artifact"`: master copy is still a Claude artifact (not moved into games/ yet).
  "Sync Tony's Lab" pulls these into `demos/`.
- `"local"`: a file on Scott's PC.

## Any change to a repo-sourced game or to Tony

1. Edit `games/<id>/src.html` and/or `shared/...` with targeted edits (grep for the spot).
   Don't read whole built files or whole sources into context; they are hundreds of KB.
2. `python3 tools/build.py` (all games) and `python3 tools/build.py --check` before committing.
   A change in `shared/` changes every game that includes it; rebuild all of them.
3. Test in headless Chrome (load with no page errors, screenshot what changed).
   `demos/tony-wardrobe.html` shows every costume piece.
4. Commit and push (src, shared and the rebuilt demos together).
5. If the entry has an `artifact` slug, republish `demos/<id>.html` to it with the artifact
   publish-from-file tool (get the live version first), so the Claude copy matches.

## Tony

- One SVG rig for all SVG games: `shared/tony/tony-rig.svg`. Never paste a copy of Tony into a
  game; include it. Costumes: `TonyRig.wear('labcoat')`, `TonyRig.setOutfit([...])`.
- Wardrobe so far: `chefhat`, `mininghat` (with headlamp), `labcoat`.
- New costume piece: follow "Adding a costume piece" in `shared/tony/README.md`.
- Bomb Squad, Tony's Picker and Earth's Elements still use the separate canvas Tony in
  `assets/`. Costumes don't reach those until they are moved to the shared rig.
- A new Tony game starts as `games/<new-id>/src.html` using the includes, plus a
  `demos.json` entry with `"source": {"type": "repo", "src": "games/<new-id>/src.html"}`.

## Scott's standing rules for content

- Young-earth framing: no "millions/billions of years" or other deep-time language. Describe
  processes (heat, pressure, cooling, water) without ages or durations.
- Nothing below a character's face that could read as phallic; no controls placed on a
  character's body or crotch area. Put controls on lids, switches or the side.
- Tony talks about the machines in third person.
- No em dashes anywhere (code comments and kid-facing text included).
- Credit: "Created by Scott Kahler", "(c) 2026 S. Kahler Teaching", "Mr. Kahler".
- Grades 1-3 games are mouse-first and played with a parent.

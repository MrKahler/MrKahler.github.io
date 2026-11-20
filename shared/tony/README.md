# Shared Tony

This folder is the only copy of Tony Bony's SVG rig. Every SVG game builds him from here,
so a fix or a new costume made here reaches every game the next time it is built.

| File | What it is |
|---|---|
| `tony-rig.svg` | Tony's body (jointed, ids start with `tb-`) plus every costume piece |
| `tony.css` | Shows the pieces he is wearing, optional idle motion, talking jaw, hat flip |
| `tony.js` | `TonyRig`: `wear`, `take`, `toggle`, `isWearing`, `outfit`, `setOutfit`, `flipHat` |

Try every piece at `demos/tony-wardrobe.html` (built from `games/tony-wardrobe/`).

## Using Tony in a game

In the game's `games/<id>/src.html`, each on its own line:

```html
<style>
/* @include shared/tony/tony.css */
...
</style>

<svg id="tonySvg" viewBox="20 -50 160 302" style="overflow:visible">
<!-- @include shared/tony/tony-rig.svg -->
</svg>

<script>
/* @include shared/tony/tony.js */
</script>
```

Then dress him when the game starts, for example `TonyRig.setOutfit(['mininghat','labcoat'])`.
He starts in the chef hat if the game does nothing.

Optional: add class `tb-idle` to `svg#tonySvg` for a CSS wave, blink, head tilt and glance
(Rock Cycle Kitchen does this). Games that move Tony with GSAP (Rock Kitchen) leave it off.

## Wardrobe

| Item | Slot | Where it is drawn |
|---|---|---|
| `chefhat` | hat | in `#tb-hatSlot` (moves with his head) |
| `mininghat` | hat | in `#tb-hatSlot`; the lamp is `#tb-headlamp` |
| `labcoat` | coat | four parts: back panel, two sleeves (inside the upper arms), front and collar |

Pieces in the same slot replace each other, so he only wears one hat. The hook on his skull
hides itself whenever he has a hat on.

## Adding a costume piece

1. **Draw it** in `tony-rig.svg` as `<g class="tbw tbw-ITEM">...</g>`, in Tony's own
   coordinates. Put each part in the layer it belongs to:
   hats inside `#tb-hatSlot`, things on the head inside `#tb-head`, sleeves inside
   `#tb-armL`/`#tb-armR` (so they swing with the arm), things behind his body before `#tb-legs`.
   A piece can have several parts; give every part the same class.
   Keep any new ids starting with `tb-`.
2. **Show it** in `tony.css`: add `#tb-tony.wear-ITEM .tbw-ITEM` to the wardrobe list.
3. **Name it** in `tony.js`: add `ITEM: {slot:'...', label:'...'}` to `items`.
   Use slot `hat` for a hat; a new slot name for anything that can be worn alongside others.
4. Run `python3 tools/build.py`, open `demos/tony-wardrobe.html`, and check it on and off,
   alone and with the other pieces, and during a hat flip.

## Rules for Tony's look

- Nothing below his face that could read as phallic, and no game controls on his body.
- Costume pieces sit on the bones; they don't change the bones.

## The canvas Tony

Bomb Squad, Tony's Picker and Earth's Elements draw a different Tony on a `<canvas>`
(`assets/tony-rig-canvas.js`, `assets/tony-actions.js`). It is the same character in the same
coordinates but separate code, so costumes added here do not appear there yet.

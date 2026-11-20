#!/usr/bin/env python3
"""
Build Tony Bony games from their sources into single offline HTML files.
Created by Scott Kahler, (c) 2026 S. Kahler Teaching.

    python3 tools/build.py                 build every game in games/
    python3 tools/build.py rock-kitchen    build just one
    python3 tools/build.py --check         build everything, fail if demos/ is out of date

Each game lives in games/<id>/src.html and builds to demos/<id>.html.
Edit the source and the shared files, never demos/*.html by hand.

Directives (each must be alone on its own line in src.html):
    <!-- @include shared/tony/tony-rig.svg -->     paste a file (path from the repo root)
    /* @include shared/tony/tony.css */            same thing, comment style for CSS/JS
    /* @fonts Fredoka:600,700 Nunito:700,800 */    @font-face rules with the fonts built in
                                                   (from shared/fonts/<family>-<weight>.woff2)
Included files may include other files. Inside <script>, "</script" is escaped automatically.
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES = os.path.join(ROOT, 'games')
OUT = os.path.join(ROOT, 'demos')

INCLUDE = re.compile(r'^[ \t]*(?:<!--|/\*)[ \t]*@include[ \t]+(\S+)[ \t]*(?:-->|\*/)[ \t]*$', re.M)
FONTS = re.compile(r'^[ \t]*/\*[ \t]*@fonts[ \t]+(.+?)[ \t]*\*/[ \t]*$', re.M)


def font_faces(spec):
    rules = []
    for part in spec.split():
        family, weights = part.split(':')
        for w in weights.split(','):
            path = os.path.join(ROOT, 'shared', 'fonts', f'{family.lower()}-{w}.woff2')
            if not os.path.exists(path):
                sys.exit(f'build: missing font file {os.path.relpath(path, ROOT)}')
            data = base64.b64encode(open(path, 'rb').read()).decode()
            rules.append("@font-face{font-family:'%s';font-weight:%s;font-style:normal;"
                         "font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}"
                         % (family, w, data))
    return '\n'.join(rules)


def expand(text, chain):
    def inc(m):
        rel = m.group(1)
        path = os.path.normpath(os.path.join(ROOT, rel))
        if not path.startswith(ROOT) or not os.path.isfile(path):
            sys.exit(f'build: cannot find "{rel}" (included from {chain[-1]})')
        if rel in chain:
            sys.exit(f'build: include loop: {" -> ".join(chain + [rel])}')
        body = expand(open(path, encoding='utf-8').read(), chain + [rel]).rstrip('\n')
        if rel.endswith('.js'):
            body = body.replace('</script', '<\\/script')
        return body
    text = INCLUDE.sub(inc, text)
    return FONTS.sub(lambda m: font_faces(m.group(1)), text)


def build(game):
    src = os.path.join(GAMES, game, 'src.html')
    if not os.path.isfile(src):
        sys.exit(f'build: no games/{game}/src.html')
    html = expand(open(src, encoding='utf-8').read(), [f'games/{game}/src.html'])
    if '@include' in html and INCLUDE.search(html):
        sys.exit(f'build: unresolved @include left in {game}')
    first, _, rest = html.partition('\n')
    stamp = (f'<!-- Built by tools/build.py from games/{game}/src.html and shared/. '
             'Edit those, not this file. -->')
    return first + '\n' + stamp + '\n' + rest


def main(args):
    check = '--check' in args
    names = [a for a in args if not a.startswith('--')] or sorted(
        d for d in os.listdir(GAMES) if os.path.isfile(os.path.join(GAMES, d, 'src.html')))
    stale = []
    for g in names:
        html = build(g)
        out = os.path.join(OUT, g + '.html')
        old = open(out, encoding='utf-8').read() if os.path.exists(out) else None
        if check:
            if old != html:
                stale.append(g)
            continue
        if old != html:
            open(out, 'w', encoding='utf-8').write(html)
        print(f'{g:28s} {len(html) // 1024:5d} KB  {"updated" if old != html else "unchanged"}')
    if check:
        if stale:
            sys.exit('out of date (run tools/build.py): ' + ', '.join(stale))
        print('all built files are up to date')


if __name__ == '__main__':
    main(sys.argv[1:])

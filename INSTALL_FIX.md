# Installation fix

The project uses React 19. The previous package manifest included `vaul@0.9.9`, whose peer dependency only accepts React 16/17/18. That caused npm's `ERESOLVE` failure before `next` could be installed.

The unused Vaul drawer dependency has been removed from this build, so the project can use React 19 without that peer conflict.

## macOS

```bash
npm install
npm run dev
```

Then open http://localhost:3000

If npm still reports a dependency conflict from a stale local install, run:

```bash
rm -rf node_modules package-lock.json
npm cache verify
npm install
npm run dev
```

The `rbenv: command not found` messages from `.zshrc` are unrelated to VATify. They come from your shell startup configuration and do not prevent Node/npm from running.

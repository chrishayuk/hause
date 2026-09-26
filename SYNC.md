# One library revision

Both publications pin the same full Git SHA in `hause.lock.json`. hause.design
installs that SHA from GitHub. chrishayuk.com carries a complete source mirror so
its plain Node TypeScript tests can load shared contracts without stripping types
inside node_modules. Transport differs; library files must be byte-identical.

## Updating

1. Make reusable changes in HAUSE, run `npm test`, commit and push a review branch.
2. Set hause.design's Git dependency to that full SHA and run `npm install`.
3. From each consumer, run the upstream script with a clean library checkout:

```
node ../hause/scripts/consumer-sync.mjs --source ../hause --package node_modules/@chrishayuk/hause --write
```

For chrishayuk.com, use the appropriate relative path to the same checkout and
`--package vendor/hause`. This copies every shared source file and refreshes
`SOURCE_REVISION`. Removed files are reported for explicit review rather than
silently deleted. Commit the source mirror, both lockfiles and the consumer work.

4. Run `npm run check:hause`, consumer tests and the build in each publication.
5. CI checks out the pinned upstream SHA and verifies the hash inventory against
that independent checkout. Editing both a local component and its recorded hash
cannot pass that gate. Library changes need an upstream commit and a new pin.

The lock covers components, tokens, helpers, documentation and tests. It does not
claim that page compositions, editorial content or historical evaluations are
identical. Those remain owned by their respective publications.

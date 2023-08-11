# Leaning Technologies developer site

## Development setup

1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [pnpm](https://pnpm.io/installation)
3. Clone this repository
4. Install dependencies: `pnpm install`
5. Spawn development server: `pnpm start`
6. Visit [localhost:3000](http://localhost:3000)

## Linting

Linters run automatically in [this GitHub Action workflow](.github/workflows/lint.yml). You can also run them locally.

### Broken links

lychee is a tool that recursively checks all links on the site for 404s.

1. Install [lychee](https://lychee.cli.rs/#/introduction)
2. Build the site: `pnpm build`
3. Preview the site in the background: `pnpm preview --host 0.0.0.0 &`
4. Run lychee: `lychee dist src/content`

You may need to set `GITHUB_TOKEN` to avoid issues checking links to github.com.

### Prose

Vale checks style and grammar in Markdown files.

1. Install [Vale](https://vale.sh/docs/vale-cli/installation/)
2. Download style rules: `vale sync`
3. Check with Vale: `vale .`

For editor integration, use:

- Visual Studio Code: [`chrischinchilla.vale-vscode`](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode)
- Vim: [ALE](https://github.com/dense-analysis/ale)

### Prettier

Prettier is a code formatter. It's shipped as a `devDependency`, so `pnpm install` will have installed it.

To format all files:

```shell
$ pnpm format
```

### Astro diagnostics

Astro has some of its own diagnostics.

```shell
$ pnpm astro check
```

### TypeScript

```shell
$ pnpm tsc
```

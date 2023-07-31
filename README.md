# labs.leaningtech.com

## Installation

You will need:

- Node.js
- pnpm

```
$ pnpm install
```

## Development

```
$ pnpm run dev
```

## Commands

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:3000`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## Linting

Linters run automatically in [this GitHub Action workflow](.github/workflows/lint.yml). You can also run them locally.

### Broken links

lychee is a tool that recursively checks all links on the site for 404s.

1. Install [lychee](https://lychee.cli.rs/#/introduction)
2. Build the site: `pnpm build`
3. Preview the site in the background: `pnpm preview --host 0.0.0.0 &`
4. Run lychee: `lychee http://localhost:3000`

### Prose

Vale checks style and grammar in Markdown files.

1. Install [Vale](https://vale.sh/docs/vale-cli/installation/)
2. Run Vale: `vale .`

For editor integration, use:

- Visual Studio Code: [`chrischinchilla.vale-vscode`](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode)
- Vim: [ALE](https://github.com/dense-analysis/ale)

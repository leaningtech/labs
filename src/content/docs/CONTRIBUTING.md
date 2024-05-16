---
title: How to Contribute
---

Thanks for thinking of contributing to Leaning Technologies open source projects and their documentation!

Quick links:

- [GitHub](https://github.com/leaningtech)
- [Contributing to Cheerp documentation](/cheerp/contributing)

## Your First Pull Request

Working on your first pull request? You can learn how here:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Bugs and Feature Requests

If you find a bug or have a feature request, please open an issue on the relevant repository or ask in the `#support` channel on [our Discord server](https://discord.leaningtech.com).

- [Open an issue on Cheerp](https://github.com/leaningtech/cheerp-meta/issues/new)
- [Open an issue on CheerpJ](https://github.com/leaningtech/cheerpj-meta/issues/new)
- [Open an issue on CheerpX](https://github.com/leaningtech/cheerpx-meta/issues/new)
- [Open an issue on Labs](https://github.com/leaningtech/labs/issues/new) (this site)

## Documentation

Documentation is written in Markdown and MDX and is located in the `src/content/docs` directory of [Labs](#labs).

### Style guide

In brief:

- Use [Diataxis](https://diataxis.fr/) for structure
- Be concise but thorough; you can always link to more information or provide it in a callout
- Always use examples
- Avoid "I" and "you"; use "we" if necessary

## Labs

Labs is the codebase for the Leaning Technologies developer site. It is built using [Astro](https://astro.build), [Tailwind](https://tailwindcss.com), [TypeScript](https://www.typescriptlang.org), and [Svelte](https://svelte.dev).

### Setup

1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [pnpm](https://pnpm.io/installation)
3. Clone the repo, e.g. with `gh clone leaningtech/labs`
4. Change into the directory: `cd labs`
5. Install dependencies: `pnpm install`
6. Spawn development server: `pnpm start`
7. Visit [localhost:4321](http://localhost:4321)

### Linting

Linters run automatically in [this GitHub Action workflow](.github/workflows/lint.yml). You can also run them locally.

#### Broken links

lychee is a tool that recursively checks all links on the site for 404s.

1. Install [lychee](https://lychee.cli.rs/#/introduction)
2. Build the site: `pnpm build`
3. Preview the site in the background: `pnpm preview --host 0.0.0.0 &`
4. Run lychee: `lychee dist src/content`

You may need to set `GITHUB_TOKEN` to avoid issues checking links to github.com.

#### Prose

Vale checks style and grammar in Markdown files, like capitalisation of certain words, use of passive voice, and more.

1. Install [Vale](https://vale.sh/docs/vale-cli/installation/)
2. Download style rules: `vale sync`
3. Check with Vale: `vale .`

For editor integration, use:

- Visual Studio Code: [`chrischinchilla.vale-vscode`](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode)
- Vim: [ALE](https://github.com/dense-analysis/ale)

Vale is quite brittle, particularly on MDX files. It's okay if there are errors, but please look at them to see if they are valid. Hopefully we can improve this in the future.

#### Prettier

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

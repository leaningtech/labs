---
title: Quickstart
description: "Get started with BrowserPod in minutes: use a quickstart template (API key optional), and run your first sandboxed app in the browser."
---

BrowserPod provides a sandboxed runtime for executing code safely in the browser. This quickstart will get you running your first BrowserPod application in minutes.

## 1. Get an API key (optional)

BrowserPod works with or without an API key. A key enables [Portals](/docs/understanding-browserpod/portals), which let you preview and share services running inside your Pod. See [Networking](/docs/understanding-browserpod/networking) for everything that differs between the two.

To get a key, register at https://console.browserpod.io using your GitHub account and create a new API key. You can also skip this step and add a key later.

## 2. Use one of our quickstart templates

Run the following command to create a Vite-based project:

```bash
npm create browserpod-quickstart
```

The CLI asks you to:

1. Pick a template: **Basic** (a Node.js REPL), **Bash shell**, or **Web server** (an Express server with a live preview, which uses Portals).
2. Name your project.
3. Paste your API key, or leave it blank to continue without one. You can add or change it later in `.env`.

Then install the dependencies and start the dev server:

```bash
cd <your-project-name>
npm install
npm run dev
```

Then, open your localhost (for example, [http://localhost:5173/](http://localhost:5173/)) in your browser, and you should
see something like this:

![Output of the basic template](/docs/assets/bp-quickstart.png)

Congratulations! You just ran your first BrowserPod application!

Feel free to modify `src/main.js`. The dev server supports hot reloading.

## Command-line options

To skip the prompts, pass options to the command. npm needs a `--` before them:

```bash
npm create browserpod-quickstart -- my-app -t vite-basic -k <your-key>
```

| Option                    | Description                                  |
| ------------------------- | -------------------------------------------- |
| `<project-name>`          | Name of the project folder                   |
| `-t`, `--template <name>` | Template: `vite-basic`, `bash` or `vite-web` |
| `-k`, `--api-key <key>`   | API key to save in `.env`                    |
| `--non-interactive`       | Fail instead of prompting for missing values |
| `-h`, `--help`            | Show all options                             |

## Next steps

- **Step-by-step tutorial:** For a complete walkthrough including project setup, server configuration, and working with NPM dependencies, see the [basic NPM project tutorial].
- **Live demo:** For an interactive example with a file editor, NPM dependencies, and hot reloading, try our [Vite+SvelteKit demo].
- **API reference:** Learn about all available methods in the [API reference].

---

[basic NPM project tutorial]: /docs/getting-started/expressjs
[Vite+SvelteKit demo]: https://vitedemo.browserpod.io
[API reference]: /docs/reference

## Any Questions?

We're here to help! If you have any questions or concerns, feel free to explore our [guides](/docs/guides) or [reference](/docs/reference) section or check out our [frequently asked questions](/docs/more/FAQ). You can also connect with our supportive community on [Discord](https://discord.com/invite/yzZJzpaxXT), and reach out whenever you’d like!

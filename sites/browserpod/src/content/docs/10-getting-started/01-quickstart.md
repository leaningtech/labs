---
title: Quickstart
description: "Get started with BrowserPod in minutes: get a free BrowserPod Edge key, scaffold a project from a template, and run your first Pod in the browser."
---

BrowserPod is a microVM that runs in the browser. This quickstart gets your first BrowserPod application running in minutes.

## 1. Get a free BrowserPod Edge key

BrowserPod Edge connects your Pods to the internet, so everything works: npm, GitHub and the other [allowed domains](/docs/understanding-browserpod/networking) without CORS limits, and [Portals](/docs/understanding-browserpod/portals), which give servers running in your Pod a public URL. It's free for up to 1,000 connected hours every month.

To get a key, sign in at https://console.browserpod.io with your GitHub account and create an API key.

You can also continue without a key: Pods still run, with networking through the browser. See [Networking](/docs/understanding-browserpod/networking) for the differences.

## 2. Use one of our quickstart templates

Run the following command to scaffold a project:

```bash
npm create browserpod-quickstart@latest
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
npm create browserpod-quickstart@latest -- my-app -t vite-basic -k <your-key>
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
- **Deploying:** Serve your page over HTTPS with the COOP and COEP headers. See [Serve your page cross-origin isolated](/docs/guides/hosting).

---

[basic NPM project tutorial]: /docs/getting-started/expressjs
[Vite+SvelteKit demo]: https://vitedemo.browserpod.io
[API reference]: /docs/reference

## Any Questions?

We're here to help! If you have any questions or concerns, feel free to explore our [guides](/docs/guides) or [reference](/docs/reference) section or check out our [frequently asked questions](/docs/more/FAQ). You can also connect with our supportive community on [Discord](https://discord.com/invite/yzZJzpaxXT), and reach out whenever you’d like!

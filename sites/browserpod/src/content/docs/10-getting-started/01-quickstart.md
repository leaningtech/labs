---
title: Quickstart
description: Getting started with BrowserPod
---

## 1. Register a free account

In order to use BrowserPod, you need to obtain an API key.

You can register at https://console.browserpod.io using your GitHub account, and
create a new API key.

## 2. Use one of our quickstart templates

Run the following command to generate a basic project using Vite for bundling and as a development server.
When asked, enter a project name and the API key you created in the previous step.

```bash
npm create browserpod-quickstart
```

Then install the dependencies and start the dev server:

```bash
cd <your-project-name>
npm install
npm run dev
```

Then, open your localhost (for example, [http://localhost:5173/](http://localhost:5173/)) in your browser, and you should
see something like this:

![Output of the basic template](/docs/assets/bp-quickstart.png)

Congraturations! you just run your first BrowserPod application!

Feel free to modify `src/main.js`. The dev server supports hot reloading.

## Next steps

- **Step-by-step tutorial:** For a complete walkthrough including project setup, server configuration, and working with NPM dependencies, see the [basic NPM project tutorial].
- **Live demo:** For an interactive example with a file editor, NPM dependencies, and hot reloading, try our [Vite+SvelteKit demo].
- **API reference:** Learn about all available methods in the [API reference].

---

[basic NPM project tutorial]: /docs/getting-started/expressjs
[Vite+SvelteKit demo]: https://vitedemo.browserpod.io
[API reference]: /docs/reference

## Any Questions?

We're here to help! If you have any questions or concerns, feel free to explore our [guides](/docs/guides) or [reference](/docs/reference) section or check out our [frequently asked questions](/docs/more/faq). You can also connect with our supportive community on [Discord](https://discord.com/invite/yzZJzpaxXT), and reach out whenever you’d like!

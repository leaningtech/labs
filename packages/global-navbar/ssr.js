// Renders built server-side component into static assets for use in WordPress

import Nav from "./dist/server/index.js";
import { writeFile } from "fs/promises";

const { head, html } = Nav.render();

await writeFile("dist/server/body.html", html);
await writeFile("dist/server/head.html", head);

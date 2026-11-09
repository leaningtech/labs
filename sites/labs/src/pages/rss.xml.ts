import type { APIContext } from "astro";
import { blogFeed } from "../lib/feeds";

export const GET = (context: APIContext) => blogFeed(context);

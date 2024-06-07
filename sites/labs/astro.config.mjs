import { defineConfig } from "astro/config";
import theme from "@leaningtech/astro-theme";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
	integrations: [theme()],
});

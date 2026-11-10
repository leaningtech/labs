// What the docs' "AI agents" button (components/agents) offers, per product.
// A product without an entry gets no button.
//
// Each prompt matches the header prompt on the product's marketing site
// (leaningtech.com: sites/<product>/src/lib/agent-prompt.ts); keep the two in step.

export interface AgentConfig {
	name: string; // the product, in the panel's title
	skill: string; // the skill's SKILL.md, as served by the product's site
	skillName: string; // its name in leaningtech/skills
	prompt: string; // the prompt a reader gives their agent
	covers: string; // what the skill covers, after "It loads the <name> skill, which covers"
	agentsMd: string; // the page for agents that read the site
}

const cheerpjSkill = "https://cheerpj.com/skills/cheerpj/SKILL.md";
const browserpodSkill = "https://browserpod.io/skills/browserpod/SKILL.md";

export const agents: Partial<Record<string, AgentConfig>> = {
	cheerpj3: {
		name: "CheerpJ",
		skill: cheerpjSkill,
		skillName: "cheerpj",
		prompt: `Use the CheerpJ skill (${cheerpjSkill}) to help me run our Java application in the browser.`,
		covers:
			"converting Java applications, applets, JNLP, Oracle Forms and libraries, and the common errors",
		agentsMd: "https://cheerpj.com/agents.md",
	},
	browserpod: {
		name: "BrowserPod",
		skill: browserpodSkill,
		skillName: "browserpod",
		prompt: `Use the BrowserPod skill (${browserpodSkill}) to add a BrowserPod sandbox to my web app.`,
		covers:
			"booting a pod without an API key, running Node.js and Rust programs, files, networking with and without Edge, Portals, and the attribution the licence asks for",
		agentsMd: "https://browserpod.io/agents.md",
	},
};

export function agentConfig(productId: string | undefined) {
	return productId ? agents[productId] : undefined;
}

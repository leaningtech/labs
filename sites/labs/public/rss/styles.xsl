<?xml version="1.0" encoding="UTF-8"?>
<!--
	Browsers render the feeds through this stylesheet so that clicking a feed link
	shows a readable page instead of raw XML. It is referenced by an
	<?xml-stylesheet?> processing instruction, which feed readers and crawlers
	ignore, so the XML they consume is unchanged.

	Colours mirror the labs site: stone-950 background, primary-400 accent
	(see .site-labs in packages/astro-theme/styles/theme.css). Tailwind is not
	available here, so they are written out literally.
-->
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom"
>
	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<title>
					<xsl:value-of select="/rss/channel/title" />
				</title>
				<link rel="icon" href="/favicon.svg" />
				<style>
					:root { color-scheme: dark; }
					* { box-sizing: border-box; }
					body {
						margin: 0;
						padding: 2.5rem 1.5rem 5rem;
						background: rgb(12 10 9);
						color: rgb(214 211 209);
						font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
						line-height: 1.6;
					}
					.wrap { max-width: 44rem; margin: 0 auto; }
					.banner {
						border: 1px solid rgb(68 64 60);
						border-left: 3px solid rgb(235 82 119);
						border-radius: 0.5rem;
						padding: 1rem 1.25rem;
						margin-bottom: 3rem;
						background: rgb(28 25 23);
					}
					.banner h2 {
						margin: 0 0 0.35rem;
						font-size: 0.95rem;
						color: #fff;
					}
					.banner p { margin: 0 0 0.75rem; font-size: 0.9rem; color: rgb(168 162 158); }
					.banner p:last-child { margin-bottom: 0; }
					.url {
						display: block;
						font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
						font-size: 0.85rem;
						background: rgb(12 10 9);
						border: 1px solid rgb(68 64 60);
						border-radius: 0.375rem;
						padding: 0.6rem 0.8rem;
						color: rgb(240 125 153);
						overflow-wrap: anywhere;
					}
					h1 {
						font-size: 1.9rem;
						line-height: 1.2;
						margin: 0 0 0.6rem;
						color: #fff;
						letter-spacing: -0.02em;
					}
					.tagline { margin: 0 0 2.5rem; color: rgb(168 162 158); }
					.count {
						font-size: 0.75rem;
						text-transform: uppercase;
						letter-spacing: 0.08em;
						color: rgb(120 113 108);
						border-bottom: 1px solid rgb(41 37 36);
						padding-bottom: 0.6rem;
						margin-bottom: 0.5rem;
					}
					ul { list-style: none; margin: 0; padding: 0; }
					li { border-bottom: 1px solid rgb(41 37 36); padding: 1.4rem 0; }
					li:last-child { border-bottom: 0; }
					time { font-size: 0.78rem; color: rgb(120 113 108); }
					h3 { margin: 0.3rem 0 0.4rem; font-size: 1.05rem; line-height: 1.35; }
					h3 a { color: #fff; text-decoration: none; }
					h3 a:hover { color: rgb(235 82 119); }
					.desc { margin: 0; font-size: 0.9rem; color: rgb(168 162 158); }
					footer { margin-top: 3rem; font-size: 0.85rem; color: rgb(120 113 108); }
					footer a { color: rgb(235 82 119); }
				</style>
			</head>
			<body>
				<div class="wrap">
					<div class="banner">
						<h2>This is an RSS feed</h2>
						<p>
							Copy the address below into a feed reader and you will get new
							posts as they are published. Nothing to sign up for.
						</p>
						<code class="url">
							<xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href" />
						</code>
					</div>

					<h1>
						<xsl:value-of select="/rss/channel/title" />
					</h1>
					<p class="tagline">
						<xsl:value-of select="/rss/channel/description" />
					</p>

					<p class="count">
						<xsl:value-of select="count(/rss/channel/item)" />
						<xsl:text> posts</xsl:text>
					</p>

					<ul>
						<xsl:for-each select="/rss/channel/item">
							<li>
								<!-- pubDate is RFC-822: "Mon, 26 Oct 2026 00:00:00 GMT". -->
								<time>
									<xsl:value-of select="substring(pubDate, 6, 11)" />
								</time>
								<h3>
									<a>
										<xsl:attribute name="href">
											<xsl:value-of select="link" />
										</xsl:attribute>
										<xsl:value-of select="title" />
									</a>
								</h3>
								<p class="desc">
									<xsl:value-of select="description" />
								</p>
							</li>
						</xsl:for-each>
					</ul>

					<footer>
						<a>
							<xsl:attribute name="href">
								<xsl:value-of select="/rss/channel/link" />
							</xsl:attribute>
							<xsl:text>Visit the site →</xsl:text>
						</a>
					</footer>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>

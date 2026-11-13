# DevAtlas

Visual software engineering knowledge base: concepts, patterns and architectures organized in ten domains, written in a standard editorial model and published as a fully static, bilingual (English and Portuguese) site.

Product vision and design specification live in `docs/01-product-concept.md` and `docs/02-design-system.md`.

## Requirements

- Bun 1.4+ (package manager and script runner)
- Node.js 26+ (runtime used by Next.js)
- Docker, optional, to evaluate the production build locally

## Commands

| Task | Command |
|---|---|
| Install dependencies | `bun install` |
| Development server (http://localhost:3000) | `bun dev` |
| Unit tests | `bun run test` |
| Lint | `bun run lint` |
| Type check | `bun run typecheck` |
| Production build (static export in `out/` plus the Pagefind search index) | `bun run build` |
| Serve the production build with nginx on http://localhost:3000 | `docker compose up --build -d` |
| Stop the container | `docker compose down` |
| Build and deploy `out/` to Cloudflare Workers static assets (requires `wrangler login`) | `bun run deploy` |

Search only works on the production build, because the index is generated from the exported HTML. Content metadata is validated during the build, so invalid content fails `bun run build` with a list of every problem found.

## Adding a topic

1. Pick the domain folder under `content/` (each one has a `category.yaml` with its name, description and subcategories in both languages).
2. Create a folder named after the topic slug (kebab-case, unique across all domains).
3. Add `topic.yaml` with the language-independent metadata: subcategory (declared in the domain `category.yaml`), difficulty (`beginner`, `intermediate` or `advanced`), reading time in minutes, tags, related topic slugs, references (title, https URL and type), last review date, `published` and optionally `featured`. The slug and the domain come from the folder names.
4. Add `en.mdx` and `pt.mdx` with a frontmatter containing only `title` and `description`, followed by the ten written editorial sections, each wrapped in an `ArticleSection` with its id, in order: overview, how-it-works, visual-demonstration, when-to-use, when-not-to-use, advantages-and-disadvantages, trade-offs, real-world-examples, implementation-examples, common-misconceptions. Related concepts and references are rendered from `topic.yaml`.
5. Articles can use `Callout` (info, tip, warning, important), `CodeBlock` (or fenced code blocks), `ComparisonTable` and any visual lab registered in `src/visualizations/registry.ts`. `content/concurrency/concurrency-vs-parallelism` shows all of them.
6. Run `bun run test` and `bun run build`; the topic appears in the sidebar, its category page, search and any learning path that lists it (`content/learning-paths.yaml`).

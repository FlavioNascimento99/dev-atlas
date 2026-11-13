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

## Adding a visualization

Every visual lab lives in its own folder under `src/visualizations/animations/` (a process shown step by step), `src/visualizations/simulators/` (parameters that change the behavior) or `src/visualizations/diagrams/` (a static picture with no steps), and touches no file shared with other labs except the registry of its domain. `src/visualizations/animations/dns-resolution/` is the smallest complete example.

1. **Logic** — a pure module with no React and no display text. For a fixed sequence of steps, write a function that returns the steps for the given parameters and wrap it with `scriptedModel` (`src/visualizations/scripted.ts`), as in `animations/dns-resolution/script.ts`; each step has an `id` and whatever the drawing needs. For a simulation with state and randomness, implement `SimulationModel` (`src/visualizations/types.ts`), as in `simulators/cache/simulation.ts`. The lab's own types go in `types.ts` in the same folder.
2. **Texts** — `texts.ts` in the same folder, with `en` and `pt` side by side (`pt` is typed as `typeof en`, so a missing key fails the type check). Step explanations are keyed by step id. The global dictionaries in `src/lib/i18n/dictionaries/` only hold the texts of the lab frame.
3. **Component** — a client component that calls `useSimulation` with the model, and renders `VisualLab` (frame, playback, parameters, `aria-live` explanation and the conceptual/faithful seal) around an SVG. Reuse `src/visualizations/primitives/`: `SequenceDiagram` for messages between actors, `LabSvg` for a custom accessible canvas, `ChoiceParameter` and `RangeParameter` for controls, `LabLegend` for the color key under the canvas. A static diagram has no logic to step through: it skips `useSimulation` and renders `VisualLab` without `playback`, which hides the toolbar (see `diagrams/vm-vs-containers/`). Keep the labels inside the SVG short and put the full sentence in the explanation; use color tokens only, and let Motion animate so reduced motion is honored by the frame.
4. **Registry** — add the component to the file of the topic's domain in `src/visualizations/registries/`, loaded with `next/dynamic` like the existing entries. The key is the tag used in MDX.
5. **Article** — in `en.mdx` and `pt.mdx`, put the tag inside the `visual-demonstration` section, followed by one or two sentences telling the reader what to watch.
6. **Test** — `tests/visualizations/<lab>.test.ts` asserts the rules the logic represents (see `tests/visualizations/dns-resolution.test.ts`), not the rendering.

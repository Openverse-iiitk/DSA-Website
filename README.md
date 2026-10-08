# Algorithima

Algorithima is an educational data structures and algorithms visualizer built by Openverse contributors at IIIT Kottayam. It is used in DSA and C programming courses at the institute.

**Live demo:** <https://algorithima.web.app/>

The site provides interactive visualizations for linked lists, stacks and queues, sorting and searching, trees, graphs, pathfinding, recursion, hash tables, greedy algorithms, pointers, and flowcharts. Many views let learners step through an operation and inspect a related code example. The animations are teaching aids; use the explanations and source code to check each algorithm's assumptions and behavior.

## Run locally

Requirements: Node.js 18 or later and npm.

```sh
git clone https://github.com/Openverse-iiitk/DSA-Website.git
cd DSA-Website
npm ci
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173>.

## Production build

```sh
npm run build
npm run preview
```

`npm run build` writes the static site to `dist/`. `npm run preview` serves that
build locally. `npm test` runs focused arithmetic-expression unit tests for the
flowchart simulator. The repository does not yet include an automated browser
interaction suite, so a successful build does not verify every visualization
or interaction.

`npm run lint` checks the application source with ESLint. It currently exits
successfully, with existing React hook and fast-refresh warnings remaining.
These warnings are not a substitute for browser interaction checks.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing the project. It describes the component structure and conventions used by the team.

## License

See [LICENSE](LICENSE) for the repository license.

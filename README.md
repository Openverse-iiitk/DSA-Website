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

`npm run build` writes the static site to `dist/`. `npm run preview` serves that build locally. The repository does not include a dedicated automated interaction-test suite, so a successful build does not verify every visualization or browser interaction.

The current `npm run lint` command is not a passing check: on the reviewed
revision it reports 317 errors and 15 warnings across the repository. Treat
that as existing cleanup work, not as evidence that the build or visualizations
are broken.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing the project. It describes the component structure and conventions used by the team.

## License

See [LICENSE](LICENSE) for the repository license.

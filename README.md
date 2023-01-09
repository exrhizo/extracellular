# Extracellular Monorepo

### Getting Started

- Pull the obsidian CMS into `matrix`: `git submodule init`

### Obsidian as a CMS

See [matrix/README.md](matrix/README.md)

# ECM

### [Cross at a Ford](http://crossataford.com) founded by @exrhizo

### [exrhizo.me](https://exrhizo.me/)

Run with

- `nx serve ecm`

Created with

- `nx g @nrwl/next:app ecm`
- `nx g @nrwl/next:page my-new-page --project=my-new-app`
- `nx g @nrwl/next:component my-new-component --project=my-new-app`
- [Nx Next Tutorial](https://nx.dev/packages/next)
- [Nx vercel deploy tutorial](https://nx.dev/recipes/other/deploy-nextjs-to-vercel)

## About [Nx](https://nx.dev)

Nx helps manage monorepo tasks, including generators for templatized `libs` and `apps` creation.

- [nx standard packages](https://nx.dev/packages)
- [community plugins](https://nx.dev/community)

### Example commands

- `nx g @nrwl/react:app my-app` to generate an application.
- `nx g @nrwl/react:lib my-lib` to generate a library.
- `nx serve my-app` for a dev server.
- `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.
- `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
- `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).
- `nx affected:test` to execute the unit tests affected by a change.
- `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).
- `nx affected:e2e` to execute the end-to-end tests affected by a change.
- `nx graph` to see a diagram of the dependencies of your projects.

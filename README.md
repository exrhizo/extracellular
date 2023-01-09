# Extracellular Monorepo

### Getting Started

- Pull the obsidian CMS into `matrix`: `git submodule init`

### Obsidian as a CMS

See [matrix/README.md](matrix/README.md)

### Stitches and Radix UI for components

see this [youtube video](https://www.youtube.com/watch?v=Gw28VgyKGkw&t=2725s) for a sense of what it is like and how.

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

But then it was edited to use the stitches library, if we want to generate components that are compatible, then that will mean making a nx generator custom.

# tools/executors

### Arrow

see:

This needs files that live in `data` which is a symbolic link on @exrhizo's machine.. so that won't be easy

`nx run ecm:arrow`

### roam-capture

see: [libs/roam-wrangler/README.md](libs/roam-wrangler/README.md)

This is written in typescript, so we need to compile it so that

- `nx run ecm-static-data:roam-capture --verbose`
- `nx run ecm-static-data:roam-parse --verbose`
  will run

Compile like this: `npx tsc --watch tools/executors/roam-capture/impl.ts`

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

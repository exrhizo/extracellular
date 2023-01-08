# Extracellular Monorepo

### Getting Started

- Pull the obsidian CMS into `matrix`: `git submodule init`

### Obsidian as a CMS

See [matrix/README.md](matrix/README.md)

# [Cross at a Ford](http://crossataford.com) founded by @exrhizo

Run with

- `nx serve crossataford`

# Pipe My DAO

Run with

- `nx serve pipemydao`

Created with

- `nx g @nrwl/next:app pipemydao`
- `nx g @nrwl/next:page my-new-page --project=my-new-app`
- `nx g @nrwl/next:component my-new-component --project=my-new-app`
- [Nx Next Tutorial](https://nx.dev/packages/next)
- [Nx vercel deploy tutorial](https://nx.dev/recipes/other/deploy-nextjs-to-vercel)

## Commands

### NX

This project was generated using [Nx](https://nx.dev).

There are also many [community plugins](https://nx.dev/community) you could add.

Run `nx g @nrwl/react:app my-app` to generate an application.

Run `nx g @nrwl/react:lib my-lib` to generate a library.

Libraries are shareable across libraries and applications. They can be imported from `@ecm/mylib`.

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

Run `nx graph` to see a diagram of the dependencies of your projects.

```javascript
// https://davidbieber.com/snippets/2020-12-28-publishing-blog-posts-from-roam-research-quickly-and-automatically/
// https://github.com/dbieber/davidbieber.com/blob/master/.github/scripts/publish.py

// https://www.radix-ui.com/docs/primitives/overview/getting-started
// https://stitches.dev/docs/tutorials
// https://nx.dev/executors/creating-custom-builders

function publishSnippetRaw(uid, title, date, content) {
  const data = {
    event_type: 'snippet-update',
    client_payload: {
      uid: uid,
      title: title,
      date: date,
      content: content,
    },
  };
  fetch('https://api.github.com/repos/dbieber/davidbieber.com/dispatches', {
    headers: {
      Accept: 'application/vnd.github.everest-preview+json',
      Authorization: 'token PERSONAL_AUTHENTICATION_TOKEN',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}
const publishSnippet = debounce(publishSnippetRaw, 15000, true);
```

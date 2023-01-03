# roam-wrangler

This wraps `athens-roam-parser`

Currently the data massaging functionality is in `ecm-static-data` and it can be rolled into this library, once it is worked out

### Here are the commands to get going:

- `npm link athens-roam-parser`
- `npx shadow-cljs watch athens`

- `npx tsc --watch tools/executors/roam-capture/impl.ts`

- Go into [zexport in roam](https://roamresearch.com/#/app/collective-intel/page/4F2At-ui4)
- `nx run ecm-static-data:roam-capture --verbose`
- Or use the existing `roam-raw.json
- `nx run ecm-static-data:roam-parse --verbose`

- ^- configured in `libs/ecm-static-data/project.json`

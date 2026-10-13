# Free online hosting recommendation
Reviewed: 13 October 2026. Scope: recommendation only; nothing deployed or published.

## Recommendation
Use **Cloudflare Pages Free** for the existing React/Vite application. It produces a static `dist` directory and has no required backend. Static asset requests are free and unlimited when no Functions are invoked. The Free plan permits 500 builds per month, 20,000 files and 25 MiB per asset. These are service limits, not a promise that provider terms will never change.

Sources: [static pricing](https://developers.cloudflare.com/pages/functions/pricing/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

## Alternatives
| Provider | Assessment |
|---|---|
| Cloudflare Pages Free | Best fit for this static, illustration-heavy personal app. Free provider subdomain; no purchased domain needed. |
| Render Static Site | A valid free alternative for this app, with CDN delivery and automatic Git deployment. Static sites consume the workspace's outbound bandwidth and pipeline allowances. The free Web Service sleep rule does not apply to a Static Site. |
| Vercel Hobby | Good alternative for this personal, non-commercial use. Subject to its usage limits and personal-use restriction. |
| Netlify Free | Convenient, but its fixed monthly credit allowance adds usage accounting to deployments and traffic. |

Sources: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Netlify Free comparison](https://www.netlify.com/pricing/personal-vs-free/), [Cloudflare provider subdomain and uploads](https://developers.cloudflare.com/pages/get-started/direct-upload/).

Render clarification: choose **Static Site**, not Web Service, for the current frontend. A free Web Service sleeps after 15 minutes without inbound traffic; the current application needs no running server. Render is suitable for the intended personal use. Cloudflare remains the default recommendation because its static requests are free and unlimited, whereas Render counts bandwidth and build-pipeline usage. Neither choice adds cloud synchronization to browser-local records. Sources: [Render Static Sites](https://render.com/docs/static-sites), [Render free services](https://render.com/docs/free), [Render bandwidth](https://render.com/docs/outbound-bandwidth).

## Hosting and data are different
- Serving the application online does not add an account, cloud backup or phone/laptop synchronization.
- The current code writes records to localStorage, keyed to a browser and origin. Different devices, browsers and hostnames have separate journeys.
- Before leaving localhost, download a backup. Open the hosted site in the browser that will be used, inspect its empty/demo state, then restore the backup using the existing confirmation flow.
- Keep a stable production hostname. Updates at the same origin normally preserve browser data; clearing browser data still removes it. Private/incognito sessions are unsuitable for long-term records.
- The app shell and illustrations are publicly reachable unless access control is added. Personal entries remain browser-local; a private source repository does not make the website itself private.
- Publish only the generated `dist` directory. Do not upload test backups, personal exports, development captures or the entire workspace.

These conclusions follow from `src/storage.ts`, the current client-only architecture and the existing backup UI.

## Preferred route for ongoing updates
Connect a **private GitHub repository** to Cloudflare Pages. Cloudflare supports private repositories and automatically builds deployments from the configured production branch.

Proposed settings:
- Framework: React/Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Use the already tested Node 24 runtime for reproducible builds.
- Use the free `pages.dev` production address initially. A custom domain is optional and its registration is a separate cost.

The current workspace has no Git repository. Creating one, selecting distributable files, pushing source and authorizing the provider connection are deployment work, not actions taken in this planning pass. Exclude node_modules, local backups, transient captures and unrelated research artifacts from the repository. Required public assets and source remain included.

Source: [Cloudflare Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/).

## Simplest first link
Build locally and drag the contents of `dist` into a Cloudflare Pages Direct Upload project. No source repository is needed for this route. Updates require uploading a new build.

Important trade-off: Direct Upload projects cannot later switch to Git integration; automatic Git deployment requires a new project. Choose Git integration first if regular updates are expected. A new hostname would also require a backup transfer because storage is origin-specific.

Source: [Direct Upload methods and constraints](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## Checks before going live
1. Confirm current tests/build pass and publish only the production output.
2. Verify the deployed HTTPS address, artwork loading, entry creation, reload, backup download and restore preview on her phone.
3. Check the production entry URL and any shared deep links; configure SPA fallback if the routing method requires it.
4. Export existing local records and deliberately restore into the chosen production browser. Do not assume an automatic transfer.
5. Keep the stable address and regular downloadable backups. Compress large illustration sources as a subsequent performance task rather than changing character identity.

## Later, if cross-device records are required
Treat authentication and a remote database as a separate feature with permissions, backups, ownership rules and migration tests. A free frontend host alone does not supply this behavior. No backend provider has been selected or connected here.

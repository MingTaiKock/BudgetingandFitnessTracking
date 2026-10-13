# Cloudflare + GitHub setup

For Little Wins, using https://github.com/MingTaiKock/BudgetingandFitnessTracking.

## Existing Worker project (your current setup)

The current Cloudflare project is a Worker named `smallwins`, rather than a Pages project. It serves the same static app at https://smallwins.mtkock1994.workers.dev.

Under Settings > Builds, use production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy --assets ./dist`, and root directory `/`. Wrangler reads the Worker name from the repository configuration.

The repository's `wrangler.jsonc` supplies the required compatibility date and the `dist` asset directory. It also configures single-page application fallback. No server script is needed. The compatibility date selects Cloudflare runtime behavior; it is not the app's publication date.

The user approved the `smallwins.mtkock1994.workers.dev` address. The configuration enables the production workers.dev URL and keeps preview URLs disabled. Future deployments retain this choice.

The Pages instructions below are an alternative, not fields to enter in this Worker project.

## Connect the repository

1. Sign in at https://dash.cloudflare.com/ or create a free account.
2. Open **Workers & Pages**. Choose **Create application**, then **Pages**, then **Connect to Git** (wording can vary slightly).
3. Select GitHub and authorize the Cloudflare GitHub app. Choose **Only select repositories** and select **BudgetingandFitnessTracking**.
4. Back in Cloudflare, choose that repository and begin setup.
5. Enter the settings below, then choose **Save and Deploy**.

| Setting | Value |
|---|---|
| Project name | `little-wins` or another available name |
| Production branch | `main` |
| Framework preset | `None` (the explicit settings below build the Vite app) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank; package.json is at the repository root |
| Build environment variable | `NODE_VERSION` = `22.16.0` |

No application secrets or database environment variables are needed for the current app. The pinned Node version meets Vite's Node 22.12+ requirement. Cloudflare installs dependencies and builds from the repository; do not commit node_modules or dist.

Once deployment succeeds, open the actual `https://<project-name>.pages.dev` URL shown by Cloudflare. No purchased domain is needed. Test Today, My Budget, My Fitness, Settings and artwork on your phone.

## Future updates

Changes pushed to `main` trigger a new production deployment. Other branches and pull requests can produce preview deployments for reviewing changes before merging. The Cloudflare project lists build logs and deployment history.

Typical local update commands, from the project folder:

```powershell
rtk npm test
rtk npm run build
rtk git add .
rtk git commit -m "Describe the change"
rtk git push
```

The rtk prefix follows this workspace's command convention. On another computer without RTK, run the same commands without that prefix.

## Your data when moving online

Download a backup in the local app's Settings before switching URLs. The hosted app uses a different browser storage location, so restore the backup there if desired. Records remain on each browser/device; hosting does not add cloud sync. Browser animation still works on Pages.

The selected GitHub repository is public. Source code and committed artwork are visible publicly. Personal browser records are not uploaded with source code. A private repository would also work with Pages, but website access is configured separately.

## Troubleshooting

- Repository missing: check that the Cloudflare GitHub app has access to this repository and that main has been pushed.
- Build fails: open its build log; confirm build command, dist output, repository root, and NODE_VERSION.
- App changes missing: check that production uses main and the new commit deployed successfully.
- Journey missing on a phone: browser storage is separate; restore a backup to that browser.

Cloudflare currently recommends Workers for new projects generally. Pages remains documented with GitHub integration and suits this static app; these instructions specifically configure Pages as discussed.

Official references, checked 14 October 2026:

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://developers.cloudflare.com/pages/framework-guides/

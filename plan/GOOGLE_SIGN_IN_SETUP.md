# Small Wins Google sign-in setup

Database is provisioned: `smallwins` in MTBase, project `wedybltcduamanjcifta`, Singapore. The dashboard reported Healthy on 15 October 2026. The live app still saves locally until login and cloud storage are implemented and verified.

## Google OAuth client

1. Open https://console.cloud.google.com/ and select or create a dedicated project for Small Wins. Google OAuth setup does not require enabling unrelated paid Cloud APIs.
2. Open Google Auth Platform and configure the app branding as Small Wins. Supply your own support and developer contact email in Google's form.
3. Select External audience for ordinary Gmail accounts. If using Testing status, add the Google accounts that will use the app as test users, including your girlfriend's account. Do not add unrelated people.
4. Request only `openid`, `email`, and `profile` identity scopes. No Gmail or Drive access is needed.
5. Create an OAuth client of type Web application.
6. Authorized JavaScript origin:

   ```text
   https://smallwins.mtkock1994.workers.dev
   ```

7. Authorized redirect URI:

   ```text
   https://wedybltcduamanjcifta.supabase.co/auth/v1/callback
   ```

8. Save the generated client ID and client secret privately. The user must handle new credential creation and secret entry; never paste the secret into chat or commit it to GitHub.

## Supabase provider

In the Small Wins project's Authentication provider settings, configure Google with the OAuth client ID and secret, and enable Google sign-in. Keep nonce checking enabled. Do not put the Google secret in Cloudflare frontend build variables.

Set the Supabase Site URL to:

```text
https://smallwins.mtkock1994.workers.dev
```

Allow the exact app callback location chosen during implementation (the same root URL can handle PKCE return). Development callbacks must be listed explicitly when needed. Do not allow arbitrary external redirect domains.

## App implementation proposal

Review `PRIVATE_CLOUD_PERSISTENCE_DESIGN.md` before changing the app. It specifies per-account database ownership, acknowledged save status, deliberate local-data import, isolated local recovery copies, and stale-write protection. Backend creation alone does not implement these features.

## High fidelity mockup prompt

Create a high fidelity login screen for the existing Small Wins budgeting and fitness web app, in desktop and mobile variants. Match the current warm ivory background, sage and pale lavender accents, softly shaded fluffy hamsters, rounded containers, spacious typography, and quiet supportive tone. Use the existing cream Mochi and golden Chonk artwork without redesigning their faces or proportions. Heading: "Your little wins, safely saved." Supporting copy: "Sign in to keep your journey with you, on your phone and computer." Primary action: a restrained, accessible "Continue with Google" button using the correct Google mark. Secondary action: "Explore the demo". A short privacy line should say "Your records belong to your account." Do not imply partner sharing. Include a matching Settings account card with Google account email, a Sign out button, and clear state variants "Saving…", "Saved online", "Offline — changes waiting", and "Save failed — download a backup". Include a migration dialog showing "Bring your saved journey online" with a summary of existing local records, explicit Import and Start fresh choices, and a backup action. Keep all labels comfortably readable on a 390px mobile viewport and preserve visual consistency with the shipped dashboard.

Official guide: https://supabase.com/docs/guides/auth/social-login/auth-google

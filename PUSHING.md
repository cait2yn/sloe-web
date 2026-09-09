# Pushing code on cait2yn repos

This applies to any repo under the `cait2yn` GitHub account with a connected
Vercel project (this repo, `portfolio-web`, etc.). Read this before pushing —
skipping it wastes a debugging round-trip on a Vercel deploy that silently
gets stuck.

## 1. Push over SSH, never via `gh`

This machine's `gh` CLI is authenticated as `truli-admin`, a different
GitHub account from `cait2yn`. Never use `gh` (e.g. `gh pr create`,
`gh repo ...`) against a `cait2yn` repo — it can fail outright, or worse,
act under the wrong account.

Always push with plain `git` over SSH. The `~/.ssh/config` entry for
`github.com` already points at the correct key (`~/.ssh/caitlyn-li-keys`),
so a normal `git push` just works:

```
git push origin <branch>
```

## 2. Never push straight to `main` — open a PR instead

Vercel's deployment-protection check requires the **author email of the
commit sitting at the tip of `main`** to match a verified email on the
`cait2yn` GitHub account. Local commits here are authored as
`Caitlyn Li <li.caitlynj@gmail.com>`, which Vercel can't match — so a
direct push to `main` creates a deployment that gets silently stuck
(`status: UNKNOWN`, `0ms` build) and shows as **"Deployment Blocked"** on
the Vercel dashboard. No error surfaces in the terminal, which is what
makes this expensive to debug from scratch each time.

Commits merged through GitHub's own "Merge pull request" button, by
contrast, are authored as `cait <lij.caitlyn@gmail.com>` — a verified
identity — so those deploy fine.

**The fix: always land work on `main` through a PR that the user (Caitlyn)
merges herself in the GitHub UI**, never a local merge + direct push.

```
git checkout -b <descriptive-branch-name>
git commit -m "..."
git push -u origin <descriptive-branch-name>
```

Then hand over the compare URL (git prints one after the push, or use
`https://github.com/cait2yn/<repo>/pull/new/<branch>`) and wait for the
user to open and merge the PR themselves. Don't attempt to merge it
locally and fast-forward-push `main` — that reintroduces the exact
problem this file exists to avoid.

## Possible future fix

Vercel's blocked-deployment page has a "Fix Git Configuration" link,
which may let `li.caitlynj@gmail.com` be registered as a trusted/verified
email so direct pushes to `main` stop getting blocked. Until that's
confirmed done, treat the PR-per-push workflow above as required.

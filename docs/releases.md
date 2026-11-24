# Releases: where the installer lives

The Shorts Studio installer (`ShortsStudio-Setup.exe`) is **not** committed to this repo. Git blocks files over 100 MB, and the installer will be bigger. It lives on this repo's **GitHub Releases** page instead.

## How the site finds it

Every download button points to one fixed address, set once in [`assets/site.js`](../assets/site.js):

```text
https://github.com/Seifpetit/shorts-studio-site/releases/latest/download/ShortsStudio-Setup.exe
```

GitHub sends that address to the file named `ShortsStudio-Setup.exe` on the **latest** release. So the site never needs to change when a new version comes out. Until the first release exists, the buttons lead to a 404 page.

## Publishing a version by hand

1. On GitHub, open **Releases** → **Draft a new release**.
2. Tag it with the version, for example `v0.1.0`.
3. Attach the files the build produced:
   - `ShortsStudio-Setup.exe` (always exactly this name, so the download link keeps working)
   - `latest.yml` (the update feed the app reads)
   - `ShortsStudio-Setup.exe.blockmap` (lets updates download only what changed)
4. Publish it. Do not mark it as a pre-release, or it won't count as "latest".

## Publishing from the app repo (later)

Once the Electron build exists in the private `Shorts-Studio` repo, electron-builder can upload straight to this repo's Releases:

```yaml
# electron-builder.yml in Shorts-Studio
artifactName: ShortsStudio-Setup.${ext}
publish:
  provider: github
  owner: Seifpetit
  repo: shorts-studio-site
```

The build then needs a GitHub token with write access to this repo in `GH_TOKEN`. The installed app's updater reads the same Releases, so every published version reaches users on their next restart.

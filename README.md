# 🧽 @streamdevs/platform [![Deploy](https://github.com/streamdevs/platform/actions/workflows/cicd.yml/badge.svg)](https://github.com/streamdevs/platform/actions/workflows/cicd.yml)

This project is a monorepo managed with [turborepo](https://turborepo.org/).

## Project structure

- 📂 `.github/workflows` contains the configuration to lint, test and build the repo on each merge with the main branch using GitHub Actions.
- 📂 `apps`
  - 💾 [`apps/platform`](./apps/app/README.md) contains a NEXT.js project with the main app.
- 📂 `packages`
  - 💾 [`packages/tsconfig`](./packages/tsconfig/README.md) contains the common tsconfig files.
  - 💾 [`packages/ui`](./packages/ui/README.md) contains the ui library with [storybook](https://storybook.js.org/).

## License

This project is under the [CC-BY 4.0](https://github.com/streamdevs/platform/blob/main/license.md) license
clear

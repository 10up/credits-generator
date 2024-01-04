# Credits Generator

> This tiny package scans and generates a markdown command-separated list of GitHub users contributed to a repo including issue reporters, PR creators, reviewers, and all commenters.

[![Support Level](https://img.shields.io/badge/support-beta-blueviolet.svg)](#support-level) [![MIT License](https://img.shields.io/github/license/10up/credits-generator.svg)](https://github.com/10up/credits-generator/blob/trunk/LICENSE.md)

## Overview

Notes:
- This package only counts closed issues and PRs.
- This only works with GitHub repositories.

## Usage
Run this command in the root directory of a GitHub repository.

```sh
~/workspace/wpcs-action
% npx github:10up/credits-generator

[Tung Du (@dinhtungdu)](https://github.com/dinhtungdu), [Jeffrey Paul (@jeffpaul)](https://github.com/jeffpaul)
```

### Command flags:

- **`--pat`** <small>(optional)</small>

	GitHub Personal Access Token (PAT). Due to the rate limit of unauthorized API access, we may need PAT to ensure GitHub doesn't block our requests. Personal Access Token can be created [here](https://github.com/settings/tokens), no scope is required.

- **`--since`** <small>(optional)</small>

	A string value representing a date, specified in a format recognized by the `Date.parse()` method. By default, contributions are counted from the beginning. When this is set, only contributions after the given date will be queried.

- **`--no-fullName`** <small>(optional)</small>

	By default, the generated markdown includes the name of contributors. Passing this flag to only return the contributors' username. This reduces dramatically the number of API requests for the generation because we have to retrieve the name for each contributor in a separate request.

- **`--exclude`** <small>(optional)</small>

	A comma-spearated string of GitHub username to exclude from the final result.

## Support Level

**Beta:** This project is quite new and we're not sure what our ongoing support level for this will be. Bug reports, feature requests, questions, and pull requests are welcome. If you like this project please let us know, but be cautious using this in a Production environment!

## Changelog

A complete listing of all notable changes to Credits Generator are documented in [CHANGELOG.md](https://github.com/10up/credits-generator/blob/develop/CHANGELOG.md).

## Contributing

Please read [CODE_OF_CONDUCT.md](https://github.com/10up/credits-generator/blob/develop/CODE_OF_CONDUCT.md) for details on our code of conduct, [CONTRIBUTING.md](https://github.com/10up/credits-generator/blob/develop/CONTRIBUTING.md) for details on the process for submitting pull requests to us, and [CREDITS.md](https://github.com/10up/credits-generator/blob/develop/CREDITS.md) for a list of maintainers, contributors, and libraries used in this repository.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850"></a>

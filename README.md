# credits-generator

> This tiny package scans and generates a markdown command-separated list of GitHub users contributed to a repo including issue reporters, PR creators, and all commenters.


Notes:
- This package only counts closed issues and PRs.
- This only works with GitHub repositories.

## Usage
Run this command in the root directory of a GitHub repository.

```sh
~/workspace/wpcs-action
2 % npx github:10up/credits-generator --pat=ghp_personal_access_token

[Tung Du (@dinhtungdu)](https://github.com/dinhtungdu), [Jeffrey Paul (@jeffpaul)](https://github.com/jeffpaul)
```

### Command flags:

- **`--pat`** <small>(optional)</small>

	GitHub Personal Access Token (PAT). Due to the rate limit of unauthorized API access, we may need PAT to ensure GitHub doesn't block our requests. Personal Access Token can be created [here](https://github.com/settings/tokens), no scope is required.

- **`--since`** <small>(optional)</small>

	A string value representing a date, specified in a format recognized by the Date.parse() method. By default, contributions are counted from the beginning. When this is set, only contributions after the given date will be queried.

- **`--no-fullName`** <small>(optional)</small>

	By default, the generated markdown includes the name of contributors. Passing this flag to only return the contributors' username. This reduces dramatically the number of API requests for the generation because we have to retrieve the name for each contributor in a separate request.

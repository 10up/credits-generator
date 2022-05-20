#!/usr/bin/env node
import meow from "meow";
import { execa } from "execa";
import { Octokit } from "octokit";

async function run() {
	const cli = meow(
		`
	Usage
	  $ credits-generator

	Options:
	  --pat         Personal access token.
	  --since       Date string to query contribution from.
	  --no-fullName Do not include full name in the output.
	  --exclude     Comma-separated string of GitHub usernames.
`,
		{
			importMeta: import.meta,
			flags: {
				pat: {
					type: "string",
				},
				since: {
					type: "string",
					default: "",
				},
				fullName: {
					type: "boolean",
					default: true,
				},
				exclude: {
					type: "string",
					default: "",
				},
			},
		}
	);

	const octokit = new Octokit({
		...(cli.flags.pat ? { auth: cli.flags.pat } : {}),
	});

	const since = cli.flags.since ? new Date(cli.flags.since).toISOString() : "";

	async function getRepoInfo() {
		const { stdout } = await execa("git", [
			"config",
			"--get",
			"remote.origin.url",
		]);

		let result = /:(\w+)\/([A-Za-z0-9-_]+)/.exec(stdout);

		if (!result) {
			result = /github.com\/(\w+)\/([A-Za-z0-9-_]+)/.exec(stdout);
		}

		if (!result) {
			return null;
		}

		return {
			owner: result[1],
			name: result[2],
		};
	}

	async function getIssues(issues = [], page = 1) {
		const repo = await getRepoInfo();
		const batch = await octokit.request("GET /repos/{owner}/{repo}/issues", {
			owner: repo.owner,
			repo: repo.name,
			direction: "asc",
			sort: "created",
			state: "closed",
			per_page: 100,
			page: page,
			...(since ? { since } : {}),
		});

		if (batch.status !== 200) {
			return issues;
		}

		const newIssues = batch.data;

		if (newIssues.length >= 100) {
			return await getIssues(issues.concat(newIssues), page + 1);
		}

		return issues.concat(newIssues);
	}

	async function getIssueComments(comments = [], page = 1) {
		const repo = await getRepoInfo();
		const batch = await octokit.request(
			"GET /repos/{owner}/{repo}/issues/comments",
			{
				owner: repo.owner,
				repo: repo.name,
				per_page: 100,
				page: page,
				...(since ? { since } : {}),
			}
		);

		if (batch.status !== 200) {
			return comments;
		}

		const newComments = batch.data;

		if (newComments.length >= 100) {
			return await getIssueComments(comments.concat(newComments), page + 1);
		}

		return comments.concat(newComments);
	}

	async function getReviews(pulls, reviews = []) {
		if (pulls.length === 0) {
			return reviews;
		}

		const repo = await getRepoInfo();
		const current = pulls.shift();
		const newReviews = await octokit.request(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
			{
				owner: repo.owner,
				repo: repo.name,
				pull_number: current.number,
			}
		);

		if (pulls.length == 0) {
			return [...reviews, ...newReviews.data];
		}

		return await getReviews(pulls, [...reviews, ...newReviews.data]);
	}

	async function getReviewComments(comments = [], page = 1) {
		const repo = await getRepoInfo();
		const batch = await octokit.request(
			"GET /repos/{owner}/{repo}/pulls/comments",
			{
				owner: repo.owner,
				repo: repo.name,
				per_page: 100,
				page: page,
				...(since ? { since } : {}),
			}
		);

		if (batch.status !== 200) {
			return comments;
		}

		const newComments = batch.data;

		if (newComments.length >= 100) {
			return await getReviewComments(comments.concat(newComments), page + 1);
		}

		return comments.concat(newComments);
	}

	async function getUserFullName(user) {
		const { data } = await octokit.request("GET /users/{user}", {
			user: user,
		});

		return data.name || user;
	}

	const issues = await getIssues();
	const pulls = issues.filter((issue) => issue.pull_request);
	const reviews = await getReviews(pulls);

	const comments = await getIssueComments();
	const reviewComments = await getReviewComments();

	const issueUrls = issues.map((issue) => issue.url);
	const pullUrls = pulls.map((pull) => pull.pull_request.url);

	const authors = issues.map((issue) => issue.user.login);
	const reviewers = reviews.map((review) => review.user.login);

	/**
	 * Filter only comments belong to closed issues and pull requests.
	 */
	const commenters = comments
		.filter((comment) => issueUrls.includes(comment.issue_url))
		.map((comment) => comment.user.login);
	const reviewerCommenters = reviewComments
		.filter((comment) => pullUrls.includes(comment.pull_request_url))
		.map((comment) => comment.user.login);

	let contributors = [
		...new Set([
			...authors,
			...reviewers,
			...commenters,
			...reviewerCommenters,
		]),
	];

	const excludedContributors = cli.flags.exclude.split(",");

	contributors = contributors.filter((contributor) => {
		return !excludedContributors.includes(contributor);
	});

	const creditLines = await Promise.all(
		contributors.map(async (contributor) => {
			if (cli.flags.fullName) {
				const fullName = await getUserFullName(contributor);
				return `[${fullName} (@${contributor})](https://github.com/${contributor})`;
			}
			return `@${contributor}`;
		})
	);

	console.log(creditLines.join(", "));
}

run();

#!/usr/bin/env node
import meow from 'meow';

const cli = meow(`
	Usage
	  $ credits-updater [input]
`, {
	flags: {}
});

console.log(moduleName(cli.input[0] || '10up', cli.flags));

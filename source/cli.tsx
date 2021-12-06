#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";

import App from "./ui";

//@ts-ignore
const cli = meow(
	`
	Usage
	  $ mentura-ink

	Options
		--text  Your matching text
		--pattern Your matching pattern

	Examples
	  $ mentura-ink --text abcd --pattern ab+
	  Given text: abcd
	  Given pattern: cd+
	  The pattern matches
`,
	{
		flags: {
			text: {
				type: "string",
			},
			pattern: {
				type: "string",
			},
		},
	}
);

render(<App text={cli.flags.text} pattern={cli.flags.pattern} />);

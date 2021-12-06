// Helper function to check if the character is of these type
function isQuestion(char: string): boolean {
	return char === "?";
}
function isPlus(char: string): boolean {
	return char === "+";
}
function isStar(char: string): boolean {
	return char === "*";
}
function isEscape(char: string): boolean {
	return char === "\\";
}
function isSyntax(char: string): boolean {
	return isQuestion(char) || isPlus(char) || isStar(char);
}
function isOpenParentheses(char: string): boolean {
	return char === "(";
}
function isCloseParentheses(char: string): boolean {
	return char === ")";
}
// To compare the first character of given text and pattern
function isMatch(text: string, pattern: string): boolean {
	return pattern[0] === text[0];
}
// Pattern start with "?","+" and "*" is not valid
function isValidPattern(head: string): boolean {
	if (head[0]) {
		return !isQuestion(head[0]) && !isPlus(head[0]) && !isStar(head[0]);
	}
	return false;
}
// Check the first and last character for "(" and ")"
function isGroup(head: string): boolean {
	if (head[0] && head.length > 1) {
		return (
			isOpenParentheses(head[0]) &&
			isCloseParentheses(head[head.length - 1] as string)
		);
	}
	return false;
}
// return group content
function extractGroup(head: string): string {
	return head.slice(1, head.length - 1);
}
// Split the pattern into smaller chunk
// head: the first chunk consist of a character
// or a group which is placed inside parentheses
// or the 2 first character if fisrt character is escape
// syntax: is one of "?","+" and "*"
// rest: is the rest of the pattern
function splitPattern(
	pattern: string
): [head: string, syntax: string, rest: string] {
	let head = "";
	let syntax = "";
	let rest = "";
	let restStartPos = 0;
	if (isOpenParentheses(pattern[0] as string)) {
		const [, matchPos] = checkMatch(pattern, ")");
		restStartPos = matchPos + 1;
		head = pattern.slice(0, restStartPos);
	} else if (isEscape(pattern[0] as string)) {
		restStartPos = 2;
		head = pattern.slice(0, restStartPos);
	} else {
		restStartPos = 1;
		head = pattern.slice(0, restStartPos);
	}
	if (isSyntax(pattern[restStartPos] as string)) {
		syntax = pattern[restStartPos] as string;
		restStartPos++;
	}
	rest = pattern.slice(restStartPos);
	return [head, syntax, rest];
}

// minMatchLength: 0 mean not need to match, 1 mean must have 1
// maxMatchLength: 0 mean match only 1, 1 mean more than 1
function matchMultiple(
	text: string,
	pattern: string,
	matchLength: number,
	minMatchLength = 0,
	maxMatchLength = 0
): [matched: boolean, matchLength: number] {
	let [head, syntax, rest] = splitPattern(pattern);
	// If it's a group, only compare the inner content
	if (isGroup(head)) {
		head = extractGroup(head);
	}
	// set submatchLength = 0 to start matching from 1 head in the while loop
	let submatchLength = 0;
	if (isQuestion(syntax)) {
		const [subpatternMatched] = matchPattern(
			text,
			head.repeat(submatchLength + 1),
			matchLength
		);
		if (subpatternMatched) {
			submatchLength++;
		}
	} else {
		while (maxMatchLength) {
			const [subpatternMatched] = matchPattern(
				text,
				head.repeat(submatchLength + 1),
				matchLength
			);

			if (subpatternMatched) {
				submatchLength++;
			} else {
				break;
			}
		}
	}
	while (submatchLength >= minMatchLength) {
		const [matched, newMatchLength] = matchPattern(
			text,
			head.repeat(submatchLength) + rest,
			matchLength
		);
		if (matched) {
			return [matched, newMatchLength];
		}
		submatchLength--;
	}
	return [false, 0];
}

// Only compare the inter content of the group
function matchGroup(
	text: string,
	pattern: string,
	matchLength: number
): [matched: boolean, matchLength: number] {
	const [head] = splitPattern(pattern);
	const groupContent = extractGroup(head);
	const [matched, groupMatchLength] = matchPattern(
		text,
		groupContent,
		matchLength
	);
	if (matched) {
		return [matched, groupMatchLength];
	}
	return [false, 0];
}
// Match specific syntax
// Each syntax will have different property
// Which will be passed to matchMultiple
function matchQuestion(
	text: string,
	pattern: string,
	matchLength: number
): [matched: boolean, matchLength: number] {
	return matchMultiple(text, pattern, matchLength, 0, 0);
}
function matchPlus(
	text: string,
	pattern: string,
	matchLength: number
): [matched: boolean, matchLength: number] {
	return matchMultiple(text, pattern, matchLength, 1, 1);
}
function matchStar(
	text: string,
	pattern: string,
	matchLength: number
): [matched: boolean, matchLength: number] {
	return matchMultiple(text, pattern, matchLength, 0, 1);
}

// Compare the given text and pattern. Return true,
//  when the match length when the pattern is
// else return false with 0 match length
function matchPattern(
	text: string,
	pattern: string,
	matchLength = 0
): [matched: boolean, matchLength: number] {
	let currentMatchLength = matchLength;
	if (!pattern.length) {
		return [true, currentMatchLength];
	}
	const [head, syntax, rest] = splitPattern(pattern);
	if (isQuestion(syntax)) {
		return matchQuestion(text, pattern, currentMatchLength);
	} else if (isPlus(syntax)) {
		return matchPlus(text, pattern, currentMatchLength);
	} else if (isStar(syntax)) {
		return matchStar(text, pattern, currentMatchLength);
	} else if (isGroup(head)) {
		return matchGroup(text, pattern, currentMatchLength);
	} else if (isValidPattern(head)) {
		if (isEscape(head[0] as string)) {
			if (isMatch(text, pattern[1] as string)) {
				return matchPattern(text.slice(1), rest, currentMatchLength + 1);
			}
		}
		if (isMatch(text, pattern)) {
			return matchPattern(text.slice(1), rest, currentMatchLength + 1);
		}
		return [false, 0];
	}
	return [false, 0];
}

// Compare the text and pattern, and return
// if it's matched, the position of match and the match length
function checkMatch(
	text: string,
	pattern: string
): [matched: boolean, matchPos: number, matchLength: number] {
	let matched = false;
	let matchLength = 0;
	let matchPos = 0;
	const maxMatchPos = text.length - 1;
	// If it's not matched and it is not the end of the string
	// it will call matchPattern. When matchPattern return false
	// the loop continue. In each loop, one character in the text
	// will be skipped.
	while (!matched && matchPos <= maxMatchPos) {
		[matched, matchLength] = matchPattern(text.slice(matchPos), pattern);
		if (matched) {
			return [matched, matchPos, matchLength];
		}
		matchPos++;
	}
	return [false, 0, 0];
}

export { checkMatch, isSyntax };

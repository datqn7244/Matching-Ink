import React from "react";
import { Box, Text } from "ink";
import { checkMatch, isSyntax } from "../utils/matchingFunction";

const ShowMatch: React.FC<{ text: string; pattern: string }> = ({
	text,
	pattern,
}) => {
	if (isSyntax(pattern[0] as string)) {
		return (
			<Box borderStyle="double" flexDirection="column" borderColor="red">
				<Text color="red">
					The pattern cannot start with a syntax "?", "+", "*"
				</Text>
			</Box>
		);
	}
	const [matched] = checkMatch(text, pattern);
	return (
		<Box borderStyle="double" flexDirection="column">
			<Text>
				Given text:
				<Text color="blue"> {text}</Text>
			</Text>
			<Text>
				Given pattern:
				<Text color="blue"> {pattern}</Text>
			</Text>
			{matched ? (
				<Text>
					The pattern <Text color="green">matches</Text>
				</Text>
			) : (
				<Text>
					The pattern <Text color="red">does not match</Text>
				</Text>
			)}
		</Box>
	);
};

export default ShowMatch;

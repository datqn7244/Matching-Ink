import React from "react";
import { Text, Box, useFocus, useInput } from "ink";

const InkButton: React.FC<{
	buttonText: string;
	onSubmit: () => void;
}> = ({ buttonText, onSubmit }) => {
	const { isFocused } = useFocus();
	useInput((_input, key) => {
		if (key.return && isFocused) {
			onSubmit();
		}
	});

	return (
		<Box marginRight={2} alignSelf="flex-end">
			<Box
				borderStyle={"round"}
				borderColor={isFocused ? "blue" : "white"}
				paddingX={2}
			>
				<Text
					color={isFocused ? "blue" : "white"}
					bold={true}
					underline={isFocused}
				>
					{buttonText}
				</Text>
			</Box>
		</Box>
	);
};

export default InkButton;

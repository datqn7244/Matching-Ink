import React, { FC } from "react";
import { Form } from "ink-form";

type formInput = {
	text: string;
	pattern: string;
};

const FormInput: FC<{
	setText: React.Dispatch<React.SetStateAction<string>>;
	setPattern: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setText, setPattern }) => {
	return (
		<Form
			onSubmit={(value) => {
				const { text, pattern } = value as formInput;
				setText(text);
				setPattern(pattern);
			}}
			form={{
				title: "Matching Test",
				sections: [
					{
						title: "Input text and pattern",
						fields: [
							{
								type: "string",
								name: "text",
								label: "Text to match",
								initialValue: "",
							},
							{
								type: "string",
								name: "pattern",
								label: "Pattern",
								description:
									"The pattern support these following syntax:\n?: matches any one character\n+: matches one or more characters\n*: matches zero or more characters\n(): to group character\n\\ to escapes character",
							},
						],
					},
					{
						title: "Help Section",
						description: [
							"This program purpose is to determine if the given text contain a substring that match with the given pattern.",
							"The pattern support these following syntax:",
							"?: matches any one character",
							"+: matches one or more characters",
							"*: matches zero or more characters",
							"(): to group character",
							"\\ to escapes character",
						],
						fields: [],
					},
				],
			}}
		/>
	);
};

export default FormInput;

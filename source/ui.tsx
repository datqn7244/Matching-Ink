import React, { FC, useState } from "react";
import { useApp } from "ink";

import ShowMatch from "./component/showMatch";
import FormInput from "./component/FormInput";
import InkButton from "./component/InkButton";

const App: FC<{ text?: string; pattern?: string }> = ({
	text = "",
	pattern = "",
}) => {
	const [inputText, setText] = useState<string>(text);
	const [inputPattern, setPattern] = useState<string>(pattern);
	const { exit } = useApp();
	if (text && pattern) {
		return <ShowMatch text={text} pattern={pattern} />;
	}
	return (
		<>
			<InkButton buttonText="Exit program" onSubmit={exit} />
			{inputText && inputPattern ? (
				<ShowMatch text={inputText} pattern={inputPattern} />
			) : (
				<></>
			)}
			<FormInput setText={setText} setPattern={setPattern} />
		</>
	);
};

export default App;

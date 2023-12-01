function formatConvHistory(messages) {
	return messages
		.map((message, i) => {
			if (i % 2 === 0) {
				return `Humans: ${message}`;
			} else {
				return `AI ${message}`;
			}
		})
		.join("\n");
}

export { formatConvHistory };

exports.handler = (event, context, callback) => {
	const {id, name} = event.queryStringParameters;

	let filtered = data;
	if (id) {
		filtered = filtered.filter(e => e.id == id);
	}
	if (name) {
		filtered = filtered.filter(e => e.name == name);
	}

	callback(null, {
		statusCode: 200,
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(filtered),
	});
};

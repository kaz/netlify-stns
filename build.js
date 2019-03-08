"use strict";

const fs = require("fs-extra");
const fetch = require("node-fetch");

const entries = require("./entries").filter(e => e.enabled);

(async () => {
	const users = await Promise.all(entries.map(async ({id, name}) => {
		return {
			name,
			id,
			password: "",
			group_id: id,
			directory: "",
			shell: "",
			gecos: "",
			keys: (await fetch(`https://github.com/${name}.keys`).then(r => r.text())).trim().split("\n"),
		};
	}));
	const groups = await Promise.all(entries.map(async ({id, name}) => {
		return {
			name,
			id,
			users: [name],
		};
	}));

	groups.push({
		name: "sysad",
		id: 60000,
		users: entries.map(e => e.name),
	});

	const rawjs = await fs.readFile("raw.js");

	await fs.ensureDir("functions");
	await fs.writeFile("functions/users.js", Buffer.concat([
		Buffer.from("const data = "),
		Buffer.from(JSON.stringify(users)),
		Buffer.from(";\n"),
		rawjs,
	]));
	await fs.writeFile("functions/groups.js", Buffer.concat([
		Buffer.from("const data = "),
		Buffer.from(JSON.stringify(groups)),
		Buffer.from(";\n"),
		rawjs,
	]));
})();

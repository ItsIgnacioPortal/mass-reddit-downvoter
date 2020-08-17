"use strict";
const fs = require("fs");	//Added to check for targets.default
const snoowrap = require("snoowrap");
const moment = require("moment");
const argv = require("yargs")
	.options({
		targets: {
			alias: "t",
			describe: "User you want to target with your program",
			demandOption: true,
			type: "array",
			default: []
		},
		limit: {
			alias: "l",
			default: 50,
			demandOption: true,
			type: "number",
			describe:
				"The number of comments you would like to have downvoted. Comments older than 1 month cannot be downvoted."
		}
	})
	.help().argv;
const credentials = require("./client_credentials.json");

// NOTE: Hardcoding credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper

// Use client_credentials.json to pass in credentials

const r = new snoowrap(credentials);
	
r.config({ retryErrorCodes: [503] });


var targets = argv.targets;
var defaultTargets = [];

//If targets.default exists
if (fs.existsSync("targets.default")) {
	
	//read the file according to the platform
	if (process.platform === "win32"){
		//Read from file, and save as an array, spliting on carriage returns followed by linejumps
		defaultTargets = fs.readFileSync("targets.default", 'utf8').split('\r\n');

	} else {
		//Read from file, and save as an array, spliting on linejumps
		defaultTargets = fs.readFileSync("targets.default", 'utf8').split('\n');

	}

	//Append defaultTargets to existing targets
	defaultTargets.forEach(function(item) {
		targets.push(item);
	})

	console.log("Loaded "+targets+" from targets.default");
}

let messages = [];

let downvotePromises = [];

const getData = async () => {
	const targetsToMap = await targets.map(async (target, index, array) => {
		console.log(`Starting to downvote ${target}`);

		messages.push({
			target: target,
			successfullyDownvoted: 0,
			olderThanThirty: 0,
			fiveOhThreeErrors: 0
		});
		await r
			.getUser(target)
			.getComments({ limit: argv.limit })
			.then(comments =>
				comments.map(comment => {
					if (
						moment.utc().diff(moment.unix(comment.created_utc), "days") > 30
					) {
						++messages[index].olderThanThirty;
					} else {
						downvotePromises.push(
							r
								.getComment(comment.id)
								.downvote()
								.then(++messages[index].successfullyDownvoted)
								.catch(function(err) {
									++messages[index].fiveOhThreeErrors;
								})
						);
					}
				})
			)
			.catch(console.log);

		return messages;
	});

	Promise.all(targetsToMap)
		.then(downvotingResults =>
			console.log("complete", new Set(downvotingResults[0]))
		)
		.catch(console.log);
};

getData();

# petty-reddit-downvoter

For those of us who enjoy things like [/r/pettyrevenge](https://www.reddit.com/r/pettyrevenge/), this is a NodeJS CLI tool that uses [snoowrap](https://github.com/not-an-aardvark/snoowrap) to downvote people that annoy you... or whatever. 

# Installing
1. `git clone repo`
2. `cd petty-reddit-downvoter`
3. `yarn` or `npm install`
4. Add credentials in `client_credentials.json`
	- If you do not have reddit credentials you can get your oauth2 client id and client secret using [Reddit's Guide](https://github.com/reddit/reddit/wiki/OAuth2)

# Usage

`node downvoter.js [--targets val1 val2] [-l 50]`

`-t`/`--targets target1 target2 target3`    
This argument specifies users to downvote, separated by a space.    
DEFAULT: targets are loaded from `targets.default`.

`-l`/`--limit number`    
Specifies how many comments will be downvoted.
Remember that only comments made within the past month will be downvoted; See the future updates section below about expectations for better error handling and reporting in the future.    
DEFAULT: 50

Example: `node index.js --targets F0REM4N spez gallowboob --limit 69`

# Notes on functionality
The current setup of PRD should avoid calls to comments older than 30 days. If all targets are downvoted successfully you'll get an stdout object letting you know the results of the PRD in an array called `messages` of objects structured as
```
{
	target: nameOfTarget,
	successfullyDownvoted: count,
		olderThanThirty: count of comments older than 30 days,
		fiveOhThreeErrors: count of 503 errors encountered while downvoting
}
```
Please note that `messages[index].fiveOhThreeErrors` only includes a count of downvotes that threw 503s and not entire targets. If the entire target request throws a 503 error, stdout will print a message that says `There was a 503 error (reddit is busy) when trying to downvote gallowboob. Try getting petty with it later and make sure to spam the shit out of reddit admins in a pettyway about how bad their servers are.This is what was done before the error [messages]`. This is somewhat ugly because if you catch several 503 errors it makes the console messy. 

If you are expecting to downvote more than 600 posts in 10 minutes, add the key-value pair `requestDelay: 1000` to the `r.config({})` object to avoid API ratelimit errors. 

# future updates
1. Submission downvotes.
	- The script will not downvote submissions, just comments.

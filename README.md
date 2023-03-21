# Mass Reddit Downvoter    
![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https%3A%2F%2Fgithub.com%2FItsIgnacioPortal%2Fmass-reddit-downvoter)     
This is a NodeJS CLI tool that uses snoowrap to downvote comments on reddit. It can take mutiple targets at a time, and *may* downvote up to 250 comments in less than 3 seconds! 

## Installing
1. `git clone https://github.com/ItsIgnacioPortal/mass-reddit-downvoter.git`
2. `cd mass-reddit-downvoter`
3. `yarn` or `npm install`
4. Add credentials in `client_credentials.json`    
	To get these credentials, you need to make a **script app** on reddit. For more info, check out [Reddit's Guide](https://github.com/reddit/reddit/wiki/OAuth2)
	
	First, go to https://www.reddit.com/prefs/apps and press the [Create an App] button. Fill in the text fields as follows:
	- **Name**: `mass-downvoter`
	- **redirect URI**: `https://github.com/ItsIgnacioPortal/mass-reddit-downvoter`
	- **description (optional)**: `To give downvotes massively`
	- **About URL (optional)**: `https://github.com/ItsIgnacioPortal/mass-reddit-downvoter`

	After you have created your app, it should look a bit like this:
	![example-app-img](https://github.com/ItsIgnacioPortal/mass-reddit-downvoter/blob/master/example-app.jpg?raw=true)

	Once you've created your app, you have to **authorize** it to have access to your account. To do this, copy the URL below on a text editor and replace `myClientID` with your actual client ID (Marked with a **red arrow** on the example):     
	`https://www.reddit.com/api/v1/authorize?client_id=myClientID&response_type=code&duration=permanent&scope=vote&state=banana&redirect_uri=https://github.com/ItsIgnacioPortal/mass-reddit-downvoter#usage`
	and slap that *authorize* button.
	
	Once that's done, you have all the credentials you need to start using the script!
	- **client Id**: marked with a **red arrow** on the image
	- **client secret**: marked with a **blue arrow** on the image
	- **username**: marked with a **green arrow** on the image
	- **password**: password of your reddit account. Only you know it *(hopefully)*
	
## Usage

`node downvoter.js [--targets val1 val2] [-l 50]`

`-t`/`--targets target1 target2 target3`    
This argument specifies users to downvote, separated by a space.    
DEFAULT: targets are loaded from `targets.default`.

`-l`/`--limit number`    
Specifies how many comments will be downvoted.
Remember that only comments made within the past month will be downvoted; See the future updates section below about expectations for better error handling and reporting in the future.    
DEFAULT: 50

Example: `node index.js --targets F0REM4N spez gallowboob --limit 69`

## Notes on functionality
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

## Special thanks

This project is heavily based off of [Mike Duran Mitchell's petty-reddit-downvoter](https://github.com/mike-duran-mitchell/petty-reddit-downvoter).
However, multiple additions and fixes have been done to this new repository, such as:

- Cleaner code (Removed unused variables; Fixed indentation)
- Load targets from `targets.default`
- A lot more documentation on usage
- Bugfixes (bad JSON format)
- etc

/*

	Simple wrapper around logging

	Idea:
	- Create a util logger that either sends to Winston, console.log, or both, and smart enough to route server side or not? Maybe alongside an analytics engine, or maybe they could be both?
    - Events triggered analytics and logger engine?
    - Using the Winston format but adding a simple event registration system like Mixpanel


	Last updated: 8/8/2020
	
*/



export const logger = (...args) => {
	/*

		Logger wrapper
		- if opts is a string, it's showing the "source" of the log

	*/
	let source, quiet
	if(typeof opts == 'string') // if opts is a string
		source = opts

	if(typeof opts == 'object') { // otherwise destruct it
		source = opts['source']
		quiet = opts['quiet'] // if quiet, only report errors
		// track events here?
	}

	if(!quiet)
		console.log(...args)
		// console.log(args.splice(0,1)) // remove first arg, and print the others
		// console.log('[logger]', data)
}




export const logerror = (args) => {
	/*

		Error Logger wrapper
		- if opts is a string, it's showing the "source" of the log

	*/
	let source, quiet
	let opts = args[0] // first arg is always the options
	if(typeof opts == string) // if opts is a string
		source = opts

	if(typeof opts == object) { // otherwise destruct it
		source = opts['source']
		quiet = opts['quiet'] // if quiet, only report errors
		// track events here?
	}

	if(!quiet)
		console.error(args.splice(0,1)) // remove first arg, and print the others
		// console.log('[logger]', data)
}




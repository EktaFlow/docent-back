const criteria2016 = require("../assets/2016");
// parsing criteria...
var versions = criteria2016[0];

versions = versions.versions;
var threads = versions[0].threads;


// filter the threads selected for the assessment
function getThreads(arr) {
	return threads.filter(thread => arr.includes(Number(thread.threadId)))
}

// Array of Thread names to correspond with the menu to select which threads
// a user will include on their assessment.
var allThreadNames = () => threads.map(thread => thread.name)	


// turn nested assessment structure into flat questions array
function drillQuestions(threads, level) {
questions = [];
threads.forEach(thread => {
	var threadId	 = thread.threadId,
		threadName = thread.name,
		  threadHelp = thread.helpText;

			thread.subThreads.forEach( z => {
				var subThreadName = z.name,
		    subThreadId				= z.subThreadId;

				z.subThreadLevels.forEach(b => {
					var subThreadLevelId = b.subThreadLevelId,
					mrLevel      = b.level,
					criteriaText = b.criteriaText,
					helpText     = b.helpText;

					// TODO: remove this level conditional		//
					// need all qs in assessment 17-08-18 mpf //
					if (Number(b.level) > level) {
						b.questions.forEach( c => {
							questions.push({
								threadId,
								threadName,
								threadHelp,
								subThreadName,
								subThreadId,
								subThreadLevelId, // we don't use this one.
								mrLevel,
								criteriaText,
								helpText,
								questionId:		c.questionId,
								questionText: c.questionText
							});
						})
					}
				});
			})
});
	return questions;
}

function getQuestions(threadsArray, level) {
	var threads = getThreads(threadsArray);
	return drillQuestions(threads, level);
}

module.exports = { getQuestions, allThreadNames };

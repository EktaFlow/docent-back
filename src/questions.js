const criteria2016 = require("../assets/2016");
// parsing criteria...
var versions = criteria2016[0];
versions = versions.versions;
var threads = versions[0].threads;

function getThreads(arr) {
	return threads.filter(thread => arr.includes(Number(thread.threadId)))
}

var allThreadNames = () => threads.map(thread => thread.name)

function drillQuestions(threads, level) {
questions = [];
threads.forEach(thread => {
	var threadId = thread.threadId,
			threadName = thread.name,
		  threadHelp = thread.helpText;
	thread.subThreads.forEach( z => {
		var subThreadName = z.name,
		    subThreadId   = z.subThreadId;
			z.subThreadLevels.forEach(b => {
				var subThreadLevelId = b.subThreadLevelId,
						mrLevel = b.level,
						criteriaText = b.criteriaText,
						helpText = b.helpText;
				if (Number(b.level) > level) {
					b.questions.forEach( c => {
					questions.push({
						threadId,
						threadName,
						threadHelp,
						subThreadName,
						subThreadId,
						subThreadLevelId,
						mrLevel,
						criteriaText,
						helpText,
						questionId: c.questionId,
						questionText: c.questionText
					})
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

const mongoose  = require("mongoose");
const getQuestions = require("./questions");
const models = require("./schema/mongoose");
const ConnectionString = require("./constants").ConnectionString;
mongoose.connect(ConnectionString);

const {Assessment} = models;

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function() {
	console.log("Connected to DB"); })

//////////// mongo _ids are not strings, but instances of /////////////
/////////// the ObjectId type.
var make_id = idString => mongoose.Types.ObjectId(idString)

var resolvers = {
	Query: {
		allThreadNames: () => getQuestions.allThreadNames(),
		assessment: async(root, args, context, info) => {
			return Assessment.findById(args._id);
		},
		assessments: async(root, args, context, info) => {
			var {userId} = args;
			return Assessment.find({ userId });
		},
		getShared: async(root, args, context, info) => {
			var {assessments} = args;
			var shared = await assessments.map(async assess => {
				return await Assessment.findById(assess)
			});

			return shared;
		},
		question: async(root, args, context, info) => {
			var assessment = await Assessment.findById(args.assessmentId);
			var question = assessment.questions.filter(a => a.questionId == args.questionId);
			return question[0]
		}
	},
	Mutation: {
		importAssessment: async(roots, args, context, info) => {
			var stringifiedAssessment = args.import
			var parsedAssessment      = JSON.parse(stringifiedAssessment);
			var assessment            = parsedAssessment.assessment
		  var importedAssessment    = await Assessment.create(assessment);

			return importedAssessment;
	},
		createAssessment: async(roots, args, context, info) => {
			args.currentMRL = args.targetMRL;
			var schema = JSON.parse(args.schema);
			// var schema = require('../assets/2016.json');
			args.questions = getQuestions.getQuestions(schema);

			// TODO: test if this works without await <21-07-18, yourname> //
		  return await Assessment.create(args);
		},
		addFile: async(root, args, context, info) => {
			var assessment = await Assessment.findById(args.assessmentId);
			assessment.files.push({name: args.name, url: args.url, questionId: args.questionId})
			return assessment.save();
		},
		updateAssessment: async(root, args, context, info) => {
			let _id = make_id(args._id)
			let assessment = await Assessment.findById(_id);
			let question = assessment.questions
											         .find(question => question.questionId == args.questionId);

			// updateObject(question, args.updates);
			var answerList = addAnswer(question, args.updates, args.userId);
			question.answers = answerList;

			return assessment.save();
		},

		deleteAssessment: async(root, args, context, info) => {
			let _id = make_id(args._id)
			let assessment = await Assessment.findById(_id);
			assessment.remove();

		},

		addTeamMember: async(root, args, context, info) => {
			let _id = make_id(args._id);
			let assessment = await Assessment.findById(_id);
			let newTeamMember = args._teamMember;
			var newTeamMembers = [...assessment.teamMembers, newTeamMember];
			updateObject(assessment.teamMembers, newTeamMembers);
			assessment.save();


			// var updatedUser = await user.set({
			// 	jsonFiles: newFiles
			// });
		}
	}
}


function updateObject(original, newObject) {
	for ( key in newObject ) {
		original[key] = newObject[key]
	}
	return original;
}

async function addAnswer(question, newAnswers, userId){
	//need to only send needed answer properties, not the whole question object
	var addedAnswer = await Answer.create(newAnswers);
	addedAnswer.userId = userId;
	addedAnswer.updatedAt = getUpdatedAtTime();

	addedAnswer.save();
	var newAnswersList = [...question.answers, addedAnswer];
	return newAnswersList;
}

function getUpdatedAtTime(){
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return dateTime = date+' '+time;

}

module.exports = resolvers;

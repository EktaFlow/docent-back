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
			console.log(args.teamMembersUpdates);

			// var schema = require('../assets/2016.json');
			args.questions = getQuestions.getQuestions(schema);
			var teamMembers = args.teamMembersUpdates;
			args.teamMembers = args.teamMembersUpdates;

			// TODO: test if this works without await <21-07-18, yourname> //
		  return await Assessment.create(args);
		},
		addFile: async(root, args, context, info) => {
			var assessment = await Assessment.findById(args.assessmentId);
			assessment.files.push({name: args.name, url: args.url, questionId: args.questionId})
			return assessment.save();
		},

    updateAssessmentMeta: async(root, args, context, info) => {
            console.log('we here');
            var assessment = await Assessment.findById(args._id);
            console.log(assessment.name);
            console.log(args);
//            var coolness = Object.assign(assessment, ...args.assessmentUpdate)
 //           console.log(coolness.name);
            for (let prop in args.assessmentUpdate) {
                    assessment[prop] = args.assessmentUpdate[prop]
            }


           console.log(assessment);
           return assessment.save();

    },

		updateAssessment: async(root, args, context, info) => {
			// console.log(args);
			let _id = make_id(args._id)
			let assessment = await Assessment.findById(_id);
			let question = assessment.questions
											         .find(question => question.questionId == args.questionId);


							/// separate out question args & answer args
							// only need to take out currentAnswer out of 'updates' and update that on the question
							//send the rest of the values in 'updates' to addAnswer

							//currentAnswer = args.updates.currentAnswer;
							//delete args.updates.currentAnswer;
            //
          console.log(args)
					// console.log(args.questionUpdates.currentAnswer);
      if ( args.questionUpdates ) {
			   question.currentAnswer = args.questionUpdates.currentAnswer;
      }

			// updateObject(question, args.updates);
			// var answerList = addAnswer(question, args.answerUpdates, assessment);
			// console.log(question.answers);
			question.answers.push(args.answerUpdates);
			// console.log(question.answers);
			var temp = assessment.questions.filter(q => q.questionId == args.questionId);
			// console.log(temp[0].answers);
			// console.log(temp);
			// question.answers = answerList;
			return assessment.save();
		},

		deleteAssessment: async(root, args, context, info) => {
			let _id = make_id(args._id)
			let assessment = await Assessment.findById(_id);
			assessment.remove();

		},

    deleteFile: async(root, args, context, info) => {
      var assessment = await Assessment.findById(args.assessmentId);
      var removedFile = assessment.files.filter(a => a._id != args.fileId);
      assessment.files = removedFile;
      assessment.save( (err, ass) =>{
              return ass
      })
    },

		addTeamMember: async(root, args, context, info) => {
			console.log('we are back here');
			let _id = make_id(args.assessmentId);
			let assessment = await Assessment.findById(_id);
			console.log(args);
			let newTeamMember = args.teamMemberUpdates;
			var newTeamMembers = [...assessment.teamMembers, newTeamMember];
			updateObject(assessment.teamMembers, newTeamMembers);
			assessment.save();
			return newTeamMember;


			// var updatedUser = await user.set({
			// 	jsonFiles: newFiles
			// });
		},
removeTeamMember: async(root, args, context, info) => {
		var assessment = await Assessment.findById(args.assessmentId);
		assessment.teamMembers = assessment.teamMembers.filter(mem => mem.email != args.teamMemberEmail);
		assessment.save();
		return ({ email: args.teamMemberEmail});
	}

	}
	
}


function updateObject(original, newObject) {
	for ( key in newObject ) {
		original[key] = newObject[key]
	}
	return original;
}

async function addAnswer(question, newAnswers, assessment){
	//need to only send needed answer properties, not the whole question object
	var addedAnswer = await Answer.create(newAnswers);
	// addedAnswer.userId = userId;
	// addedAnswer.updatedAt = new Date();

	addedAnswer.save();
	var newAnswersList = [...question.answers, addedAnswer];
	return newAnswersList;
}

// function getUpdatedAtTime(){
// 	var today = new Date();
// 	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// 	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// 	return dateTime = date+' '+time;
//
// }

module.exports = resolvers;

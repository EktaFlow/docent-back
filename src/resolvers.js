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

var sqlResolvers = {
	Query: {
		assessment: async(root, args, context, info) => {
			// return SQLite.execute("SELECT * FROM assessments WHERE id = $")
		}
	}
};

var resolvers = {
	Query: {
		allThreadNames: () => getQuestions.allThreadNames(),
		assessment: async(root, args, context, info) => {
			return Assessment.findById(args._id);
		},
		assessments: async(root, args, context, info) => {
			console.log("fire!!");
			return Assessment.find({})
		},
		question: async(root, args, context, info) => {
			var assessment = await Assessment.findById(args.assessmentId);
			var question = assessment.questions.filter(a => a.questionId == args.questionId);
			console.log("fire!!");
			console.log(question[0]);
			return question[0]
		}
	},
	Mutation: {
		importAssessment: async(roots, args, context, info) => {
			var stringy = args.import

			var cool = JSON.parse(stringy);

			console.log(cool);
			cool = cool.assessment
			//var threads = cool.assessment.threads;
			//cool.questions = getQuestions.getQuestions(threads, 0)
		  var ok  = await Assessment.create(cool);
			console.log(ok);
			return ok;
	},
		createAssessment: async(roots, args, context, info) => {
			args.currentMRL = args.targetMRL;
			args.questions = getQuestions.getQuestions(args.threads, 0);
			// TODO: test if this works without await <21-07-18, yourname> //
			console.log(args);
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

			updateObject(question, args.updates);
			return assessment.save();
		}
	}
}


function updateObject(original, newObject) {
	for ( key in newObject ) {
		original[key] = newObject[key]
	}
	return original;
}

module.exports = resolvers;

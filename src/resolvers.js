const mongoose = require("mongoose");
const getQuestions = require("./questions");
const models = require("./schema/mongoose");
const ConnectionString = require("./constants").ConnectionString;
mongoose.connect(ConnectionString);


const { Assessment } = models;
// console.log('Assessment Model', Assessment)



var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("Connected to DB");
});

//////////// mongo _ids are not strings, but instances of /////////////
/////////// the ObjectId type.
var make_id = (idString) => mongoose.Types.ObjectId(idString);

var resolvers = {
  Query: {
    allThreadNames: () => getQuestions.allThreadNames(),
    assessment: async (root, args, context, info) => {
      return Assessment.findById(args._id);
    },
    assessments: async (root, args, context, info) => {
      // console.log('resolver assessments args', args)

      // const moon = Assessment.find({userId})
      // console.log('moon', moon.schema.obj.questions[0].obj.files)

      var { userId } = args;

      return Assessment.find({ userId });
    },
    getShared: async (root, args, context, info) => {
      var { assessments } = args;

      var shared = await assessments.map(async (assess) => {
        return await Assessment.findById(assess);
      });

      return shared;
    },
    question: async (root, args, context, info) => {
      // console.log("resolver question args 200 --->", args);

      var assessment = await Assessment.findById(args.assessmentId);
      var question = assessment.questions.filter(
        (a) => a.questionId == args.questionId
      );
      // console.log('resolver question 210 --->', question[0])
      return question[0];
    },
    getFiles: async (root, args, context, info) => {
      // console.log("resolver getFiles args 300 --->", args);

      let assessment = await Assessment.findById(args.assessmentId);
      let question = assessment.questions.filter(
        (a) => a.questionId == args.questionId
      );
      // console.log("resolver getFiles files 310 -->", question[0].files)
      return question[0].files;
    },
  },
  Mutation: {
    importAssessment: async (roots, args, context, info) => {
      var stringifiedAssessment = args.import;
      var parsedAssessment = JSON.parse(stringifiedAssessment);
      var assessment = parsedAssessment.assessment;
      var importedAssessment = await Assessment.create(assessment);

      return importedAssessment;
    },
    createAssessment: async (roots, args, context, info) => {
      // console.log(args)

      args.currentMRL = args.targetMRL;

      // var schema = JSON.parse(args.schema);
      var schema = require("../assets/2016.json");

      args.questions = getQuestions.getQuestions(schema[0].versions[0].threads);
      // args.questions = getQuestions.getQuestions(schema);

      // console.log('resolver args.questions', args.questions)
      const demoAssessment = await Assessment.create(args);

      // TODO: test if this works without await <21-07-18, yourname> //
      return await Assessment.create(args);
    },
    addFile: async (root, args, context, info) => {

      // const question = { questionId: args.questionId }
      // const update = { files: {
      //   name: args.name,
      //   url: args.url,
      //   questionId: args.questionId,
      //   assessmentId: args.assessmentId
      // } }

      
     
      // grab current assessment
      let assessment = await Assessment.findById(args.assessmentId);
      let currentQuestion = assessment.questions.filter((a) => a.questionId === args.questionId)

      // console.log('what is this', currentQuestion)


      

      // currentQuestion.push({
      //   name: args.name,
      //   url: args.url,
      //   questionId: args.questionId,
      //   assessmentId: args.assessmentId
      // })

      
      // console.log('currentQuestion + file', currentQuestion)



      


      // out of questions linked to current assessment, filter to find current question
      // find the current question and update  findOneAndUpdate


      // let currentQuestion = assessment.questions.filter(
      //   (a) => a.questionId == args.questionId
      // );

      // add file to current question
      // BUG, for some reason the files property isn't yet instantiated on the question
      // while this code works for initially adding a file, it doesn't save
      // previously added files before adding a new one




      // currentQuestion.files.push({
      //   name: args.name,
      //   url: args.url,
      //   questionId: args.questionId,
      //   assessmentId: args.assessmentId
      // })


      // if (currentQuestion.files !== []) {
      //   currentQuestion.files = []
      //   currentQuestion.files.push({
      //     name: args.name,
      //     url: args.url,
      //     questionId: args.questionId,
      //     assessmentId: args.assessmentId
      //   })
      // } else {
      //   currentQuestion.files.push({
      //     name: args.name,
      //     url: args.url,
      //     questionId: args.questionId,
      //     assessmentId: args.assessmentId
      //   })
      // }
      // save assesment then return currentl/last file included


      assessment.save()
    
      

      return assessment 

      // return updated assessment
      // return assessment.save();
    },
    updateAssessment: async (root, args, context, info) => {
      // console.log(args);
      let _id = make_id(args._id);
      let assessment = await Assessment.findById(_id);
      let question = assessment.questions.find(
        (question) => question.questionId == args.questionId
      );

      /// separate out question args & answer args
      // only need to take out currentAnswer out of 'updates' and update that on the question
      //send the rest of the values in 'updates' to addAnswer

      //currentAnswer = args.updates.currentAnswer;
      //delete args.updates.currentAnswer;
      //
      console.log(args);
      // console.log(args.questionUpdates.currentAnswer);
      if (args.questionUpdates) {
        question.currentAnswer = args.questionUpdates.currentAnswer;
      }

      // updateObject(question, args.updates);
      // var answerList = addAnswer(question, args.answerUpdates, assessment);
      // console.log(question.answers);
      question.answers.push(args.answerUpdates);
      // console.log(question.answers);
      var temp = assessment.questions.filter(
        (q) => q.questionId == args.questionId
      );
      // console.log(temp[0].answers);
      // console.log(temp);
      // question.answers = answerList;
      return assessment.save();
    },

    deleteAssessment: async (root, args, context, info) => {
      let _id = make_id(args._id);
      let assessment = await Assessment.findById(_id);
      assessment.remove();
    },

    deleteFile: async (root, args, context, info) => {
      console.log("resolver deleteFile args", args);

      //find the current assessment
      let assessment = await Assessment.findById(args.assessmentId);

      //find the current question from the assessment
      let question = assessment.questions.filter(
        (a) => a.questionId == args.questionId
      );

      console.log('deleteFile question', question)

      const removedFile = question.files.filter((f) => f.name != args.name)

      question.files = removedFile.files
      assessment.save((err, ass) => {
        return ass 
      })

   
    },

    addTeamMember: async (root, args, context, info) => {
      let _id = make_id(args._id);
      let assessment = await Assessment.findById(_id);
      let newTeamMember = args._teamMembers;
      var newTeamMembers = [...assessment.teamMembers, newTeamMember];
      updateObject(assessment.teamMembers, newTeamMembers);
      assessment.save();

      // var updatedUser = await user.set({
      // 	jsonFiles: newFiles
      // });
    },
  },
};

function updateObject(original, newObject) {
  for (key in newObject) {
    original[key] = newObject[key];
  }
  return original;
}

async function addAnswer(question, newAnswers, assessment) {
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

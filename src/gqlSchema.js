const { gql } = require('apollo-server');

var gqlSchema = gql`

scalar Date

type Assessment{
	_id:							String
	id:								String
	userId:           String
	userEmail: 		String
	scope:						String
	targetMRL:				Int
	currentMRL:       Int
	teamMembers:			[String]
	levelSwitching:		Boolean
	targetDate:				Date
	location:					String
	deskbookVersion:	String
	threads:          [String]
	questions:        [Question]
	files:            [File]
	name:             String
}

type Person{
	id:   String!
	name: String!
}

type Question{
  _id:                String
	id:									Int
	questionText:       String
	currentAnswer:      String
	skipped:            Boolean
	helpText:           String
	criteriaText:       String

	# for traversing the questions
	questionId:					Int
	thread:						  Int
	threadName:	  		  String
	subThreadName:			String
	mrLevel:            Int

	# if answered is false, the question has been skipped.
	answered:           Boolean
	answers: 			[Answer]
}

type Answer {
	_id: 				String
	userId: 			String
	updatedAt: 	  Date
	answer:				String

  ####################################################
	# RISK -
  ####################################################

  likelihood:         Int
  consequence:        Int
  greatestImpact:     String
  riskResponse:       String
  mmpSummary:         String

	# Yes variables #####################################
	objectiveEvidence:	String
	assumptionsYes:			String
	notesYes:						String

	#Skipped variables ################
	assumptionsSkipped: String
	notesSkipped:       String

	# No variables ######################################
	actionPeople:				[Person]
	what:               String
	when:								Date
	who:								String
	risk:								String
	reason:							String
	assumptionsNo:			String
	notesNo:            String



	# NA variables ######################################
	documentation:			String
	assumptionsNA:			String
	notesNA:						String

	Files:						[File]
}

type File{
	id:				String
	caption:	String
	url:			String
	name:     String
	questionId: Int
}

input QuestionInput {
	_id:								String
	id:									Int
	questionText:       String
	currentAnswer:      String
	skipped:            Boolean
	# for traversing the questions
	questionId:					Int
	thread:						  Int
	threadName:	  		  String
	subThread:				  Int
	mrLevel:            Int
	# if answered is false, the question has been skipped.
	answered:           Boolean
	answers: 			      [AnswerInput]
}

input AnswerInput {
	userId: String
	updatedAt: Date
	# User's answer to main question
	answer:							String
	# Yes variables #####################################
	objectiveEvidence:	String
	assumptionsYes:			String
	notesYes:						String
	assumptionsSkipped: String
	notesSkipped:       String

	####### Risk Response
	likelihood:         Int
  consequence:        Int
  greatestImpact:     String
  riskResponse:       String
  mmpSummary:         String

	# No variables ######################################
#	actionPeople:
	when:								Date
	who:								String
	risk:								String
	what:						    String
	reason:							String
	assumptionsNo:			String
	notesNo:            String


	# NA variables ######################################
	documentation: String
	assumptionsNA:			String
	notesNA:						String
#	Files:						[File]
}

type Query {
  getShared(assessments: [String]): [Assessment]
	question(questionId: Int, assessmentId: String):		Question
	questions(mrLevel: Int):	    [Question]
	assessment(_id: String):	    Assessment
	assessments(userId: String):							[Assessment]
	allThreadNames:						[String]
}

type Mutation {
	createAssessment(
		userId:  String
		userEmail: String
		id:      Int
		threads: [Int]
		scope: String
		targetMRL: Int
		targetDate: Date
		location: String
		deskbookVersion: String
		name:            String
		levelSwitching: Boolean
		teamMembers: [String]
		schema: String
	): Assessment

	deleteAssessment(
		_id: String!
	): Assessment

  deleteFile(
    assessmentId: String
    fileId:       String
  ): File

	updateAssessment(
		_id:               String!
		questionId:        Int
		answerUpdates:           AnswerInput
		questionUpdates: 				QuestionInput
	): Assessment

	updateTMAssessment(
		_id: String!
		teamMembers: [String]
	): Assessment

	addFile(
		assessmentId:				  String
		questionId:		Int
		url:									String
		name:									String
	): File

	addTeamMember(
		_id: String!
		teamMembers: [String]
	): Assessment

	importAssessment(import: String): Assessment
}
`;

module.exports = gqlSchema;

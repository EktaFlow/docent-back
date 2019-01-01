const { ApolloServer,
				gql		} = require("apollo-server");
const resolvers = require("./src/resolvers");

var typeDefs = gql`

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
	helpText: String
	criteriaText: String
	answers: 			[Answer]
}

type Answer {
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
	technical:          Boolean
	schedule:           Boolean
	cost:               Boolean


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

input QuestionUpdate {
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
	answers: 			      [Answer]
}

input answerUpdate {
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

	# No variables ######################################
#	actionPeople:
	when:								Date
	who:								String
	risk:								String
	what:						    String
	reason:							String
	assumptionsNo:			String
	notesNo:            String
	technical:          Boolean
	schedule:           Boolean
	cost:               Boolean

	# NA variables ######################################
	documentation:			String
	assumptionsNA:			String
	notesNA:						String

#	Files:						[File]
}

type Query {
  getShared(assessments: [String]): [Assessment]
	allThreadNames:						[String]
	question(questionId: Int, assessmentId: String):		Question
	questions(mrLevel: Int):	    [Question]
	assessment(_id: String):	    Assessment
	assessments(userId: String):							[Assessment]

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

	updateAssessment(
		_id:               String!
		questionId:        Int
		updates:           QuestionUpdate
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

const server = new ApolloServer({ typeDefs,
																	resolvers });

server.listen()
			.then( ({url}) => {
				console.log(`server ready at ${url}`);
		});

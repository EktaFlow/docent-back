"use strict";
////////// Constant loading //////////////////
const Constants = require("../constants");
const { CollectionName,
				ConnectionString
			} = Constants;


////////////// Mongoose loading //////////////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(ConnectionString);


///////////////SCHEMAS//////////////////////
var fileSchema     = new Schema({
	questionId:         String,
	url:								String,
	name:								String
});
	
var personSchema   = new Schema({
	name:								String,
	role:								String
});

var questionSchema = new Schema({
	_id:                String,
	questionText:				String, 
	questionId:					String,
	currentAnswer:      String, 
	skipped:            Boolean,
	threadName:					String,
	subThreadName:			String,
	mrLevel:						Number,
	helpText:           String,
	criteriaText:       String,
	answered:						Boolean,
	answer:							String,
	objectiveEvidence:	String,
  assumptionsYes:			String,
	notesYes:           String,
	what:               String,
	when:								Date,
	who:								String,
	technical:          Boolean,
	schedule:           Boolean,
	cost:               Boolean,
	risk:								String,
	whatDone:						String,
	reason:							String,
	assumptionsNo:			String,
	documentation:			String,
	assumptionsNA:			String,
	assumptionsSkipped: String,
	notesSkipped:       String,
	notesNo:            String,
	notesNA:						String,
	actionPeople:       [personSchema],
	files:							[fileSchema]
});
	
var assessmentSchema = new Schema({		
	scope:							String,
	name:               String,
	targetMRL:					Number,
	currentMRL:					Number,
	levelSwitching:     Boolean,
	targetDate:         Date,
	location:						String,
	deskbookVersion:    String,
	userId:             String,
	threads:            [String],
	teamMembers:        [String],
	questions:          [questionSchema],
	files:              [fileSchema]
});

////////////MODEL CREATION /////////////////
var Assessment	= mongoose.model(CollectionName, assessmentSchema);

module.exports = {
	Assessment
}

module.exports = (cronDetails, context) => {
	console.log('Hello from index.js');

	// let cronParams = cronDetails.getCronParam('');
	// let remainingExecutionCount = cronDetails.getRemainingExecutionCount();
	// let thisCronDetails = cronDetails.getCronDetails();
	// let projectDetails = cronDetails.getProjectDetails();

	// let remainingTime = context.getRemainingExecutionTimeMs();
	// let executionTime = context.getMaxExecutionTimeMs();

	/* 
        CONTEXT FUNCTIONALITIES
    */
	context.closeWithSuccess(); //end of application with success
	// context.closeWithFailure(); //end of application with failure
};

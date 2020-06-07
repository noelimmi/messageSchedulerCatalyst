const express = require('express');
const catalyst = require('zcatalyst-sdk-node');


const expressApp = express();

expressApp.use(express.urlencoded({
	extended: true,
}));
expressApp.use(express.json());

expressApp.get('/startcron', (req, res) => {
	try {
		const app = catalyst.initialize(req);
		const timeDiff = parseInt(req.query.timeDiff);
		let conf = {
			cron_name: 'new_url_cron',
			cron_type: 'OneTime',
			status: true,
			cron_url_details: {
				url: 'https://7884a7c164de.ngrok.io/cliqtest',
				request_method: 'GET'
			},
			job_detail: {
				time_of_execution: new Date().getTime() + timeDiff
			}
		};
		let cron = app.cron();
		let createCronPromise = cron.createCron(conf);
		createCronPromise.then((oneTimeCron) => {
			console.log("ssssss");
			console.log(oneTimeCron);
		});
		res.send("Cron Set To Fire Successfully...");
	} catch (error) {
		console.log("ERROR Happened...");
		console.log(error);
		res.send(error.message);
	}
});

module.exports = expressApp;
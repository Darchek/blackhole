

var	gcm 		= require('node-gcm');
const gcmSender = new gcm.Sender('AIzaSyBC_uqtn1WRYaNO5EDR1yNqygBL4yzr7xE');

var tokenMotorola = "cYMi28KwJkQ:APA91bHcZSvRSfdNmYNOsH5CRzZhX7dm9ySG32MXEDL6WBTPRnaKiBJL02c4eOtB4HfZ2XcAAUn4uGACqvV99-TvddRaoLt5lU0qqjhdqN10hnn0gl694bas5_86P5jHqZpw_kVP-RbJ";
var args = process.argv.slice(2)[0];
console.log(args);


sendCloudMessage(args);



function sendCloudMessage(pcMode) {
	var message = new gcm.Message();
	message.addData("option", "0");
	message.addData("action", pcMode);
	gcmSender.send(message, { to: tokenMotorola }, function (err, response) {
		if(err) {
			console.error(err);
		} else {
			console.log(response);
		}
	});
}

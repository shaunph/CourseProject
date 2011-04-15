/**
 * Email Password Recovery
 *
 * Emails password to user (should email a URL for the user to reset their password instead, ideally)
 **/

var basepath = require('basepath').mainpath;
var tls = require('tls');
var fs = require('fs');

accountName = "CPSC301 Course Project";
accountAddress = "cpsc301w11@gmail.com";
uname64 = "Y3BzYzMwMXcxMUBnbWFpbC5jb20=";	    // This is cpsc301w11@gmail.com in Base 64 encoding
pass64 = "MzAxY291cnNlcHJvamVjdA==";                   // This is 301courseproject in Base 64 encoding
subject = "PASSWORD RECOVERY";

accountPass = "301courseproject";
serverPort = 465;
serverAddress = "smtp.gmail.com";

var certPem = fs.readFileSync(basepath + "dynamic/emailCerts/gmail.pem", encoding='ascii');
var keyPem = fs.readFileSync(basepath + "dynamic/emailCerts/cpsckey.pem", encoding='ascii');
var connection;

module.exports.sendPass = function (destAddress, pass) {
    
    connection = tls.connect(serverPort, serverAddress,
        {key : keyPem, cert : certPem }, function () { });
    
    connection.setEncoding('utf8');
    
    connection.addListener('data', function (data) {
        var temp = data.split(' ');
        
        switch (temp[0]) {
            case '220':
                connection.write("helo\n");
                break;
            case '250':
                switch (temp[1]) {
                    case '2.0.0':
                        console.log("Password sent to " + destAddress + "!");
                        connection.end();
                        break;
                    case '2.1.0':
                        connection.write("rcpt to:<" + destAddress + ">\n");
                        break;
                    case '2.1.5':
                        connection.write("data\n");
                        break;
                    default:
                        connection.write("auth login\n");
                }
                
                break;
            case '334':
                if (temp[1].charAt(0) === "V") {
                    connection.write(uname64 + "\n");
                } else if (temp[1].charAt(0) === "U") {
                    connection.write(pass64 + "\n");
                }                
                break;
            case '235':
                connection.write("mail from:<" + accountAddress + ">\n");
                break;
            case '354':
                connection.write("Subject: " + subject + "\nFrom: " + accountName +"\nTo: " + destAddress + "\n");
                connection.write("CPSC301 Course Project Password Recovery\n\nUsername is " + destAddress + "\nPassword is " + pass + "\n");
                connection.write('\r\n');
                connection.write('.');
                connection.write('\r\n');
                break;
        }
    });
};

"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/ChatHub").build();

document.getElementById("sendButton").disabled = true;


connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (user === $("#userInput").val()) {
        var msgText = `<div class="d-flex justify-content-end" style="padding-left:500px;">
                <div class="alert alert-success" role="alert" ">
                    `+ GetWrapedText(msg, 30) + ` <b>@` + user + `</b>
                      </div>
                 </div>`;
        
        $("#messageList").append(msgText);

        document.getElementById('messageList').scrollTop = 9999999;
    }
    else {
        var msgText = `<div class="d-flex">
                <div class="alert alert-primary" role="alert float-md-left" ">
                    `+ GetWrapedText(msg, 30) + ` <b>@` + user + `</b>
                      </div>
                 </div>`;
        $("#messageList").append(msgText);

        document.getElementById('messageList').scrollTop = 9999999;
    }
    $(".card-body").scrollTop($('.card-body')[0].scrollHeight - $('.card-body')[0].clientHeight);


});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {

    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    if ($("#userInput").val().replace(/\s/g, '')) {
        document.getElementById("userInput").disabled = true;

        if (!message.replace(/\s/g, '')) {
            alert("Don't send empty message please..!");
        }
        else {
            connection.invoke("SendMessage", user, message).catch(function (err) {

                return console.error(err.toString());
            });
        }
    }
    else {
        alert("Who are u?");
    }

    $("#messageInput").val('');
    event.preventDefault();
});


function GetWrapedText(text, maxlength) {
    var resultText = [""];
    var len = text.length;
    if (maxlength >= len) {
        return text;
    }
    else {
        var totalStrCount = parseInt(len / maxlength);
        if (len % maxlength != 0) {
            totalStrCount++;
        }

        for (var i = 0; i < totalStrCount; i++) {
            if (i == totalStrCount - 1) {
                resultText.push(text);
            }
            else {
                var strPiece = text.substring(0, maxlength - 1);
                resultText.push(strPiece);
                resultText.push("<br>");
                text = text.substring(maxlength - 1, text.length);
            }
        }
    }
    return resultText.join("");
}
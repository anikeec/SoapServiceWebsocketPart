var stompClient = null;
var socket = null;
var MessageTypeEnum = {"NONE":0, "CARD_INFO_REQUEST":1, "REFILL_REQUEST":2};
var messageType = MessageTypeEnum.NONE;

//function setConnected(connected) {
//    $("#connect").prop("disabled", connected);
//    $("#disconnect").prop("disabled", !connected);
//    if (connected) {
//        $("#conversation").show();
//    }
//    else {
//        $("#conversation").hide();
//    }
//    $("#greetings").html("");    
//}

//function connect() {
//    var socket = new SockJS('/gs-guide-websocket');
//    stompClient = Stomp.over(socket);
//    stompClient.connect({}, function (frame) {
//        setConnected(true);
//        console.log('Connected: ' + frame);
//        stompClient.subscribe('/topic/greetings', function (greeting) {
//            showGreeting(JSON.parse(greeting.body).content);
//        });
//    });
//}

//function disconnect() {
//    if (stompClient !== null) {
//        stompClient.disconnect();
//    }
//    setConnected(false);
//    console.log("Disconnected");
//}

//function sendName() {
//    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
//}

//function showGreeting(message) {
//    $("#greetings").append("<tr><td>" + message + "</td></tr>");
//}

function cardConnect() {
    socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnectedStatus("Connected");
        console.log('Connected: ' + frame);  
        stompClient.subscribe('/topic/greetings', function (response) {
            if(messageType === MessageTypeEnum.CARD_INFO_REQUEST) {
                cardInfoResponseHandle(response);
            } else if(messageType === MessageTypeEnum.REFILL_REQUEST) {
                cardRefillResponseHandle(response);
            };
        });
        if(messageType === MessageTypeEnum.CARD_INFO_REQUEST) {
            sendCardInfoRequest();
        } else if(messageType === MessageTypeEnum.REFILL_REQUEST) {

        };
    });
}

function cardDisconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    if (socket !== null) {
        socket.close();
    }
    setConnectedStatus("Disconnected");
    console.log("Disconnected");
}

function cardInfoRequest() {
    messageType = MessageTypeEnum.CARD_INFO_REQUEST;
    buttonsAndFieldsDisable();    
    cardConnect();  
}

function sendCardInfoRequest() {
    stompClient.send("/app/cardinfo", {}, JSON.stringify({'cardNumber': $("#cardNumberInput").val()}));
}

function cardInfoResponseHandle(cardInfoResponse) {    
    $("#cardInfoTextArea").empty();
    $("#cardInfoTextArea").append(JSON.parse(cardInfoResponse.body).cardInfoText);
    cardDisconnect();
    buttonsAndFieldsEnable();  
    setConnectedStatus("Success");
}

function setConnectedStatus(status) {
    $("#operationResult").val(status);    
}

function buttonsAndFieldsDisable() {
    $( "#resetButton" ).prop("disabled", true);
    $( "#cardInfoRequestButton" ).prop("disabled", true);
    $( "#cardRefillButton" ).prop("disabled", true);
}

function buttonsAndFieldsEnable() {
    $( "#resetButton" ).prop("disabled", false);
    $( "#cardInfoRequestButton" ).prop("disabled", false);
    $( "#cardRefillButton" ).prop("disabled", false);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
//    $( "#connect" ).click(function() { connect(); });
//    $( "#disconnect" ).click(function() { disconnect(); });
//    $( "#send" ).click(function() { sendName(); });
    $( "#cardInfoRequestButton" ).click(function() { cardInfoRequest(); });
});


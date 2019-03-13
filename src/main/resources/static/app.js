var stompClient = null;
var socket = null;
var MessageTypeEnum = {"NONE":0, "CARD_INFO_REQUEST":1, "REFILL_REQUEST":2};
var messageType = MessageTypeEnum.NONE;

function cardProcess() {
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
            sendCardRefillRequest();
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
    cardProcess();  
}

function cardRefillRequest() {
    messageType = MessageTypeEnum.REFILL_REQUEST;
    buttonsAndFieldsDisable();    
    cardProcess();  
}

function sendCardInfoRequest() {
    stompClient.send("/app/cardinfo", {}, JSON.stringify({
                'packetType': 'CardInfoResponse',
                'cardNumber': $("#cardNumberInput").val()}));
}

function sendCardRefillRequest() {
    stompClient.send("/app/cardrefill", {}, JSON.stringify({
                'packetType': 'CardRefillResponse',
                'cardNumber': $("#cardNumberInput").val(), 
                'sum': $("#refillingSumInput").val()}));
}

function cardInfoResponseHandle(cardInfoResponse) {    
    $("#cardInfoTextArea").empty();
    $("#cardInfoTextArea").append(JSON.parse(cardInfoResponse.body).cardInfoText);
    cardDisconnect();
    buttonsAndFieldsEnable();  
    setConnectedStatus("Success");
    //if success
    $( "#cardRefillButton" ).prop("disabled", false);
}

function cardRefillResponseHandle(cardRefillResponse) {    
    $("#cardInfoTextArea").empty();
    $("#cardInfoTextArea").append(JSON.parse(cardRefillResponse.body).cardInfoText);
    cardDisconnect();
    buttonsAndFieldsEnable();  
    setConnectedStatus("Success");
    //if success
    $( "#cardRefillButton" ).prop("disabled", false);
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
//    $( "#cardRefillButton" ).prop("disabled", false);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#cardRefillButton" ).prop("disabled", true);
    $( "#cardInfoRequestButton" ).click(function() { cardInfoRequest(); });
    $( "#cardRefillButton" ).click(function() { cardRefillRequest(); });
});


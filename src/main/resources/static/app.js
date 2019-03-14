var stompClient = null;
var socket = null;
var MessageTypeEnum = {"NONE":0, "CARD_INFO_REQUEST":1, "REFILL_REQUEST":2};
var messageType = MessageTypeEnum.NONE;
var StateEnum = {"ST_INIT":0, "ST_CARD_INFO_REQ_SENT":1, "ST_CARD_CHECKED":2, "ST_CARD_REFILL_REQ_SENT":3, "ST_CARD_REFILLED":4, "ST_ERROR":5};
var state = StateEnum.ST_INIT;

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
            state = StateEnum.ST_CARD_INFO_REQ_SENT;
        } else if(messageType === MessageTypeEnum.REFILL_REQUEST) {
            sendCardRefillRequest();
            state = StateEnum.ST_CARD_REFILL_REQ_SENT;
        };
        modifyElementsAccordingToState(state);
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
    cardProcess();  
}

function cardRefillRequest() {
    messageType = MessageTypeEnum.REFILL_REQUEST;  
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
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_CARD_CHECKED;
    $("#cardInfoTextArea").empty();
    $("#cardInfoTextArea").append(JSON.parse(cardInfoResponse.body).cardInfoText);
    cardDisconnect();
    setConnectedStatus("Success");
    //if success
//    $( "#cardRefillButton" ).prop("disabled", false);
    //}
    modifyElementsAccordingToState(state);
}

function cardRefillResponseHandle(cardRefillResponse) {
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_CARD_REFILLED;
    $("#cardInfoTextArea").empty();
    $("#cardInfoTextArea").append(JSON.parse(cardRefillResponse.body).cardInfoText);
    cardDisconnect();
    setConnectedStatus("Success");
    //if success
//    $( "#cardRefillButton" ).prop("disabled", false);
    //}
    modifyElementsAccordingToState(state);
}

function setConnectedStatus(status) {
    $("#operationResult").val(status);    
}

function resetButtonHandler() {
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
}

function modifyElementsAccordingToState(state) {
    switch(state) {
        case StateEnum.ST_INIT:
                                $("#resetButton").prop("disabled", true);
                                $("#cardInfoRequestButton").prop("disabled", false);
                                $("#cardRefillButton").prop("disabled", true);
                                $("#cardNumberInput").val("");
                                $("#cardNumberInput").prop("disabled", false);
                                $("#refillingSumInput").val("");    
                                $("#refillingSumInput").prop("disabled", true);
                                $("#cardInfoTextArea").empty(); 
                                $("#operationResult").val(""); 
                                break;
        case StateEnum.ST_CARD_INFO_REQ_SENT:
                                $("#resetButton").prop("disabled", true);
                                $("#cardInfoRequestButton").prop("disabled", true);
                                $("#cardRefillButton").prop("disabled", true);
                                $("#cardNumberInput").prop("disabled", true);
                                $("#refillingSumInput").val("");    
                                $("#refillingSumInput").prop("disabled", true);
                                $("#cardInfoTextArea").empty();  
                                break;
        case StateEnum.ST_CARD_CHECKED:
                                $("#resetButton").prop("disabled", false);
                                $("#cardInfoRequestButton").prop("disabled", true);
                                $("#cardRefillButton").prop("disabled", false);
                                $("#cardNumberInput").prop("disabled", true);
                                $("#refillingSumInput").val("");    
                                $("#refillingSumInput").prop("disabled", false);  
                                break;
        case StateEnum.ST_CARD_REFILL_REQ_SENT:
                                $("#resetButton").prop("disabled", true);
                                $("#cardInfoRequestButton").prop("disabled", true);
                                $("#cardRefillButton").prop("disabled", true);
                                $("#cardNumberInput").prop("disabled", true);    
                                $("#refillingSumInput").prop("disabled", true); 
                                break;
        case StateEnum.ST_CARD_REFILLED:
                                $("#resetButton").prop("disabled", false);
                                $("#cardInfoRequestButton").prop("disabled", true);
                                $("#cardRefillButton").prop("disabled", true);
                                $("#cardNumberInput").prop("disabled", true);    
                                $("#refillingSumInput").prop("disabled", true);
                                break;
        case StateEnum.ST_ERROR:
        default:
                                $("#resetButton").prop("disabled", true);
                                $("#cardInfoRequestButton").prop("disabled", true);
                                $("#cardRefillButton").prop("disabled", true);
                                $("#cardNumberInput").prop("disabled", true);    
                                $("#refillingSumInput").prop("disabled", true);
                                $("#cardInfoTextArea").empty(); 
                                break;                    
    }
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
    $( "#resetButton" ).click(function() { resetButtonHandler(); });
    $( "#cardInfoRequestButton" ).click(function() { cardInfoRequest(); });
    $( "#cardRefillButton" ).click(function() { cardRefillRequest(); });
});


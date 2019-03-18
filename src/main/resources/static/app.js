var stompClient = null;
var sock = null;
var MessageTypeEnum = {"NONE":0, "CARD_INFO_REQUEST":1, "REFILL_REQUEST":2};
//var messageType = MessageTypeEnum.NONE;
var StateEnum = {"ST_INIT":0, 
                "ST_CARD_INFO_REQ_SENT":1, 
                "ST_CARD_CHECKED":2, 
                "ST_CARD_INFO_RECEIVED_ERROR":3,
                "ST_CARD_REFILL_REQ_SENT":4, 
                "ST_CARD_REFILLED":5,
                "ST_CARD_REFILLED_ERROR":6,                
                "ST_ERROR":7};
var state = StateEnum.ST_INIT;

openNewSocketConnection = function() {  
    sock = new SockJS('/gs-guide-websocket');    
    setConnectedStatus("Try connect to server");    
};

function cardProcess(messageType) {
    openNewSocketConnection(); 
    
    stompClient = Stomp.over(sock);
    stompClient.connect({}, function (frame) {
        console.log('StompClient: ' + frame);  
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
    }, function(error) {
        console.log('StompClient: ' + error);
        //I have to handle this message
    });
}

function cardDisconnect() {
    if (stompClient !== null) {
        if(stompClient)
        stompClient.disconnect(function() {
            console.log('StompClient: disconnected');
            sock.close();
        });
    }
    console.log("Server disconnected");
}

//------------------------------------------------------------------------------
//dateTime 
//------------------------------------------------------------------------------
function pad(n) {
    return n<10 ? '0'+n : n;
}

function getDateTime() {
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); 
    var year = '' + currentDate.getFullYear();
    var yyyymmdd = year + "." + pad(month + 1) + "." + pad(date);
    var ddmmyyyy = pad(date) + "." + pad(month + 1) + "." + year.substring(2,4);
    var hour = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();
    var hhmmss = pad(hour) + ":" + pad(minute) + ":" + pad(second);
    return ddmmyyyy + " " + hhmmss;
}

//------------------------------------------------------------------------------
//connectedStatus 
//------------------------------------------------------------------------------
function setConnectedStatus(status) {
    var conStateLoggingElement = $("#connectionStateLog");
    status = getDateTime() + " - " + status;
    if(conStateLoggingElement.val() !== '') {
        status = '\n' + status;
    };
    conStateLoggingElement.append(status); 
    conStateLoggingElement.scrollTop(conStateLoggingElement[0].scrollHeight);
}

function cardInfoRequest() { 
    if($("#cardNumberInput").val() === '') {
        setConnectedStatus("ERROR!!! Card number field if empty.");
        return;
    }
    cardProcess(MessageTypeEnum.CARD_INFO_REQUEST);
    responseWaitingStart(SERVER_QUERY_TIMEOUT);   
}

function cardRefillRequest() {
    if($("#refillingSumInput").val() === '') {
        setConnectedStatus("ERROR!!! Sum field if empty.");
        return;
    }
    cardProcess(MessageTypeEnum.REFILL_REQUEST);  
    responseWaitingStart(SERVER_QUERY_TIMEOUT);   
}

function sendCardInfoRequest() {
    stompClient.send("/app/cardinfo", {}, JSON.stringify({
                'packetType': 'CardInfoRequest',
                'cardNumber': $("#cardNumberInput").val()}));
    setConnectedStatus("CardInfoRequest sent");
}

function sendCardRefillRequest() {
    stompClient.send("/app/cardrefill", {}, JSON.stringify({
                'packetType': 'CardRefillRequest',
                'cardNumber': $("#cardNumberInput").val(), 
                'sum': $("#refillingSumInput").val()}));
    setConnectedStatus("CardRefillRequest sent");
}

function cardInfoResponseHandle(cardInfoResponse) {
    var errors = JSON.parse(cardInfoResponse.body).errors;
    if(errors === 'none') {
        setConnectedStatus('CardInfoResponse received successfully.');
        state = StateEnum.ST_CARD_CHECKED;
        $("#cardInfoTextArea").empty();
        $("#cardInfoTextArea").append(JSON.parse(cardInfoResponse.body).cardInfoText);
    } else {
        setConnectedStatus('CardInfoResponse has errors: ' + errors);
        state = StateEnum.ST_CARD_INFO_RECEIVED_ERROR;
    }
    responseWaitingStop();   
    cardDisconnect();
    modifyElementsAccordingToState(state);
}

function cardRefillResponseHandle(cardRefillResponse) {
    var errors = JSON.parse(cardRefillResponse.body).errors;
    if(errors === 'none') {
        setConnectedStatus('CardRefillResponse received successfully.');
        state = StateEnum.ST_CARD_REFILLED;
        $("#cardInfoTextArea").empty();
        $("#cardInfoTextArea").append(JSON.parse(cardRefillResponse.body).cardInfoText);
    } else {
        setConnectedStatus('CardRefillResponse has errors: ' + errors);
        state = StateEnum.ST_CARD_REFILLED_ERROR;
    }
    responseWaitingStop(); 
    cardDisconnect();
    modifyElementsAccordingToState(state);
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
        case StateEnum.ST_CARD_INFO_RECEIVED_ERROR:
                                $("#resetButton").prop("disabled", false);
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
        case StateEnum.ST_CARD_REFILLED_ERROR:
                                $("#resetButton").prop("disabled", false);
                                $("#cardRefillButton").prop("disabled", false);
                                $("#refillingSumInput").prop("disabled", false);
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

//------------------------------------------------------------------------------
//wait for response process 
//------------------------------------------------------------------------------
const SERVER_QUERY_TIMEOUT = 4000;
var sendInterval = null;

function responseWaitingStart(waitTimeout) {
    sendInterval = window.setInterval(function () {
                                    responseWaitingTimeoutError();
                                }, waitTimeout);
}

function responseWaitingStop() {
    clearInterval(sendInterval);
}

function responseWaitingTimeoutError() {        
    if((sock.readyState === SockJS.CLOSED) || (sock.readyState === SockJS.CLOSING)) {
        var mess = 'Server timeout error. Socket was closed.';        
        responseWaitingStop();
    } else {
        var mess = 'Server timeout error.';
    }
    if(state === StateEnum.ST_CARD_INFO_REQ_SENT) {
        state = StateEnum.ST_CARD_INFO_RECEIVED_ERROR;                          //or timeout error
        mess += '\nCardInfoRequest error.';           
    } else if(state === StateEnum.ST_CARD_REFILL_REQ_SENT) {
        state = StateEnum.ST_CARD_REFILLED_ERROR;                               //or timeout error
        mess += '\nCardRefill error.';           
    } else {
        
    }
    console.log(mess);
    setConnectedStatus(mess);    
}
//wait for response process end ------------------------------------------------

$(document).ready(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
    $( "#resetButton" ).click(function() { resetButtonHandler(); });
    $( "#cardInfoRequestButton" ).click(function() { cardInfoRequest(); });
    $( "#cardRefillButton" ).click(function() { cardRefillRequest(); });
    $("#cardNumberInput").on('keypress', function(e){
        return e.which !== 13;
    });
    $("#refillingSumInput").on('keypress', function(e){
        return e.which !== 13;
    }); 
});


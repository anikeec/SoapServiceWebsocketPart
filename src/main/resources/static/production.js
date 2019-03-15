var stompClient = null;
var sock = null;
var MessageTypeEnum = {
                "NONE":0, 
                "CARD_INFO_REQUEST":1, 
                "REFILL_REQUEST":2, 
                "CARD_LIST_REQUEST":3,
                "PRODUCTION_LIST_REQUEST":4
            };
var messageType = MessageTypeEnum.NONE;
var StateEnum = {
                "ST_INIT":0, 
                "ST_ERROR":1, 
                "ST_CARD_LIST_REQ_SENT":2, 
                "ST_CARD_LIST_RECEIVED":3,
                "ST_PRODUCTION_LIST_REQ_SENT":4, 
                "ST_PRODUCTION_LIST_RECEIVED":5
            };
var state = StateEnum.ST_INIT;
var recInterval = null;

// websocket handlers ----------------------------------------------------------
var onMessage = function(e) {
    console.log('socket message');
};

var onClose = function (e) {
        setConnectedStatus("Disconnected");
        recInterval = window.setInterval(function () {
            openNewSocketConnection();
        }, 2000);        
    };
var onOpen = function () {
        clearInterval(recInterval);
        setConnectedStatus("Connected");
    };
// websocket handlers end ------------------------------------------------------

openNewSocketConnection = function() {  
    sock = new SockJS('/gs-guide-websocket');    
    setConnectedStatus("Try connect to server");    
    sock.onopen = onOpen;    
    sock.onmessage = onMessage;
    sock.onclose = onClose;  
};

function cardProcess() {
    openNewSocketConnection(); 
    
    stompClient = Stomp.over(sock);
    stompClient.connect({}, function (frame) {
//        sock.onopen = onOpen;    
//        sock.onmessage = onMessage;
//        sock.onclose = onClose;
//        stompClient.heartbeat.outgoing = 100;
//        setConnectedStatus("Connected");
        console.log('StompClient: ' + frame);  
        stompClient.subscribe('/topic/greetings', function (response) {
            if(messageType === MessageTypeEnum.CARD_LIST_REQUEST) {
                cardListResponseHandle(response);
            } else if(messageType === MessageTypeEnum.PRODUCTION_LIST_REQUEST) {
                productionListResponseHandle(response);
            };
        });
        if(messageType === MessageTypeEnum.CARD_LIST_REQUEST) {
            sendCardListRequest();
            state = StateEnum.ST_CARD_LIST_REQ_SENT;
        } else if(messageType === MessageTypeEnum.PRODUCTION_LIST_REQUEST) {
            sendProductionListRequest();
            state = StateEnum.ST_PRODUCTION_LIST_REQ_SENT;
        };
        modifyElementsAccordingToState(state);
    }, function(error) {
        console.log('StompClient: ' + error);
        //I have to handle this message
    });
}

function cardDisconnect() {
    if (stompClient !== null) {
        stompClient.disconnect(function() {
        console.log('StompClient: disconnected');
        sock.close();
    });
    }
//    if (sock !== null) {
//        setConnectedStatus("Try disconnect");
//        sock.close();
//    }
//    setConnectedStatus("Disconnected");
    console.log("Server disconnected");
}

function setConnectedStatus(status) {
    $("#connectionState").val(status);    
}

function resetButtonHandler() {
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
}

function modifyElementsAccordingToState(state) {
    switch(state) {
        case StateEnum.ST_INIT:
                                $("#cardListResetButton").prop("disabled", true);
                                $("#cardListLoadFromFileButton").prop("disabled", false);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                $('#cardTable tbody').empty();
                                $("#operationResultProduction").empty();
                                $("#productionListSelector").empty();
//                                $("#operationResult").val(""); 
                                break;
        case StateEnum.ST_CARD_LIST_REQ_SENT:
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $('#cardTable tbody').empty();
                                break;
        case StateEnum.ST_CARD_LIST_RECEIVED:
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListRefillButton").prop("disabled", false);
                                break;
        case StateEnum.ST_PRODUCTION_LIST_REQ_SENT:
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#productionListLoadFromDbButton").prop("disabled", true);
                                $("#productionListSelector").empty();
                                break;
        case StateEnum.ST_PRODUCTION_LIST_RECEIVED:
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", false);
                                $("#productionListLoadFromDbButton").prop("disabled", false);
                                break;
        case StateEnum.ST_ERROR:
        default:
                                $("#cardListResetButton").prop("disabled", true);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $('#cardTable tbody').empty();
                                $("#operationResultProduction").empty(); 
                                break;                    
    }
}


//wait for response process ----------------------------------------------------
const SERVER_QUERY_TIMEOUT = 2000;
var sendInterval = null;

function responseWaitingStart(waitTimeout) {
    sendInterval = window.setInterval(function () {
                                    responseWaitingTimeoutError();
                                }, waitTimeout);
}

function responseWaitingTimeoutError() {        
    if((sock.readyState === SockJS.CLOSED) || (sock.readyState === SockJS.CLOSING)) {
        var mess = 'Server timeout error. Socket was closed.';
        clearInterval(sendInterval);
    } else {
        var mess = 'Server timeout error.';
    }
    console.log(mess);
    setConnectedStatus(mess);    
}
//wait for response process end ------------------------------------------------


//card list query --------------------------------------------------------------
function cardListRequest() {
    messageType = MessageTypeEnum.CARD_LIST_REQUEST;  
    cardProcess();
    responseWaitingStart(SERVER_QUERY_TIMEOUT);    
}

function sendCardListRequest() {
    var production = $("#productionListSelector").val();
    stompClient.send("/app/cardlist", {}, JSON.stringify({
                'packetType': 'CardRefillRequest',
                'production': production}));//$("#cardNumberInput").val(), 
    setConnectedStatus("CardListRequest sent");
}

function cardListResponseHandle(cardListResponse) {
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_CARD_LIST_RECEIVED;
    
    clearInterval(sendInterval);
//    $("#operationResultProduction").empty();
    $.each(JSON.parse(cardListResponse.body).cardList, function(i, item) {
        insertTableItem(i, item.cardNumber);
//        $("#operationResultProduction").append(item.cardNumber);        
    });
    cardDisconnect();
    setConnectedStatus("CardListResponse received successfully");
    //if success
    //    $( "#cardRefillButton" ).prop("disabled", false);
    //}
    modifyElementsAccordingToState(state);
    //}
}

function insertTableItem(id, cardnumber) {
    var html = '<tr><td><input type="checkbox" class="cardCheckbox"  id="cardCheckbox' 
            + cardnumber + '"></td>'
            + '<td>' + cardnumber  
            + '</td><td>' + '' + '</td></tr>';
    $('#cardTable > tbody:last-child').append(html);
}

function fillTableInit() {
    var html = '';
    for(var i = 0; i < 100; i++)
            html += '<tr><td><input type="checkbox" class="cardCheckbox"></td>'
                + '<td>' + ''  
                + '</td><td>' + '' + '</td></tr>';
    $('#cardTable tr').last().after(html);
}


//production list query --------------------------------------------------------
function productionListRequest() {
    messageType = MessageTypeEnum.PRODUCTION_LIST_REQUEST;  
    cardProcess();
    responseWaitingStart(SERVER_QUERY_TIMEOUT);
}

function sendProductionListRequest() {
    stompClient.send("/app/productionlist", {}, JSON.stringify({
                'packetType': 'ProductionListRequest'}));
    setConnectedStatus("ProductionListRequest sent");
}

function productionListResponseHandle(productionListResponse) {
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_PRODUCTION_LIST_RECEIVED;
    
    clearInterval(sendInterval);
    $.each(JSON.parse(productionListResponse.body).productionList, function(i, item) {
        insertProductionDropdownItem(i, item);        
    });
    cardDisconnect();
    setConnectedStatus("ProductionListResponse received successfully");
    //if success
    //    $( "#cardRefillButton" ).prop("disabled", false);
    //}
    modifyElementsAccordingToState(state);
    //}
}

function insertProductionDropdownItem(id, production) {
    var html = '<option>' + production + '</option>';
    $("#productionListSelector").append(html);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
    $( "#cardListResetButton" ).click(function() { resetButtonHandler(); });
    
    $("#selectAllCardsCheckbox").click(function () {
        $(".cardCheckbox").prop('checked', $(this).prop('checked'));
    });
    
    $( "#cardListLoadFromDbButton" ).click(function() { cardListRequest(); });
    $( "#productionListLoadFromDbButton" ).click(function() { productionListRequest(); });

});


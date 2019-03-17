var stompClient = null;
var sock = null;
var MessageTypeEnum = {
                "NONE":0, 
                "CARD_INFO_REQUEST":1, 
                "REFILL_REQUEST":2, 
                "CARD_LIST_REQUEST":3,
                "PRODUCTION_LIST_REQUEST":4
            };
var StateEnum = {
                "ST_INIT":0,                
                "ST_CARD_LIST_REQ_SENT":1, 
                "ST_CARD_LIST_RECEIVED":2,
                "ST_CARD_REFILL_REQ_SENT":3, 
                "ST_CARD_REFILLED":4,
                "ST_PRODUCTION_LIST_REQ_SENT":5, 
                "ST_PRODUCTION_LIST_RECEIVED":6,
                "ST_CARD_LIST_REFILLED":7,
                "ST_ERROR":8 
            };
var state = StateEnum.ST_INIT;


openNewSocketConnection = function() {  
    sock = new SockJS('/gs-guide-websocket');    
    setConnectedStatus("Try connect to server");    
};

function cardProcess(messageType, currentHandlingPtr) {
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
            } else if(messageType === MessageTypeEnum.REFILL_REQUEST) {
                cardRefillResponseHandle(response, currentHandlingPtr);
            };
        });
        if(messageType === MessageTypeEnum.CARD_LIST_REQUEST) {
            sendCardListRequest();
            state = StateEnum.ST_CARD_LIST_REQ_SENT;
        } else if(messageType === MessageTypeEnum.PRODUCTION_LIST_REQUEST) {
            sendProductionListRequest();
            state = StateEnum.ST_PRODUCTION_LIST_REQ_SENT;
        } else if(messageType === MessageTypeEnum.REFILL_REQUEST) {
            sendCardRefillRequest(currentHandlingPtr);
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
//    if (sock !== null) {
//        setConnectedStatus("Try disconnect");
//        sock.close();
//    }
//    setConnectedStatus("Disconnected");
    console.log("Server disconnected");
}

function setConnectedStatus(status) {
    var conStateLoggingElement = $("#connectionStateLog"); 
    if(conStateLoggingElement.val() !== '') {
        status = '\n' + status;
    };
    conStateLoggingElement.append(status); 
    conStateLoggingElement.scrollTop(conStateLoggingElement[0].scrollHeight);
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
                                $("#cardListRefillButton").prop("disabled", true);
                                $("#productionListLoadFromDbButton").prop("disabled", true);
                                $("#productionListSelector").empty();
                                break;
        case StateEnum.ST_PRODUCTION_LIST_RECEIVED:
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                $("#productionListLoadFromDbButton").prop("disabled", false);
                                break;
        case StateEnum.ST_CARD_REFILL_REQ_SENT:
                                
                                break;
        case StateEnum.ST_CARD_REFILLED:
                                
                                break;
        case StateEnum.ST_CARD_LIST_REFILLED:
                                $("#cardListRefillButton").prop("disabled", false);
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

//------------------------------------------------------------------------------
//wait for response process 
//------------------------------------------------------------------------------
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
    if(state === StateEnum.ST_CARD_REFILL_REQ_SENT) {
        state = StateEnum.ST_CARD_REFILLED;                                     //or error
        mess += '\nRefilling card #' 
                + cardListChecked.cardNumberArray[cardListChecked.handlingPtr] 
                + ' error.';
        cardListChecked.statusArray[cardListChecked.handlingPtr].html('Error');
        cardRefillNextCard();            
    } else {

    }
    console.log(mess);
    setConnectedStatus(mess);    
}
//wait for response process end ------------------------------------------------

//------------------------------------------------------------------------------
//card list query
//------------------------------------------------------------------------------
function cardListRequest() { 
    cardProcess(MessageTypeEnum.CARD_LIST_REQUEST);
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
    var html = '<tr>' 
            + '<td scope="col" class="col-md-1 col-sm-1">' 
            + '<input type="checkbox" class="cardCheckbox"  id="cardCheckbox' + cardnumber + '"></td>'
            + '<td scope="col" class="col-md-4 col-sm-4" name="tdCardNumber">' + cardnumber + '</td>' 
            + '<td scope="col" class="col-md-7 col-sm-7" name="tdCardStatus">' + '' + '</td>'
            + '</tr>';
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

//------------------------------------------------------------------------------
//production list query
//------------------------------------------------------------------------------
function productionListRequest() { 
    cardProcess(MessageTypeEnum.PRODUCTION_LIST_REQUEST);
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

//production list query end ----------------------------------------------------

//------------------------------------------------------------------------------
// card list refilling process 
//------------------------------------------------------------------------------
var cardListChecked = {
    ptr: 0,
    handlingPtr: 0,
    cardNumberArray: new Array(),
    sumArray: new Array(),
    statusArray: new Array()
};

function cardTableHandleCheckedRow(row) {
    var ptr = cardListChecked.ptr;
    cardListChecked.cardNumberArray[ptr] = row.find('td[name="tdCardNumber"]').text();
    cardListChecked.sumArray[ptr] = '10';
    cardListChecked.statusArray[ptr] = row.find('td[name="tdCardStatus"]');
    cardListChecked.ptr++;
}

function cadrListRefillingStart() {    
    var tb = $('#cardTable:eq(0) tbody');
    
    cardListChecked.ptr = 0;
    cardListChecked.handlingPtr = 0;
    cardListChecked.cardNumberArray = new Array();
    cardListChecked.sumArray = new Array();
    cardListChecked.statusArray = new Array();

    tb.find("tr").each( function (index, element) {
        if($(element).find('input[type="checkbox"]').is(':checked')) {        
            cardTableHandleCheckedRow($(element));
        }
    });                                 

    if(cardRefillingProcessRun(cardListChecked.handlingPtr) === false) {
        state = StateEnum.ST_CARD_LIST_REFILLED;
    }
    modifyElementsAccordingToState(state);
}

function cardRefillingProcessRun(currentHandlingPtr) {
    if(currentHandlingPtr < cardListChecked.statusArray.length) {
        cardListChecked.statusArray[currentHandlingPtr].html('Preparing for request...'); 
        cardProcess(MessageTypeEnum.REFILL_REQUEST, currentHandlingPtr);
        responseWaitingStart(SERVER_QUERY_TIMEOUT);
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------
// card refilling process 
//------------------------------------------------------------------------------
function sendCardRefillRequest(currentHandlingPtr) {
    stompClient.send("/app/cardrefill", {}, JSON.stringify({
                'packetType': 'CardRefillRequest',
                'cardNumber': cardListChecked.cardNumberArray[currentHandlingPtr], 
                'sum': cardListChecked.sumArray[currentHandlingPtr]}));
    setConnectedStatus("CardRefillRequest sent");
}

function cardRefillResponseHandle(cardRefillResponse, currentHandlingPtr) {
    var errors = JSON.parse(cardRefillResponse.body).errors;
    setConnectedStatus("CardRefillResponse received");
    if(errors === 'none') {
        setConnectedStatus('Card #' 
                + cardListChecked.cardNumberArray[currentHandlingPtr]
                + ' refilled succesfully');
        cardListChecked.statusArray[currentHandlingPtr].html('Card refilled');
    } else {
        setConnectedStatus('Card #' 
                + cardListChecked.cardNumberArray[currentHandlingPtr]
                + ' refilling has errors: ' + errors);
        cardListChecked.statusArray[currentHandlingPtr].html('Error');
    }
    state = StateEnum.ST_CARD_REFILLED;
    clearInterval(sendInterval);    
    cardDisconnect(); 
    if(cardRefillNextCard(currentHandlingPtr) === false) {
        state = StateEnum.ST_CARD_LIST_REFILLED;        
    }
    modifyElementsAccordingToState(state);    
}

function cardRefillNextCard(currentHandlingPtr) {
    cardListChecked.handlingPtr = currentHandlingPtr + 1;
    return cardRefillingProcessRun(cardListChecked.handlingPtr);
}

// card list refilling process end ---------------------------------------------

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
    $( "#cardListRefillButton" ).click(function() { cadrListRefillingStart(); });
});


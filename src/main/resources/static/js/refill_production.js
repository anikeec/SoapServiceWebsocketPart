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
                "ST_CARD_LIST_RECEIVED_ERROR":3,
                "ST_CARD_LIST_REFILLED":4,
                "ST_CARD_REFILL_REQ_SENT":5, 
                "ST_CARD_REFILLED":6,
                "ST_CARD_REFILLED_ERROR":7,
                "ST_PRODUCTION_LIST_REQ_SENT":8, 
                "ST_PRODUCTION_LIST_RECEIVED":9,
                "ST_PRODUCTION_LIST_RECEIVED_ERROR":10,              
                "ST_ERROR":11 
            };
var state = StateEnum.ST_INIT;
var mustStopFlag = false;


openNewSocketConnection = function() {  
    sock = new SockJS('/gs-guide-websocket');    
    setConnectedStatus("Try connect to server");    
};

function cardProcess(messageType, currentHandlingPtr) {
    openNewSocketConnection(); 
    
    stompClient = Stomp.over(sock);
    stompClient.connect({}, function (frame) {
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
        cardDisconnect();
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

function resetButtonHandler() {
    if((state === StateEnum.ST_CARD_REFILL_REQ_SENT) 
        || (state === StateEnum.ST_CARD_REFILLED)
        || (state === StateEnum.ST_CARD_REFILLED_ERROR)){
        mustStopFlag = true;
        var mess = "Request to stop process. Reset button was pressed.";
        console.log(mess);
        setConnectedStatus(mess);
    } else {
        state = StateEnum.ST_INIT;
    }
    modifyElementsAccordingToState(state);
}

function modifyElementsAccordingToState(state) {
    switch(state) {
        case StateEnum.ST_INIT:                                
                                $("#productionListLoadFromDbButton").prop("disabled", false);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", true);
                                $("#cardListRefillButton").prop("disabled", true);
                                $('#cardTable tbody').empty();
                                $("#operationResultProduction").empty();                                
                                $("#productionListSelector").empty();
                                break;
        case StateEnum.ST_CARD_LIST_REQ_SENT:
                                $("#productionListLoadFromDbButton").prop("disabled", true);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                $('#cardTable tbody').empty();
                                break;
        case StateEnum.ST_CARD_LIST_RECEIVED:
                                $("#productionListLoadFromDbButton").prop("disabled", false);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", false);
                                break;
        case StateEnum.ST_PRODUCTION_LIST_REQ_SENT:
                                $("#productionListLoadFromDbButton").prop("disabled", true);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                $("#productionListSelector").empty();
                                break;
        case StateEnum.ST_PRODUCTION_LIST_RECEIVED:
                                $("#productionListLoadFromDbButton").prop("disabled", false);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                break;
        case StateEnum.ST_CARD_REFILL_REQ_SENT:
                                $("#productionListLoadFromDbButton").prop("disabled", true);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                break;
        case StateEnum.ST_CARD_REFILLED:
                                $("#productionListLoadFromDbButton").prop("disabled", true);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                break;
        case StateEnum.ST_CARD_LIST_REFILLED:
                                $("#productionListLoadFromDbButton").prop("disabled", false);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", false);
                                break;
        case StateEnum.ST_CARD_LIST_RECEIVED_ERROR:
                                $('#cardTable tbody').empty();
                                $("#productionListLoadFromDbButton").prop("disabled", false);
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", false);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                break;
        case StateEnum.ST_PRODUCTION_LIST_RECEIVED_ERROR:
                                $('#cardTable tbody').empty();
                                $("#productionListLoadFromDbButton").prop("disabled", false);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
                                break;
        case StateEnum.ST_CARD_REFILLED_ERROR:
                                
                                break;
        case StateEnum.ST_ERROR:
        default:
                                $("#productionListLoadFromDbButton").prop("disabled", false);                                
                                $("#cardListLoadFromFileButton").prop("disabled", true);
                                $("#cardListLoadFromDbButton").prop("disabled", true);
                                $("#cardListResetButton").prop("disabled", false);
                                $("#cardListRefillButton").prop("disabled", true);
//                                $('#cardTable tbody').empty();
//                                $("#operationResultProduction").empty(); 
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
                'production': production})); 
    setConnectedStatus("CardListRequest sent");
}

function cardListResponseHandle(cardListResponse) {
    var errors = JSON.parse(cardListResponse.body).errors;    
    if(errors === 'none') {
        setConnectedStatus('CardListResponse received successfully.');
        state = StateEnum.ST_CARD_LIST_RECEIVED;  
        $.each(JSON.parse(cardListResponse.body).cardList, function(i, item) {
            insertTableItem(i, item.cardNumber);        
        });
    } else {
        setConnectedStatus('CardListResponse has errors: ' + errors);
        state = StateEnum.ST_CARD_LIST_RECEIVED_ERROR;
    }  
    responseWaitingStop();    
    cardDisconnect();
    modifyElementsAccordingToState(state);
}

function insertTableItem(id, cardnumber) {
    var html = '<tr>' 
            + '<td scope="col" class="col-md-1 col-sm-1 col-xs-1" name="tdCardCheckbox">' 
            + '<input type="checkbox" class="cardCheckbox" id="cardCheckbox' + cardnumber + '"></td>'
            + '<td scope="col" class="col-md-4 col-sm-4 col-xs-4" name="tdCardNumber">' + cardnumber + '</td>' 
            + '<td scope="col" class="col-md-7 col-sm-7 col-xs-7" name="tdCardStatus">' + '' + '</td>'
            + '</tr>';
    $('#cardTable > tbody:last-child').append(html);
}
//card list query end ----------------------------------------------------------

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
    var errors = JSON.parse(productionListResponse.body).errors;
    if(errors === 'none') {
        setConnectedStatus('ProductionListResponse received successfully.');
        state = StateEnum.ST_PRODUCTION_LIST_RECEIVED;   
        $.each(JSON.parse(productionListResponse.body).productionList, function(i, item) {
            insertProductionDropdownItem(i, item);        
        });
    } else {
        setConnectedStatus('ProductionListResponse has errors: ' + errors);
        state = StateEnum.ST_PRODUCTION_LIST_RECEIVED_ERROR;
    } 
    responseWaitingStop();
    cardDisconnect();
    modifyElementsAccordingToState(state);
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
    checkbox: new Array(),
    cardNumberArray: new Array(),
    sumArray: new Array(),
    statusArray: new Array()
};

function cardTableHandleCheckedRow(row) {
    var ptr = cardListChecked.ptr;
    cardListChecked.checkbox[ptr] = row.find('td[name="tdCardCheckbox"]').find('input[type="checkbox"]');
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
    if(mustStopFlag === true) {
        mustStopFlag = false;
        state = StateEnum.ST_CARD_LIST_REFILLED;        
        return false;
    }
    if(currentHandlingPtr < cardListChecked.statusArray.length) {
        cardListChecked.statusArray[currentHandlingPtr]
                            .html('Preparing for request...'); 
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
    cardListChecked.statusArray[currentHandlingPtr]
                            .html('Request sent. Waiting for response...');
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
        cardListChecked.checkbox[currentHandlingPtr].prop('checked', false);
    } else {
        setConnectedStatus('Card #' 
                + cardListChecked.cardNumberArray[currentHandlingPtr]
                + ' refilling has errors: ' + errors);
        cardListChecked.statusArray[currentHandlingPtr].html('Error');
    }
    state = StateEnum.ST_CARD_REFILLED;
    responseWaitingStop();    
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

function checkLogged() {
    var cookieValue = $.cookie('loggedStatus');
    if ((cookieValue !== null) && (cookieValue !== undefined)) {
        return true;
    } else {
        window.location = '/logout';        
    }
    return false;
}

$(document).ready(function () {
    $.cookie('loggedStatus','true'); 
    
    $("#logoutLink").click(function() {
        $.removeCookie('loggedStatus');
    });
    
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    
    state = StateEnum.ST_INIT;
    modifyElementsAccordingToState(state);
    
    $("#selectAllCardsCheckbox").click(function () {
        $(".cardCheckbox").prop('checked', $(this).prop('checked'));
    });    
    $( "#cardListResetButton" ).click(function() { 
        if(checkLogged() === true) {
            resetButtonHandler(); 
        }
    });
    $( "#productionListLoadFromDbButton" ).click(function() { 
        if(checkLogged() === true) {
            productionListRequest(); 
        }
    });
    $( "#cardListLoadFromDbButton" ).click(function() { 
        if(checkLogged() === true) {
            cardListRequest();  
        }
    });    
    $( "#cardListRefillButton" ).click(function() { 
        if(checkLogged() === true) {
            cadrListRefillingStart(); 
        }
    });    
});


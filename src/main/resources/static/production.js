var stompClient = null;
var socket = null;
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

function cardProcess() {
    socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnectedStatus("Connected");
        console.log('Connected: ' + frame);  
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

//card list query --------------------------------------------------------------
function cardListRequest() {
    messageType = MessageTypeEnum.CARD_LIST_REQUEST;  
    cardProcess();  
}

function sendCardListRequest() {
    var production = $("#productionListSelector").val();
    stompClient.send("/app/cardlist", {}, JSON.stringify({
                'packetType': 'CardRefillRequest',
                'production': production}));//$("#cardNumberInput").val(), 
}

function cardListResponseHandle(cardListResponse) {
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_CARD_LIST_RECEIVED;
    
//    $("#operationResultProduction").empty();
    $.each(JSON.parse(cardListResponse.body).cardList, function(i, item) {
        insertTableItem(i, item.cardNumber);
//        $("#operationResultProduction").append(item.cardNumber);        
    });
    cardDisconnect();
    setConnectedStatus("Success");
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
}

function sendProductionListRequest() {
    stompClient.send("/app/productionlist", {}, JSON.stringify({
                'packetType': 'ProductionListRequest'}));
}

function productionListResponseHandle(productionListResponse) {
    //if answer error {
    //  state = StateEnum.ST_ERROR;
    //} else {
    state = StateEnum.ST_PRODUCTION_LIST_RECEIVED;
    
    $.each(JSON.parse(productionListResponse.body).productionList, function(i, item) {
        insertProductionDropdownItem(i, item);        
    });
    cardDisconnect();
    setConnectedStatus("Success");
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


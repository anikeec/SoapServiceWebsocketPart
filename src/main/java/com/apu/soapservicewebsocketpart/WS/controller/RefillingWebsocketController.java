/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.WS.controller;

import com.apu.soapservicewebsocketpart.WS.entity.WsCardRefillResponse;
import com.apu.soapservicewebsocketpart.WS.entity.WsCardRefillRequest;
import com.apu.soapservicewebsocketpart.WS.entity.WsCardInfoResponse;
import com.apu.soapservicewebsocketpart.WS.entity.WsCard;
import com.apu.soapservicewebsocketpart.WS.entity.WsCardInfoRequest;
import com.apu.soapservicewebsocketpart.WS.entity.WsCardListRequest;
import com.apu.soapservicewebsocketpart.WS.entity.WsProductionListResponse;
import com.apu.soapservicewebsocketpart.WS.entity.WsCardListResponse;
import com.apu.soapservicewebsocketpart.WS.entity.WsProductionListRequest;
import com.apu.soapservicewebsocketpart.WS.entity.WsPacketType;
import java.util.ArrayList;
import java.util.List;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

/**
 *
 * @author apu
 */
@Controller
public class RefillingWebsocketController {
    
    private static String ERRORS_NONE = "none";
    
    @MessageMapping("/cardinfo")
    @SendTo("/topic/refilling")
    public WsCardInfoResponse getCardInfo(WsCardInfoRequest request) throws Exception {
        if(request.getPacketType().equals(WsPacketType.CARD_INFO_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        return new WsCardInfoResponse("Card number is " + HtmlUtils.htmlEscape(request.getCardNumber()) + "!", ERRORS_NONE);
    }
    
    @MessageMapping("/cardrefill")
    @SendTo("/topic/refilling")
    public WsCardRefillResponse refillCard(WsCardRefillRequest request) throws Exception {
        if(request.getPacketType().equals(WsPacketType.CARD_REFILL_REQUEST) == false) {
            //error
        }
        Thread.sleep(1500); // simulated delay
        if(request.getCardNumber().equals("1212")) {
            return new WsCardRefillResponse("Card number " 
                + HtmlUtils.htmlEscape(request.getCardNumber()) 
                + " filled succesfully on "
                + HtmlUtils.htmlEscape(request.getSum())
                + " grn.", "error");
        } else 
        return new WsCardRefillResponse("Card number " 
                + HtmlUtils.htmlEscape(request.getCardNumber()) 
                + " filled succesfully on "
                + HtmlUtils.htmlEscape(request.getSum())
                + " grn.", ERRORS_NONE);
    }
    
    @MessageMapping("/productionlist")
    @SendTo("/topic/refilling")
    public WsProductionListResponse getProductionList(WsProductionListRequest request) throws Exception {
        if(request.getPacketType().equals(WsPacketType.PRODUCTION_LIST_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        List<String> productionList = new ArrayList<>();
        productionList.add("First production");
        productionList.add("Second production");
        return new WsProductionListResponse(productionList, ERRORS_NONE);
    }
    
    @MessageMapping("/cardlist")
    @SendTo("/topic/refilling")
    public WsCardListResponse getCardList(WsCardListRequest request) throws Exception {
        if(request.getPacketType().equals(WsPacketType.CARD_LIST_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        List<WsCard> fullCardList = new ArrayList<>();
        fullCardList.add(new WsCard("1111", "First production"));
        fullCardList.add(new WsCard("1212", "First production"));
        fullCardList.add(new WsCard("1213", "First production"));
        fullCardList.add(new WsCard("1214", "First production"));
        fullCardList.add(new WsCard("1313", "Second production"));
        fullCardList.add(new WsCard("1314", "Second production"));
        fullCardList.add(new WsCard("1315", "Second production"));
        
        String production = request.getProduction();
        List<WsCard> cardList = new ArrayList<>();
        for(WsCard card:fullCardList) {
            if(card.getProduction().equals(production)) {
                cardList.add(card);
            }
        }
        
        return new WsCardListResponse(cardList, ERRORS_NONE);
    }
    
}

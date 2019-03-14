/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart;

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
public class MainController {
    
    @MessageMapping("/cardinfo")
    @SendTo("/topic/greetings")
    public CardInfoResponse getCardInfo(CardInfoRequest request) throws Exception {
        if(request.getPacketType().equals(PacketType.CARD_INFO_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        return new CardInfoResponse("Card number is " + HtmlUtils.htmlEscape(request.getCardNumber()) + "!");
    }
    
    @MessageMapping("/cardrefill")
    @SendTo("/topic/greetings")
    public CardRefillResponse refillCard(CardRefillRequest request) throws Exception {
        if(request.getPacketType().equals(PacketType.CARD_REFILL_REQUEST) == false) {
            //error
        }
        Thread.sleep(1500); // simulated delay
        return new CardRefillResponse("Card number " 
                + HtmlUtils.htmlEscape(request.getCardNumber()) 
                + " filled succesfully on "
                + HtmlUtils.htmlEscape(request.getSum())
                + " grn.");
    }
    
    @MessageMapping("/productionlist")
    @SendTo("/topic/greetings")
    public ProductionListResponse getProductionList(ProductionListRequest request) throws Exception {
        if(request.getPacketType().equals(PacketType.PRODUCTION_LIST_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        List<String> productionList = new ArrayList<>();
        productionList.add("First production");
        productionList.add("Second production");
        return new ProductionListResponse(productionList);
    }
    
    @MessageMapping("/cardlist")
    @SendTo("/topic/greetings")
    public CardListResponse getCardList(CardListRequest request) throws Exception {
        if(request.getPacketType().equals(PacketType.CARD_LIST_REQUEST) == false) {
            //error
        }
        Thread.sleep(1000); // simulated delay
        List<Card> fullCardList = new ArrayList<>();
        fullCardList.add(new Card("1111", "First production"));
        fullCardList.add(new Card("1212", "First production"));
        fullCardList.add(new Card("1313", "Second production"));
        
        String production = request.getProduction();
        List<Card> cardList = new ArrayList<>();
        for(Card card:fullCardList) {
            if(card.getProduction().equals(production)) {
                cardList.add(card);
            }
        }
        
        return new CardListResponse(cardList);
    }
    
}

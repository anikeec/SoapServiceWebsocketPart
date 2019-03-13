/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart;

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
    
}

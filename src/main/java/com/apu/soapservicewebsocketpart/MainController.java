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
    
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }
    
    @MessageMapping("/cardinfo")
    @SendTo("/topic/greetings")
    public CardInfoResponse getCardInfo(CardInfoRequest request) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new CardInfoResponse("Card number is " + HtmlUtils.htmlEscape(request.getCardNumber()) + "!");
    }
    
}

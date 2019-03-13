/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart;

/**
 *
 * @author apu
 */
public class CardRefillResponse {
    
    private String cardInfoText;

    public CardRefillResponse() {
    }

    public CardRefillResponse(String cardInfoText) {
        this.cardInfoText = cardInfoText;
    }

    public String getCardInfoText() {
        return cardInfoText;
    }
    
}

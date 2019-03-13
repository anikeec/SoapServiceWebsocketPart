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
    
    private final String packetType;
    private String cardInfoText;

    public CardRefillResponse() {
        this.packetType = PacketType.CARD_REFILL_RESPONSE;
    }

    public CardRefillResponse(String cardInfoText) {
        this();
        this.cardInfoText = cardInfoText;
    }

    public String getCardInfoText() {
        return cardInfoText;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

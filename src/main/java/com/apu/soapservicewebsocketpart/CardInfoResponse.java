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
public class CardInfoResponse {
    
    private final String packetType;
    private String cardInfoText;

    public CardInfoResponse() {
        this.packetType = PacketType.CARD_INFO_RESPONSE;
    }

    public CardInfoResponse(String cardInfoText) {
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

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
public class CardRefillRequest {
    
    private final String packetType;
    private String cardNumber;
    private String sum;

    public CardRefillRequest() {
        this.packetType = PacketType.CARD_REFILL_REQUEST;
    }

    public CardRefillRequest(String cardNumber, String sum) {
        this();
        this.cardNumber = cardNumber;
        this.sum = sum;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getSum() {
        return sum;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

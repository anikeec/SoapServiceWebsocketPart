/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.entity;

/**
 *
 * @author apu
 */
public class CardInfoRequest {
    
    private final String packetType;
    private String cardNumber;

    public CardInfoRequest() {
        this.packetType = PacketType.CARD_INFO_REQUEST;
    }

    public CardInfoRequest(String cardNumber) {
        this();
        this.cardNumber = cardNumber;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.WS.entity;

/**
 *
 * @author apu
 */
public class WsCardInfoRequest {
    
    private final String packetType;
    private String cardNumber;

    public WsCardInfoRequest() {
        this.packetType = WsPacketType.CARD_INFO_REQUEST;
    }

    public WsCardInfoRequest(String cardNumber) {
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

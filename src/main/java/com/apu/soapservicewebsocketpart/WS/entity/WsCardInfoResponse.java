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
public class WsCardInfoResponse {
    
    private final String packetType;
    private String cardInfoText;
    private String errors;

    public WsCardInfoResponse() {
        this.packetType = WsPacketType.CARD_INFO_RESPONSE;
    }

    public WsCardInfoResponse(String cardInfoText, String errors) {
        this();
        this.cardInfoText = cardInfoText;
        this.errors = errors;
    }

    public String getCardInfoText() {
        return cardInfoText;
    }

    public String getPacketType() {
        return packetType;
    }

    public String getErrors() {
        return errors;
    }
    
}

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
public class CardListRequest {
    
    private final String packetType;
    private String production;

    public CardListRequest() {
        this.packetType = PacketType.CARD_LIST_REQUEST;
    }

    public CardListRequest(String production) {
        this();
        this.production = production;
    }

    public String getProduction() {
        return production;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

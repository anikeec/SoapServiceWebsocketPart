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
public class WsCardListRequest {
    
    private final String packetType;
    private String production;

    public WsCardListRequest() {
        this.packetType = WsPacketType.CARD_LIST_REQUEST;
    }

    public WsCardListRequest(String production) {
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

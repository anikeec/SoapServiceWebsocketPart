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
public class WsProductionListRequest {
    
    private final String packetType;

    public WsProductionListRequest() {
        this.packetType = WsPacketType.PRODUCTION_LIST_REQUEST;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

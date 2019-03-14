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
public class ProductionListRequest {
    
    private final String packetType;

    public ProductionListRequest() {
        this.packetType = PacketType.PRODUCTION_LIST_REQUEST;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

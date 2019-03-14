/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author apu
 */
public class ProductionListResponse {
    
    private final String packetType;
    private List<String> productionList = new ArrayList<>();

    public ProductionListResponse() {
        this.packetType = PacketType.PRODUCTION_LIST_RESPONSE;
    }

    public ProductionListResponse(List<String> productionList) {
        this();
        this.productionList = productionList;
    }

    public List<String> getProductionList() {
        return productionList;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

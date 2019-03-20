/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.WS.entity;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author apu
 */
public class WsProductionListResponse {
    
    private final String packetType;
    private List<String> productionList = new ArrayList<>();
    private String errors;

    public WsProductionListResponse() {
        this.packetType = WsPacketType.PRODUCTION_LIST_RESPONSE;
    }

    public WsProductionListResponse(List<String> productionList, String errors) {
        this();
        this.productionList = productionList;
        this.errors = errors;
    }

    public List<String> getProductionList() {
        return productionList;
    }

    public String getPacketType() {
        return packetType;
    }

    public String getErrors() {
        return errors;
    }
    
}

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
public class WsCardListRefillRequest {
    
    private final String packetType;
    private List<WsCardRefilling> cardRefillList = new ArrayList<>();

    public WsCardListRefillRequest() {
        this.packetType = WsPacketType.CARD_LIST_REFILL_REQUEST;
    }

    public WsCardListRefillRequest(String packetType, List<WsCardRefilling> cardRefillList) {
        this.packetType = packetType;
        this.cardRefillList = cardRefillList;
    }

    public List<WsCardRefilling> getCardRefillList() {
        return cardRefillList;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

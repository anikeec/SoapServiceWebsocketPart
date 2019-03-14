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
public class CardListRefillRequest {
    
    private final String packetType;
    private List<CardRefilling> cardRefillList = new ArrayList<>();

    public CardListRefillRequest() {
        this.packetType = PacketType.CARD_LIST_REFILL_REQUEST;
    }

    public CardListRefillRequest(String packetType, List<CardRefilling> cardRefillList) {
        this.packetType = packetType;
        this.cardRefillList = cardRefillList;
    }

    public List<CardRefilling> getCardRefillList() {
        return cardRefillList;
    }

    public String getPacketType() {
        return packetType;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.entity;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author apu
 */
public class CardListResponse {
    
    private final String packetType;
    private List<Card> cardList = new ArrayList<>();
    private String errors;

    public CardListResponse() {
        this.packetType = PacketType.CARD_LIST_RESPONSE;
    }

    public CardListResponse(List<Card> cardList, String errors) {
        this();
        this.cardList = cardList;
        this.errors = errors;
    }

    public List<Card> getCardList() {
        return cardList;
    }

    public String getPacketType() {
        return packetType;
    }

    public String getErrors() {
        return errors;
    }
    
}

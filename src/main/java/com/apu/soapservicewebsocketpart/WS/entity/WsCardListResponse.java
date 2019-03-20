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
public class WsCardListResponse {
    
    private final String packetType;
    private List<WsCard> cardList = new ArrayList<>();
    private String errors;

    public WsCardListResponse() {
        this.packetType = WsPacketType.CARD_LIST_RESPONSE;
    }

    public WsCardListResponse(List<WsCard> cardList, String errors) {
        this();
        this.cardList = cardList;
        this.errors = errors;
    }

    public List<WsCard> getCardList() {
        return cardList;
    }

    public String getPacketType() {
        return packetType;
    }

    public String getErrors() {
        return errors;
    }
    
}

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
public class WsCard {
    
    private String cardNumber;
    private String production;

    public WsCard() {
    }

    public WsCard(String cardNumber, String production) {
        this();
        this.cardNumber = cardNumber;
        this.production = production;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getProduction() {
        return production;
    }
    
}

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
public class Card {
    
    private String cardNumber;
    private String production;

    public Card() {
    }

    public Card(String cardNumber, String production) {
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

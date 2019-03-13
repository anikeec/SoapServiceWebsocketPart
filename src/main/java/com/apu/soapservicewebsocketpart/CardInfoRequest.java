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
public class CardInfoRequest {
    
    private String cardNumber;

    public CardInfoRequest() {
    }

    public CardInfoRequest(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardNumber() {
        return cardNumber;
    }
    
}

package com.apu.soapservicewebsocketpart.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "soapservice-security")
public class SecuritySettings {
    private String mobileAppClientId;
    private String mobileAppClientSecret;
    
    public String getMobileAppClientId() {
        return mobileAppClientId;
    }
    
    public void setMobileAppClientId(String mobileAppClientId) {
        this.mobileAppClientId = mobileAppClientId;
    }
    
    public String getMobileAppClientSecret() {
        return mobileAppClientSecret;
    }
    
    public void setMobileAppClientSecret(String mobileAppClientSecret) {
        this.mobileAppClientSecret = mobileAppClientSecret;
    }
}

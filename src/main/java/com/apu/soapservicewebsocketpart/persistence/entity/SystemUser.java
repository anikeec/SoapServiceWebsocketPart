package com.apu.soapservicewebsocketpart.persistence.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

//import org.springframework.data.redis.core.RedisHash;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author apu
 */
@XmlRootElement
//@RedisHash("systemUser")
@JsonIgnoreProperties("userCollection")
@NoArgsConstructor
public class SystemUser implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Getter @Setter
    private Integer userId;

    @Getter @Setter
    private String firstName;
    
    @Getter @Setter
    private String secondName;
    
    @Getter @Setter
    private String phoneNumber;
    
    @Getter @Setter
    private String email;
    
    @Getter @Setter
    private String password;
    
    @Getter @Setter
    private Boolean active = false;
    
    private Set<UserRole> userRoleCollection = new HashSet<>();
    
    @XmlTransient
    public Set<UserRole> getUserRoleCollection() {
        return userRoleCollection;
    }

    public void setUserRoleCollection(Set<UserRole> userRoleCollection) {
        this.userRoleCollection = userRoleCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof SystemUser)) {
            return false;
        }
        SystemUser other = (SystemUser) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.apu.TcpServerForAccessControl.entity.SystemUser[ userId=" + userId + " ]";
    }
    
}

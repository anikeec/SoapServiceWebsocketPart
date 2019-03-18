package com.apu.soapservicewebsocketpart.persistence.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 *
 * @author apu
 */
@XmlRootElement
@NoArgsConstructor
@RequiredArgsConstructor
public class UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Getter @Setter
    private Integer userRoleId;

    @NonNull @Getter @Setter    
    private String description;

    private List<SystemUser> userCollection = new ArrayList<>();

    public UserRole(Integer userRoleId, String description) {
        this.userRoleId = userRoleId;
        this.description = description;
    }

    @XmlTransient
    public List<SystemUser> getUserCollection() {
        return userCollection;
    }

    public void setUserCollection(List<SystemUser> userCollection) {
        this.userCollection = userCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userRoleId != null ? userRoleId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof UserRole)) {
            return false;
        }
        UserRole other = (UserRole) object;
        if ((this.userRoleId == null && other.userRoleId != null) || 
                (this.userRoleId != null && !this.userRoleId.equals(other.userRoleId))) {
            return false;
        }
        if ((this.description == null && other.description != null) || 
                (this.description != null && !this.description.equals(other.description))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.apu.TcpServerForAccessControl.packet.UserRole[ userRoleId=" + userRoleId + " ]";
    }
    
}


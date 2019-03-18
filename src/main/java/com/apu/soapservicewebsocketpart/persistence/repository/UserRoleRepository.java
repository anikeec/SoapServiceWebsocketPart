package com.apu.soapservicewebsocketpart.persistence.repository;

import java.util.List;

import com.apu.soapservicewebsocketpart.persistence.entity.UserRole;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class UserRoleRepository {
    
    private final List<UserRole> userRoleList;

    public UserRoleRepository() {
        this.userRoleList = new ArrayList<>();
        userRoleList.add(new UserRole(1, "ROLE_ADMIN"));
        userRoleList.add(new UserRole(2, "ROLE_USER"));
    }
   
    public List<UserRole> findByUserRoleId(Integer userRoleId) {
        List<UserRole> list = new ArrayList<>();
        for(UserRole ur: userRoleList) {
            if(ur.getUserRoleId().intValue() == userRoleId) {
                list.add(ur);
            }
        }
        return list;
    }
    
    public List<UserRole> findByDescription(String description) {
        List<UserRole> list = new ArrayList<>();
        for(UserRole ur: userRoleList) {
            if(ur.getDescription().equals(description)) {
                list.add(ur);
            }
        }
        return list;
    }
    
    public List<UserRole> findAll() {        
        return userRoleList;
    }
    
    public <S extends UserRole> S save(S entity) {
        if(userRoleList.contains(entity) == false) {
            entity.setUserRoleId(userRoleList.size());
            if(userRoleList.add(entity)) {
                return entity;
            }
        }
        return null;
    }
    
    public void delete(UserRole entity) {
        if(userRoleList.contains(entity) == true) {
            userRoleList.remove(entity);
        }
    }
    
}

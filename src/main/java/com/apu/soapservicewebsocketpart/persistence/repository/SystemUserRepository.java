package com.apu.soapservicewebsocketpart.persistence.repository;

import com.apu.soapservicewebsocketpart.persistence.entity.SystemUser;
import java.util.ArrayList;

import java.util.List;

import org.springframework.stereotype.Repository;

/**
 *
 * @author apu
 */
@Repository
public class SystemUserRepository {
    
    private final List<SystemUser> systemUserList;

    public SystemUserRepository() {
        this.systemUserList = new ArrayList<>();
        SystemUser testUser = new SystemUser();
        testUser.setFirstName("TestUserFN");
        testUser.setPhoneNumber("0123456789");
        testUser.setSecondName("TestUserSN");
        testUser.setActive(true);
        testUser.setEmail("test@test.com");
        testUser.setPassword("$2a$10$AAUnHHu3fRLXuZgf31yzxeAxVU36HyZRuoy0svf1JbvBll1iLjXhu");
        systemUserList.add(testUser);
    }
    
    public List<SystemUser> findAll() {
        return systemUserList;
    }
    
    public List<SystemUser> findByEmail( String email) {
        List<SystemUser> list = new ArrayList<>();
        for(SystemUser su: systemUserList) {
            if(su.getEmail().equals(email)) {
                list.add(su);
            }
        }
        return list;
    }
    
    public List<SystemUser> findByUserId(Integer userId) {
        List<SystemUser> list = new ArrayList<>();
        for(SystemUser su: systemUserList) {
            if(su.getUserId().intValue() == userId) {
                list.add(su);
            }
        }
        return list;
    }
    
    public List<SystemUser> findByActive(Boolean active) {
        List<SystemUser> list = new ArrayList<>();
        for(SystemUser su: systemUserList) {
            if(su.getActive() == active) {
                list.add(su);
            }
        }
        return list;
    }
    
    public <S extends SystemUser> S save(S entity) {
        if(systemUserList.contains(entity) == false) {
            entity.setUserId(systemUserList.size());
            if(systemUserList.add(entity)) {
                return entity;
            }
        }
        return null;
    }
    
    public void delete(SystemUser entity) {
        
    }
    
}

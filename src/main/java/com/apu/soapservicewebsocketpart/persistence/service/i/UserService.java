package com.apu.soapservicewebsocketpart.persistence.service.i;

import java.util.List;

import com.apu.soapservicewebsocketpart.persistence.entity.SystemUser;

public interface UserService {

    public List<SystemUser> findAll();
    
    public List<SystemUser> findAllByPage(Integer page);
    
    public List<SystemUser> findById(Integer userId);
    
    public List<SystemUser> findByActive(Boolean active);
    
    public List<SystemUser> findByEmail(String email);
    
    public SystemUser findUserByEmail(String email);
    
    public SystemUser save(SystemUser user);
    
    public void delete(SystemUser entity);
    
}

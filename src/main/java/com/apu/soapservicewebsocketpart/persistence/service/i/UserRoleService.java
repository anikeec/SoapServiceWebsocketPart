package com.apu.soapservicewebsocketpart.persistence.service.i;

import java.util.List;

import com.apu.soapservicewebsocketpart.persistence.entity.UserRole;

public interface UserRoleService {

    public List<UserRole> findAll();
    
    public List<UserRole> findByUserRoleId(Integer userRoleId);
    
    public List<UserRole> findByDescription(String description);
    
    public UserRole findUserRoleByDescription(String description);
    
    public UserRole save(UserRole userRole);
    
    public void delete(UserRole entity);
    
}

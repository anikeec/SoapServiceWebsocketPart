package com.apu.soapservicewebsocketpart.persistence.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.apu.soapservicewebsocketpart.persistence.entity.UserRole;
import com.apu.soapservicewebsocketpart.persistence.repository.UserRoleRepository;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserRoleService;

@Service
//@Profile("dev")
public class UserRoleServiceImpl implements UserRoleService {

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<UserRole> findAll() {
        return userRoleRepository.findAll();
    }
    
    @Override
    public List<UserRole> findByUserRoleId(Integer userRoleId) {
        return userRoleRepository.findByUserRoleId(userRoleId);
    }
    
    @Override
    public List<UserRole> findByDescription(String description) {
        return userRoleRepository.findByDescription(description);
    }
    
    @Override
    public UserRole findUserRoleByDescription(String description) {
        List<UserRole> userRoleList = userRoleRepository.findByDescription(description);
        if((userRoleList != null) && (userRoleList.size() > 0))
            return userRoleList.get(0);
        return null;
    }
    
    @Override
    public UserRole save(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }
    
    @Override
    public void delete(UserRole entity) {
        userRoleRepository.delete(entity);
    }
    
}

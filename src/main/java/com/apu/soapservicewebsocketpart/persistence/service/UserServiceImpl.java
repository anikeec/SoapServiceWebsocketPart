package com.apu.soapservicewebsocketpart.persistence.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apu.soapservicewebsocketpart.persistence.entity.SystemUser;
import com.apu.soapservicewebsocketpart.persistence.repository.SystemUserRepository;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserService;

@Service
//@Profile("dev")
public class UserServiceImpl implements UserService {

    private SystemUserRepository userRepository;
    
    private PasswordEncoder passwordEncoder;

    @Autowired
    public void setUserRepository(SystemUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<SystemUser> findAll() {
        return userRepository.findAll();
    }
    
    @Override
    public List<SystemUser> findById(Integer userId) {
        return userRepository.findByUserId(userId);
    }
    
    @Override
    public List<SystemUser> findByActive(Boolean active) {
        return userRepository.findByActive(active);
    }
    
    @Override
    public List<SystemUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public SystemUser findUserByEmail(String email) {
        List<SystemUser> userList = userRepository.findByEmail(email);
        if((userList != null) && (userList.size() > 0))
            return userList.get(0);
        return null;
    }
    
    @Override
    public SystemUser save(SystemUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setActive(1);
//        Role userRole = roleRepository.findByRole("ADMIN");
//        user.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
        return userRepository.save(user);
    }
    
    @Override
    public void delete(SystemUser entity) {
        userRepository.delete(entity);
    }

    @Override
    public List<SystemUser> findAllByPage(Integer page) {
        throw new UnsupportedOperationException("Method has not supported yet!");
    }
    
}

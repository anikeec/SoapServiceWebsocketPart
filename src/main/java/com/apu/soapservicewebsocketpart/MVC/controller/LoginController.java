package com.apu.soapservicewebsocketpart.MVC.controller;

import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.apu.soapservicewebsocketpart.persistence.entity.SystemUser;
import com.apu.soapservicewebsocketpart.persistence.entity.UserRole;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserService;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserRoleService;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRoleService userRoleService;

    @RequestMapping(value={"/login"}, params={"error"}, method = RequestMethod.GET)
    public ModelAndView login(@RequestParam(value = "error", required = false) String error){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        if((error != null) && (error.equals("true"))) {
           modelAndView.addObject("param.error", "ERROR");
        }
        return modelAndView;
    }
    
    @RequestMapping(value={"/login"}, method = RequestMethod.GET)
    public ModelAndView login(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        return modelAndView;
    }
    
    @RequestMapping(value="/registration", method = RequestMethod.GET)
    public ModelAndView registration(){
        ModelAndView modelAndView = new ModelAndView();
        SystemUser user = new SystemUser();
        modelAndView.addObject("user", user);
        modelAndView.setViewName("registration");
        return modelAndView;
    }
    
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public ModelAndView createNewUser(@Valid SystemUser user, BindingResult bindingResult) {
        ModelAndView modelAndView = new ModelAndView();
        SystemUser userExists = userService.findUserByEmail(user.getEmail());
        if (userExists != null) {
            bindingResult
                    .rejectValue("email", "error.user",
                            "There is already a user registered with the email provided");
        }
        if (userExists != null) {
            SystemUser newUser = new SystemUser();
            modelAndView.addObject("user", newUser);
            modelAndView.setViewName("registration");
        } else {
            UserRole userRole = userRoleService.findUserRoleByDescription("ROLE_USER");
            if(user.getUserRoleCollection() == null) {
                Set<UserRole> userRoleList = new HashSet<>();
                userRoleList.add(userRole);
                user.setUserRoleCollection(userRoleList);
            } else {
                if(!user.getUserRoleCollection().contains(userRole))
                    user.getUserRoleCollection().add(userRole);
            }
            userService.save(user);
            modelAndView.addObject("successMessage", "User has been registered successfully");
            modelAndView.addObject("user", user);
            modelAndView.setViewName("login");

        }
        return modelAndView;
    }
    
}

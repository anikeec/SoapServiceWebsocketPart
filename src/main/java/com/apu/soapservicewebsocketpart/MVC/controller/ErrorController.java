package com.apu.soapservicewebsocketpart.MVC.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ErrorController {

    @RequestMapping(value={"/error"}, method = RequestMethod.GET)
    public ModelAndView login(Principal principal){
        Map<String, Object> model = new HashMap<>();
        if(principal != null) {
            model.put("name", principal.getName());
        }
        return new ModelAndView("error", model);
    }
    
}

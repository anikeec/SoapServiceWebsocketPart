/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.apu.soapservicewebsocketpart.MVC.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author apu
 */
@Controller
@RequestMapping("/money")
public class RefillingController {
    
    @RequestMapping(value={"/card"}, method = RequestMethod.GET)
    public ModelAndView cardRefilling(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("refill_card");
        return modelAndView;
    }
    
    @RequestMapping(value={"/production"}, method = RequestMethod.GET)
    public ModelAndView productionRefilling(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("refill_production");
        return modelAndView;
    }
    
}

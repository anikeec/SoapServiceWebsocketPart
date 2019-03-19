package com.apu.soapservicewebsocketpart.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.apu.soapservicewebsocketpart.security.ApplicationUserDetailsService;
import com.apu.soapservicewebsocketpart.security.CustomAuthenticationProvider;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserService;
import com.apu.soapservicewebsocketpart.persistence.service.i.UserRoleService;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        //.csrf().disable()        
        .authorizeRequests()
        .antMatchers("/login**").permitAll()
//        .antMatchers("/registration").permitAll()
        .antMatchers("/admin/**").hasAuthority("ADMIN")
        .anyRequest().authenticated()
                
        .and()
        .formLogin()
        .loginPage("/login")
        .failureUrl("/login?error=true")
        .defaultSuccessUrl("/", true)
        .usernameParameter("email")
        .passwordParameter("password")
        
        .and()
        .logout().deleteCookies("JSESSIONID")
        .logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/login")
                
//        .and()
//        .rememberMe().key("uniqueAndSecret").tokenValiditySeconds(86400)                
        
        .and().exceptionHandling()
        .accessDeniedHandler(new CustomAccessDeniedHandler())
        //.accessDeniedPage("/access-denied")
        ;
    }
    
    public class CustomAccessDeniedHandler implements AccessDeniedHandler {

        @Override
        public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex) 
          throws IOException, ServletException {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);//.sendRedirect("/my-error-page");
//            response.addHeader("REQUIRES_AUTH","1");
        }
    }
    
    @Override
    public void configure(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers("/resources/**", "/static/**", "/css/**", "/js/**", "/images/**", 
                        "/webjars/**");
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new CustomAuthenticationProvider();
    }
    
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setUserRoleService(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    private UserService userService;

    private UserRoleService userRoleService;
    
    @Bean 
    @Override
    public UserDetailsService userDetailsService() {
        return new ApplicationUserDetailsService(userService, userRoleService);
    }
    
}

package com.examapp.securityConfig;


import com.examapp.securityConfig.filters.DdosFilter;
import com.examapp.securityConfig.filters.TokenFilter;
import com.examapp.securityConfig.securityDto.SecurityUser;
import com.examapp.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.examapp.predefinedConstant.AuthorityConstants.TEACHER;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Resource
    private TokenFilter tokenFilter;
    @Resource
    private DdosFilter ddosFilter;
    @Resource
    private UserService userService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers("/authority/**").authenticated()
                        .requestMatchers("/exam/**").authenticated()
                        .requestMatchers("/status/**").authenticated()
                        .requestMatchers("/exam/update",
                                "/authority/setAuthorities",
                                "/authority/studentList/*",
                                "/status/suspiciousImage",
                                "/status/suspicious/list",
                                "/user/studentWithClasses"
                                ).hasAuthority(TEACHER)
                )
                .sessionManagement(auth ->
                        auth.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterAt(tokenFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(ddosFilter, TokenFilter.class)
                .build();

    }
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> new SecurityUser(userService.getUserByUsername(username));
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

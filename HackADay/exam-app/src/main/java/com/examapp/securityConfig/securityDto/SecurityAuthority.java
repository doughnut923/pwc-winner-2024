package com.examapp.securityConfig.securityDto;


import com.examapp.entity.Authority;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@AllArgsConstructor
public class SecurityAuthority implements GrantedAuthority {
    private Authority authority;
    @Override
    public String getAuthority() {
        return authority.getPermission();
    }
}

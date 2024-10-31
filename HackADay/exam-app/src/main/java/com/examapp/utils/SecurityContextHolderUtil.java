package com.examapp.utils;

import com.examapp.securityConfig.securityDto.SecurityAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Handle the retrieval of permission and username stored in {@link SecurityContextHolder}
 * TokenFilter store permission and username in {@link SecurityContextHolder} corresponding to token for caching
 * This prevents repeated retrieval from sql
 */
public class SecurityContextHolderUtil {
    /**
     * Retrieves a list of authorities from the SecurityContextHolder.
     *
     * This method checks the SecurityContext for the current Authentication object.
     * If no authentication is found, it returns an empty list.
     * It filters the authorities to only include instances of SecurityAuthority,
     * which is assumed to be the only subclass used for granted authorities.
     *
     * @return A list of authority strings granted to the authenticated user.
     */
    public static List<String> getPermissionsFromSecurityContextHolder(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // should be checked already by security filters, this is a double check
        if (authentication == null) {
            return List.of(); // Return an empty list if no authentication is found
        }
        Collection<? extends GrantedAuthority> authorityList = authentication.getAuthorities();
        /*
         Upcasting should be possible as SecurityAuthority is the only subclass used in GrantedAuthority
         Use filters to confirm upcasting is possible
         */
        return  authorityList.stream()
                .filter(authority -> authority instanceof SecurityAuthority)
                .map(authority -> ((SecurityAuthority) authority).getAuthority())
                .collect(Collectors.toList());
    }
    /**
     * Retrieves the username of the currently authenticated user from the SecurityContextHolder.
     *
     * This method checks if the Authentication object is present and authenticated.
     * If authenticated, it retrieves the UserDetails object, which contains user information.
     * It returns the username of the authenticated user or an empty string if the user is not authenticated.
     *
     * @return The username of the authenticated user, or an empty string if not authenticated.
     */
    public static String getUsernameFromSecurityContextHolder(){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                 /*
                 Upcasting should be possible as UserDetails is pre-set as return type
                  by UsernamePasswordAuthenticationToken in spring security
                 */
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                return userDetails.getUsername();
            }
            return "";
    }

}

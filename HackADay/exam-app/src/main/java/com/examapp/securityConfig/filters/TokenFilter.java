package com.examapp.securityConfig.filters;




import com.examapp.entity.User;
import com.examapp.predefinedConstant.RedisConstant;
import com.examapp.securityConfig.securityDto.SecurityUser;
import com.examapp.service.UserService;
import com.examapp.utils.ComparingFaces;
import com.examapp.utils.JwtUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.time.Duration;

@Component
public class TokenFilter extends OncePerRequestFilter {
    @Resource
    private JwtUtil jwtUtil;
    @Resource
    private UserService userService;
    @Resource
    private ComparingFaces comparingFaces;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);
        if(!stringRedisTemplate.hasKey(RedisConstant.KEY_PREFIX_TOKEN_STORAGE + jwtToken)){
            filterChain.doFilter(request, response);
            return;
        }
        stringRedisTemplate.expire(RedisConstant.KEY_PREFIX_TOKEN_STORAGE + jwtToken, Duration.ofSeconds(RedisConstant.TOKEN_STORAGE_DURATION));
        username = jwtUtil.extractUsername(jwtToken);
        // not authenticated before
        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userService.getUserByUsername(username);
            UserDetails userDetails = new SecurityUser(user);
            if(jwtUtil.isTokenValid(jwtToken, userDetails)){
                UsernamePasswordAuthenticationToken authToken  =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

}

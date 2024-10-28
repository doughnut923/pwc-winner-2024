package com.examapp.securityConfig.filters;

import com.examapp.predefinedConstant.RedisConstant;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class DdosFilter extends OncePerRequestFilter {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String remoteAddr = request.getRemoteAddr();
        String key = RedisConstant.KEY_PREFIX_REMOTE_ADDRESS + remoteAddr;
        Boolean withinRateLimit = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", Duration.ofMillis(RedisConstant.REMOTE_ADDRESS_STORAGE_DURATION));
        if (! withinRateLimit) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return;
        }
        filterChain.doFilter(request, response);
    }
}

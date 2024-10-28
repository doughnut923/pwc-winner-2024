package com.examapp.securityConfig.filters;

import com.examapp.predefinedConstant.RedisConstant;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "ddosconfig")
@Data
public class DdosFilter extends OncePerRequestFilter {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    boolean ddosON;
    long ddosTimeLimit;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(! ddosON){
            // ddosON is off
            filterChain.doFilter(request, response);
        }
        String remoteAddr = request.getRemoteAddr();
        String key = RedisConstant.KEY_PREFIX_REMOTE_ADDRESS + remoteAddr;
        Boolean withinRateLimit = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", Duration.ofMillis(ddosTimeLimit));
        if (! withinRateLimit) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return;
        }
        filterChain.doFilter(request, response);
    }
}

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
import org.springframework.http.HttpMethod;
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
        // Allow preflight requests
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow your frontend origin
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials if needed

        // Handle pre-flight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return; // Skip further processing for pre-flight requests
        }

        // Skip DDoS protection if it's disabled
        if (!ddosON) {
            filterChain.doFilter(request, response);
            return; // Ensure we return after processing
        }

        // Get the client's remote address
        String remoteAddr = request.getRemoteAddr();
        String key = RedisConstant.KEY_PREFIX_REMOTE_ADDRESS + remoteAddr;

        // Increment the request count for this IP address
        Long requestCount = stringRedisTemplate.opsForValue().increment(key);

        // Set the expiration time for the key if this is the first request
        if (requestCount == 1) {
            stringRedisTemplate.expire(key, Duration.ofMillis(ddosTimeLimit));
        }

        // Check if the request count exceeds the limit
        if (requestCount > RedisConstant.MAXREQUESTS) { // Set maxRequests to your desired limit
            // If the rate limit has been exceeded
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return; // Return early to avoid further processing
        }

        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }
}

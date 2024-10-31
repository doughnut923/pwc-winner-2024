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
/**
 * A filter that implements DDoS protection by limiting the number of requests
 * from a single IP address within a specified time frame.
 *
 * <p>This class is configured using properties with the prefix <code>ddosconfig</code> in application.yaml.</p>
 *
 * <h3>Configuration Properties:</h3>
 * <ul>
 *     <li><code>boolean ddosON</code>: Flag to enable or disable DDoS protection. (true now)</li>
 *     <li><code>long ddosTimeLimit</code>: Time limit (in milliseconds) for which
 *         the request count is tracked. (500 milli now)</li>
 * </ul>
 *
 * <h3>Filter Logic:</h3>
 * <ol>
 *     <li>Handles preflight requests (HTTP OPTIONS) by allowing them to pass
 *         through without further processing.</li>
 *     <li>If DDoS protection is disabled, all requests are allowed without
 *         limitation.</li>
 *     <li>For each request, increments the request count for the client's
 *         remote address stored in Redis.</li>
 *     <li>Sets the expiration time for the request count if it's the first
 *         request from that IP address.</li>
 *     <li>Checks if the request count exceeds a predefined limit. If it does,
 *         responds with a <code>503 Service Unavailable</code> status.</li>
 * </ol>
 */
@Component
@Data
public class DdosFilter extends OncePerRequestFilter {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    boolean ddosON = true;
    long ddosTimeLimit = 500L;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Allow preflight requests

        // Handle pre-flight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
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

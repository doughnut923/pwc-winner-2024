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
/**
 * A filter that validates JSON Web Tokens (JWT) {@link JwtUtil} for user authentication
 * and sets the security context for authenticated users.
 *
 * <p>This class is responsible for extracting the JWT from the
 * Authorization header, validating it, and authenticating the user
 * based on the token.</p>
 *
 * <h3>Filter Logic:</h3>
 * <ol>
 *     <li>Handles preflight requests (HTTP OPTIONS) by allowing them
 *         to pass through without further processing.</li>
 *     <li>Checks for the presence of the Authorization header and
 *         validates that it starts with "Bearer ". If not, the request
 *         is allowed to proceed without authentication.</li>
 *     <li>Extracts the JWT from the Authorization header and checks
 *         if it exists in Redis. If the token is missing from Redis,
 *         the request is allowed to proceed.</li>
 *     <li>Extends the expiration time of the token in Redis if it is
 *         found.</li>
 *     <li>Extracts the username from the JWT. If the user is not
 *         already authenticated, retrieves  {@link SecurityUser} (holding username and permission) from the database.</li>
 *     <li>Validates the JWT against the {@link SecurityUser}. If valid,
 *         creates an authentication that hold JWT and {@link SecurityUser} and sets it in the {@link SecurityContextHolder}.</li>
 * </ol>
 */
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
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return; // Skip further processing for pre-flight requests
        }

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

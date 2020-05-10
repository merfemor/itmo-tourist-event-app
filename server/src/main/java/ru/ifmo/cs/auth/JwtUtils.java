package ru.ifmo.cs.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.ifmo.cs.utils.Check;

import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtils {
    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);
    private final long expireTimeoutMillis;
    private final String secretKey;


    public JwtUtils(@Value("#{${jwt.timeout-minutes}}") long expireTimeoutMinutes,
                    @Value("${jwt.secret}") String secretKey) {
        expireTimeoutMillis = TimeUnit.MINUTES.toMillis(expireTimeoutMinutes);
        this.secretKey = secretKey;
        log.debug("Create instance with default expire timeout set to " + expireTimeoutMinutes + " minutes");
    }

    public String generateToken(String username) {
        final long creationTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(username)
                .setIssuedAt(new Date(creationTimeMillis))
                .setExpiration(new Date(creationTimeMillis + expireTimeoutMillis))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    boolean isValidToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}

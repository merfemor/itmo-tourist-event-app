package ru.ifmo.cs.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.ifmo.cs.utils.Either;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtController {
    private static final Logger log = LoggerFactory.getLogger(JwtController.class);
    private final long expireTimeoutMillis;
    private final Key secretKey;


    public JwtController(@Value("#{${jwt.timeout-minutes}}") long expireTimeoutMinutes,
                         @Value("${jwt.secret}") String secretKeyString)
            throws UnsupportedEncodingException {

        byte[] keyBytes = secretKeyString.getBytes(StandardCharsets.UTF_8.name());
        secretKey = Keys.hmacShaKeyFor(keyBytes);
        expireTimeoutMillis = TimeUnit.MINUTES.toMillis(expireTimeoutMinutes);
        log.info("Create instance with default expire timeout set to {} minutes and algorithm = {}",
                 expireTimeoutMinutes, secretKey.getAlgorithm());

    }

    public String generateToken(String username) {
        return generateToken(username, System.currentTimeMillis());
    }

    // visible for testing
    String generateToken(String username, long creationTimeMillis) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(creationTimeMillis))
                .setExpiration(new Date(creationTimeMillis + expireTimeoutMillis))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsernameIfValid(String token) {
        JwtParser parser = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build();

        return maybeExtractClaims(parser, token)
                .doOnRight(exception ->
                        log.trace("Failed to extract username from token", exception)
                )
                .getLeft()
                .map(it -> it.getBody().getSubject())
                .orElse(null);
    }

    public boolean isValidTokenOfUser(String token, String username) {
        return username.equals(extractUsernameIfValid(token));
    }

    private Either<Jws<Claims>, JwtException> maybeExtractClaims(JwtParser jwtParser, String token) {
        try {
            return Either.left(jwtParser.parseClaimsJws(token));
        } catch (JwtException e) {
            return Either.right(e);
        }
    }
}

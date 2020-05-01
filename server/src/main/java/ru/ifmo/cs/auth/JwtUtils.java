package ru.ifmo.cs.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

public class JwtUtils {
    private static final long EXPIRE_TIMEOUT = TimeUnit.HOURS.toMillis(10);
    private static final String SECRET_KEY = "secret"; // TODO: change secrete key

    private JwtUtils() {
    }

    public static String generateToken(String username) {
        final long creationTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(username)
                .setIssuedAt(new Date(creationTimeMillis))
                .setExpiration(new Date(creationTimeMillis + EXPIRE_TIMEOUT))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    private static Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public static boolean isValidToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

    private static boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}

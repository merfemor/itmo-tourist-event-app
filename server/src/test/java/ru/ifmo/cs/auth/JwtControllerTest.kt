package ru.ifmo.cs.auth

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.concurrent.TimeUnit

class JwtControllerTest {

    @Test
    fun `extract of username from token gives right name`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val token = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val name = forTest.extractUsernameIfValid(token)
        assertEquals(USERNAME, name)
    }

    @Test
    fun `token generations at different time gives different tokens`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val token1 = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val timeBetween = TimeUnit.SECONDS.toMillis(1)
        val token2 = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS + timeBetween)
        assertNotEquals(token1, token2)
    }

    @Test
    fun `different secret keys give different tokens`() {
        val forTest1 = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val forTest2 = JwtController(TIMEOUT_MINUTES, SECRET_KEY_2)
        val token1 = forTest1.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val token2 = forTest2.generateToken(USERNAME, GENERATION_TIME_MILLIS)

        assertNotEquals(token1, token2)
    }

    @Test
    fun `different usernames give different tokens`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val token1 = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val token2 = forTest.generateToken(USERNAME_2, GENERATION_TIME_MILLIS)

        assertNotEquals(token1, token2)
    }

    @Test
    fun `generated token is not valid for other secret key`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val token = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val forTest2 = JwtController(TIMEOUT_MINUTES, SECRET_KEY_2)
        assertNull(forTest2.extractUsernameIfValid(token))
    }

    @Test
    fun `changed token signature is not valid`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val token = forTest.generateToken(USERNAME, GENERATION_TIME_MILLIS)
        val changedToken = token.take(token.length - 1) + "a"
        assertNull(forTest.extractUsernameIfValid(changedToken))
    }

    @Test
    fun `expired token is not valid`() {
        val forTest = JwtController(TIMEOUT_MINUTES, SECRET_KEY)
        val creationTime = GENERATION_TIME_MILLIS - TIMEOUT_MILLIS
        val token = forTest.generateToken(USERNAME, creationTime)
        assertNull(forTest.extractUsernameIfValid(token))
    }


    private companion object {
        private const val SECRET_KEY = "test-secret-key-with-enough-size-for-not-throw-weakkeyexcpetion"
        private const val SECRET_KEY_2 = "test-secret-key-with-enough-size-for-not-throw-weakkeyexcpetion2"
        private const val USERNAME = "user"
        private const val USERNAME_2 = "user2"
        private const val TIMEOUT_MINUTES = 1L
        private val TIMEOUT_MILLIS = TimeUnit.MINUTES.toMillis(TIMEOUT_MINUTES)
        private val GENERATION_TIME_MILLIS = System.currentTimeMillis()
    }
}
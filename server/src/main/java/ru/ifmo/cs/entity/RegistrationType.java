package ru.ifmo.cs.entity;

public enum RegistrationType {
    /**
     * Participants can start at any time from contest start till contest end
     */
    OPEN,
    /**
     * Participants should start exactly at contest start
     */
    PRE_REGISTRATION,
    /**
     * Participants should start at time between contest start and contest end, which organizers assign to them
     */
    PRE_REGISTRATION_WITH_TIME
}

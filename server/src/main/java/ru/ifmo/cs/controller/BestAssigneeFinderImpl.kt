package ru.ifmo.cs.controller

import org.springframework.stereotype.Component
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.Person
import java.util.*

@Component
class BestAssigneeFinderImpl(
        private val personRepository: PersonRepository
) : BestAssigneeFinder {

    override fun find(): Person? {
        return null
    }

    override fun findForTime(startDateTime: Date, endDateTime: Date): Person? {
        return null
    }
}
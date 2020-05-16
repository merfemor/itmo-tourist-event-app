package ru.ifmo.cs.controller

import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.Person
import java.util.*

class BestAssigneeFinderImplTest {
    private val personRepository = mock(PersonRepository::class.java)
    private val forTest: BestAssigneeFinder = BestAssigneeFinderImpl(personRepository)

    @Test
    fun `on empty not found any people in db find return null`() {
        setDbReturnData(emptyList())
        assertNull(forTest.find())
    }

    @Test
    fun `on empty not found any people in db findForTime return null`() {
        setDbReturnData(emptyList())
        assertNull(forTest.findForTime(START_DATE, END_DATE))
    }

    private fun setDbReturnData(returnValue: Iterable<Person>) {
        `when`(personRepository.findByRole(any())).thenReturn(returnValue)
    }

    private companion object {
        private val START_DATE = Date(1000)
        private val END_DATE = Date(2000)
    }
}
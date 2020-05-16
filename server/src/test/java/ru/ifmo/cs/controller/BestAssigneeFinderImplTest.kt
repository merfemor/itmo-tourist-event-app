package ru.ifmo.cs.controller

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.whenever
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import ru.ifmo.cs.database.ContestParticipantGroupRepository
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.*
import java.util.*

class BestAssigneeFinderImplTest {
    private val personRepository = mock(PersonRepository::class.java)
    private val groupRegistrationsRepository = mock(ContestParticipantGroupRepository::class.java)
    private val forTest: BestAssigneeFinder = BestAssigneeFinderImpl(personRepository)

    @Test
    fun `on empty not found any people in db find return null`() {
        personRepository.setReturnData()
        assertNull(forTest.find())
    }

    @Test
    fun `on empty not found any people in db findForTime return null`() {
        personRepository.setReturnData()
        assertNull(forTest.findForTime(10.date, 20.date))
    }

    @Test
    fun `on all have tasks in this time return null`() {
        val task1 = createTask(10.date, 20.date)
        val task2 = createTask(15.date, 25.date)

        val person1 = createPerson("user1").apply {
            tasks(task1)
        }
        val person2 = createPerson("user2").apply {
            tasks(task2)
        }
        personRepository.setReturnData(person1, person2)

        assertNull(forTest.findForTime(15.date, 20.date))
    }

    @Test
    fun `find for time in db with one person returns this person`() {
        val person = createPerson("user1")
        personRepository.setReturnData(person)

        val assignee = forTest.findForTime(1.date, 2.date)
        assertEquals(person, assignee)
    }

    @Test
    fun `if one person is free and contest registrations empty, return he`() {
        val task1 = createTask(10.date, 20.date)
        val task2 = createTask(15.date, 25.date)

        val person1 = createPerson("user1").apply {
            tasks(task1)
        }
        val person2 = createPerson("user2").apply {
            tasks(task2)
        }
        personRepository.setReturnData(person1, person2)

        assertNull(forTest.findForTime(20.date, 25.date))
    }

    @Test
    fun `if two person and only one has no contest overlap, choose him`() {
        val contest = createContest(10.date, 20.date)
        val registration = createSingleRegistration(contest, 15.date)

        val person1 = createPerson("user1").apply {
            registrations(registration)
        }
        val person2 = createPerson("user2")
        personRepository.setReturnData(person1, person2)

        val assignee = forTest.findForTime(15.date, 20.date)
        assertEquals(person2, assignee)
    }

    private companion object {
        private val Int.date
        get() = Date(this.toLong())

        private fun PersonRepository.setReturnData(vararg persons: Person) {
            whenever(findByRole(any())).thenReturn(persons.toList())
        }

        private fun ContestParticipantGroupRepository.addPersonRegistrations(
                person: Person,
                vararg registrations: ContestParticipantGroup
        ): ContestParticipantGroupRepository {
            whenever(findByMembersContains(person)).thenReturn(registrations.toList())
            return this
        }


        private fun createPerson(personEmail: String): Person {
            return mock {
                on { email} doReturn personEmail
                on { toString() } doReturn "Person{email=$personEmail}"
            }
        }

        private fun Person.tasks(vararg tasks: Task) {
            whenever(assignedTasks).thenReturn(tasks.toSet())
        }

        private fun Person.registrations(vararg registrations: ContestParticipant) {
            whenever(contestRegistrations).thenReturn(registrations.toList())
        }

        private fun createTask(start: Date?, end: Date?): Task {
            return mock {
                on { startDateTime } doReturn start
                on { endDateTime } doReturn end
            }
        }

        private fun createSingleRegistration(associatedContest: Contest, start: Date?): ContestParticipant {
            return mock {
                on { startDateTime } doReturn start
                on { contest } doReturn associatedContest
            }
        }

        private fun createGroupRegistration(contest: Contest, start: Date?): ContestParticipantGroup {
            return mock {
                on { startDateTime } doReturn start
                on { associatedContest } doReturn contest
            }
        }

        private fun createContest(start: Date, end: Date): Contest {
            return mock {
                on { startDateTime } doReturn start
                on { endDateTime } doReturn end
            }
        }
    }
}
package ru.ifmo.cs.controller

import com.nhaarman.mockitokotlin2.doReturn
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.whenever
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.mockito.Mockito.any
import ru.ifmo.cs.database.ContestParticipantGroupRepository
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.*
import java.util.*

class BestAssigneeFinderImplTest {
    private val personRepository = mock<PersonRepository>()
    private val groupRegistrationsRepository = mock<ContestParticipantGroupRepository> {
        on { findByMembersContains(any()) } doReturn emptyList()
    }
    private val forTest: BestAssigneeFinder = BestAssigneeFinderImpl(personRepository, groupRegistrationsRepository)

    /* ----------------------- find tests ---------------------- */

    @Test
    fun `find task without time on empty db returns null`() {
        personRepository.setReturnData()
        assertNull(forTest.find())
    }

    @Test
    fun `find task without time on only one person returns him`() {
        val person = createPerson("user")
        personRepository.setReturnData(person)
        assertEquals(person, forTest.find())
    }

    @Test
    fun `find task without time gives person with less number of tasks`() {
        val lessTasksPerson = createPerson("less-tasks")
        val moreTasksPerson = createPerson("more-tasks").apply {
            tasks(createTask(null, null))
        }

        personRepository.setReturnData(lessTasksPerson, moreTasksPerson)
        val assignee = forTest.find()
        assertEquals(lessTasksPerson, assignee)
    }

    /* ----------------------- findForTime tests ---------------------- */

    @Test
    fun `on empty db returns null`() {
        personRepository.setReturnData()
        assertNull(forTest.findForTime(10.date, 20.date))
    }

    @Test
    fun `on one busy person return null`() {
        val person = createPerson("user").apply {
            tasks(createTask(10.date, 20.date))
        }
        personRepository.setReturnData(person)
        assertNull(forTest.findForTime(9.date, 11.date))
    }

    @Test
    fun `on two busy person return null`() {
        val person1 = createPerson("user1").apply {
            tasks(createTask(10.date, 20.date))
        }
        val person2 = createPerson("user2").apply {
            tasks(createTask(15.date, 25.date))
        }
        personRepository.setReturnData(person1, person2)

        assertNull(forTest.findForTime(15.date, 20.date))
    }


    @Test
    fun `on one free person return this person`() {
        val person = createPerson("user")
        personRepository.setReturnData(person)

        val assignee = forTest.findForTime(10.date, 20.date)
        assertEquals(person, assignee)
    }

    @Test
    fun `on one free person return him even if contest overlap`() {
        val contest = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val registration = createSingleRegistration(contest, null)
        val person = createPerson("user").apply {
            singleRegistrations(registration)
        }
        personRepository.setReturnData(person)

        val assignee = forTest.findForTime(10.date, 20.date)
        assertEquals(person, assignee)
    }

    @Test
    fun `on one free and one busy person return free person`() {
        val freePerson = createPerson("free")
        val busyPerson = createPerson("busy").apply {
            tasks(createTask(10.date, 20.date))
        }
        personRepository.setReturnData(freePerson, busyPerson)

        val assignee = forTest.findForTime(10.date, 20.date)
        assertEquals(freePerson, assignee)
    }

    @Test
    fun `between two free person choose one that has no contest overlap`() {
        val contest = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val registration = createSingleRegistration(contest, null)
        val personWithOverlap = createPerson("with-overlap").apply {
            singleRegistrations(registration)
        }
        val personWithoutOverlap = createPerson("without-overlap")
        personRepository.setReturnData(personWithOverlap, personWithoutOverlap)

        val assignee = forTest.findForTime(15.date, 20.date)
        assertEquals(personWithoutOverlap, assignee)
    }

    @Test
    fun `prevent full open registration contest overlapping`() {
        val contest = createContest(10.date, 30.date, RegistrationType.OPEN)

        val personRegistered = createPerson("registered-on-open-contest").apply {
            singleRegistrations(
                    createSingleRegistration(contest, null)
            )
            tasks(createTask(10.date, 20.date))
        }
        val personNonRegistered = createPerson("non-registered").apply {
            tasks(createTask(10.date, 20.date))
        }

        personRepository.setReturnData(personRegistered, personNonRegistered)

        val assignee = forTest.findForTime(20.date, 30.date)
        assertEquals(personNonRegistered, assignee)
    }

    @Test
    fun `don't count part open registration contest overlapping`() {
        val contestOpen1 = createContest(10.date, 20.date, RegistrationType.OPEN)
        val contestOpen2 = createContest(20.date, 30.date, RegistrationType.OPEN)
        val contestPre = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("can-participate-in-both-contest").apply {
            singleRegistrations(
                    createSingleRegistration(contestOpen1, null),
                    createSingleRegistration(contestOpen2, null)
            )
        }
        val personMissedMore = createPerson("missed-1-contest").apply {
            singleRegistrations(
                    createSingleRegistration(contestPre, null)
            )
        }
        personRepository.setReturnData(personMissedLess, personMissedMore)

        val assignee = forTest.findForTime(15.date, 25.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `prefer person with less total missed single contests`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("miss-1-contest").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null)
            )
        }
        val personMissedMore = createPerson("miss-2-contests").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest2, null)
            )
        }

        personRepository.setReturnData(personMissedLess, personMissedMore)

        val assignee = forTest.findForTime(15.date, 25.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `prefer person with less new missed single contests`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("already-missed-1st-contest-will-miss-2nd").apply {
            tasks(createTask(10.date, 15.date))
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest2, null)
            )
        }
        val personMissedMore = createPerson("nothing-missed-now-will-miss-1st-and-2nd").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest2, null)
            )
        }

        personRepository.setReturnData(personMissedLess, personMissedMore)

        val assignee = forTest.findForTime(15.date, 25.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `prefer person with less total missed group contests`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("already-missed-contest").apply {
            groupRegistrations(
                    createGroupRegistration(contest1, null),
                    createGroupRegistration(contest2, null)
            )
        }
        val personMissedMore = createPerson("nothing-missed-now-will-miss-contest").apply {
            groupRegistrations(
                    createGroupRegistration(contest1, null)
            )
        }
        personRepository.setReturnData(personMissedLess, personMissedMore)

        val assignee = forTest.findForTime(16.date, 20.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `prefer person with less new missed group contests`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("already-missed-all-contest").apply {
            tasks(createTask(10.date, 15.date),
                    createTask(20.date, 25.date))
            groupRegistrations(
                    createGroupRegistration(contest1, null),
                    createGroupRegistration(contest2, null)
            )
        }
        val personMissedMore = createPerson("nothing-missed-now-will-miss-contest").apply {
            groupRegistrations(
                    createGroupRegistration(contest1, null),
                    createGroupRegistration(contest2, null)
            )
        }
        personRepository.setReturnData(personMissedLess, personMissedMore)

        val assignee = forTest.findForTime(16.date, 19.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `group contests has more priority than single contests`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)
        val contest3 = createContest(40.date, 50.date, RegistrationType.PRE_REGISTRATION)

        val personMissedMore = createPerson("missed-two-single-contests").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest2, null)
            )
        }
        val personMissedLess = createPerson("missed-one-group-contest").apply {
            groupRegistrations(
                    createGroupRegistration(contest3, null)
            )
        }
        personRepository.setReturnData(personMissedMore, personMissedLess)
        val assignee = forTest.findForTime(15.date, 45.date)
        assertEquals(personMissedLess, assignee)
    }

    @Test
    fun `don't count twice contests overlapped each other`() {
        val contest1 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest2 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest3 = createContest(10.date, 20.date, RegistrationType.PRE_REGISTRATION)
        val contest4 = createContest(20.date, 30.date, RegistrationType.PRE_REGISTRATION)

        val personMissedLess = createPerson("missed-one").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest2, null),
                    createSingleRegistration(contest3, null)
            )
        }
        val peronMissedMore = createPerson("missed-two").apply {
            singleRegistrations(
                    createSingleRegistration(contest1, null),
                    createSingleRegistration(contest4, null)
            )
        }
        personRepository.setReturnData(personMissedLess, peronMissedMore)
        val assignee = forTest.findForTime(15.date, 25.date)
        assertEquals(personMissedLess, assignee)
    }

    private fun Person.groupRegistrations(vararg registrations: ContestParticipantGroup) {
        groupRegistrationsRepository.addPersonRegistrations(this, *registrations)
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
                on { toString() } doReturn personEmail
            }
        }

        private fun Person.tasks(vararg tasks: Task) {
            whenever(assignedTasks).thenReturn(tasks.toSet())
        }

        private fun Person.singleRegistrations(vararg registrations: ContestParticipant) {
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

        private fun createContest(start: Date, end: Date, cRegistrationType: RegistrationType): Contest {
            return mock {
                on { startDateTime } doReturn start
                on { endDateTime } doReturn end
                on { registrationType } doReturn cRegistrationType
            }
        }
    }
}
package ru.ifmo.cs.controller

import org.springframework.stereotype.Component
import ru.ifmo.cs.database.ContestParticipantGroupRepository
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.Contest
import ru.ifmo.cs.entity.Person
import ru.ifmo.cs.entity.RegistrationType
import ru.ifmo.cs.entity.UserRole
import java.util.*
import java.util.Comparator.comparing
import kotlin.math.min

@Component
class BestAssigneeFinderImpl(
        private val personRepository: PersonRepository,
        private val groupRegistrationRepository: ContestParticipantGroupRepository
) : BestAssigneeFinder {

    override fun find(): Person? {
        // TODO: implement it
        return null
    }

    override fun findForTime(taskStart: Date, taskEnd: Date): Person? {
        val volunteers = personRepository.findByRole(UserRole.VOLUNTEER)
        val withoutTaskOverlaps = volunteers.filter { person ->
            person.assignedTasks.none { task ->
                areDatesOverlap(task.startDateTime, task.endDateTime, taskStart, taskEnd)
            }
        }
        val comparator: Comparator<Person> = comparing<Person, Long> { person ->
            var totalOverlap = 0L
            for (registration in person.contestRegistrations) {
                val date = getParticipateStartEndForCountOverlap(registration.contest, registration.startDateTime)
                        ?: continue
                totalOverlap += datesOverlapMillis(date.first, date.second, taskStart, taskEnd)
            }
            val groupRegistrations = groupRegistrationRepository.findByMembersContains(person)
            for (registration in groupRegistrations) {
                val date = getParticipateStartEndForCountOverlap(registration.associatedContest, registration.startDateTime)
                        ?: continue
                totalOverlap += datesOverlapMillis(date.first, date.second, taskStart, taskEnd)
            }
            totalOverlap
        }
        return withoutTaskOverlaps.sortedWith(comparator).firstOrNull()
    }

    private companion object {
        private fun datesOverlapMillis(start1: Date, end1: Date, start2: Date, end2: Date): Long {
            if (start1 > start2) {
                return datesOverlapMillis(start2, end2, start1, end1)
            }
            if (end1 < start2) {
                return 0
            }
            return min(end1.time, end2.time) - start2.time
        }

        private fun areDatesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): Boolean {
            return datesOverlapMillis(start1, end1, start2, end2) > 0
        }

        private fun getParticipateStartEndForCountOverlap(contest: Contest, registrationStart: Date?): Pair<Date, Date>? {
            return when (contest.registrationType) {
                RegistrationType.OPEN -> {
                    // TODO: fix case when open registration contest is fully overlapped
                    // since registration is open, we can participate in any time, so no overlaps can be here
                    null
                }
                RegistrationType.PRE_REGISTRATION -> {
                    // in pre-registration contests we participant from contest start till contest end
                    contest.startDateTime to contest.endDateTime
                }
                RegistrationType.PRE_REGISTRATION_WITH_TIME -> {
                    if (registrationStart != null) {
                        // start time set, but we never now when participant will finish, so use full contest end time
                        registrationStart to contest.endDateTime
                    } else {
                        // if registration time is not already assigned to prevent overlaps after registration time
                        // will be assigned, we take full contest time here
                        contest.startDateTime to contest.endDateTime
                    }
                }
            }
        }
    }
}
package ru.ifmo.cs.controller

import org.springframework.stereotype.Component
import ru.ifmo.cs.database.ContestParticipantGroupRepository
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.*
import java.util.*
import java.util.Comparator.comparing
import java.util.Comparator.comparingInt
import kotlin.math.min


@Component
class BestAssigneeFinderImpl(
        private val personRepository: PersonRepository,
        private val groupRegistrationRepository: ContestParticipantGroupRepository
) : BestAssigneeFinder {

    override fun find(): Person? {
        val volunteers = personRepository.findByRole(UserRole.VOLUNTEER)
        return volunteers.minBy { it.assignedTasks.size }
    }

    override fun findForTime(taskStart: Date, taskEnd: Date): Person? {
        val volunteers = personRepository.findByRole(UserRole.VOLUNTEER)
        val withoutTaskOverlaps = volunteers.filter { person ->
            person.assignedTasks.none { task ->
                task.startDateTime != null && task.endDateTime != null &&
                        areDatesOverlap(task.startDateTime!!, task.endDateTime!!, taskStart, taskEnd)
            }
        }
        return withoutTaskOverlaps.minBy { getPersonDamageFromTask(taskStart, taskEnd, it) }
    }

    private fun getContestDamageType(contest: Contest, registrationStart: Date?,
                                     taskStart: Date, taskEnd: Date,
                                     oldTasks: Collection<Task>): ContestDamageType {
        if (contest.registrationType == RegistrationType.OPEN) {
            return getContestDamageTypeForOpenRegistrationContest(oldTasks,
                    contest.startDateTime, contest.endDateTime, taskStart, taskEnd)
        }

        val date = getParticipateStartEndForCountOverlap(contest, registrationStart)
                ?: return ContestDamageType.NOT_MISSED

        val alreadyOverlapped = oldTasks.any { task ->
            task.startDateTime != null && task.endDateTime != null &&
                    areDatesOverlap(date.first, date.second, task.startDateTime!!, task.endDateTime!!)
        }
        if (alreadyOverlapped) {
            return ContestDamageType.WAS_MISSED
        }
        if (areDatesOverlap(date.first, date.second, taskStart, taskEnd)) {
            return ContestDamageType.NEW_MISSED
        }
        return ContestDamageType.NOT_MISSED
    }

    private fun getContestDamageTypeForOpenRegistrationContest(oldTasks: Collection<Task>,
                                                               contestStartDateTime: Date,
                                                               contestEndDateTime: Date,
                                                               taskStart: Date, taskEnd: Date): ContestDamageType {
        val tasksBefore = oldTasks.mapNotNull {
            it.startDateTime ?: return@mapNotNull null
            it.endDateTime ?: return@mapNotNull null
            it.startDateTime!! to it.endDateTime!!
        }

        val wasOverlapped = isRangeFullyOverlapped(contestStartDateTime, contestEndDateTime, tasksBefore)
        if (wasOverlapped) {
            return ContestDamageType.WAS_MISSED
        }

        val tasksAfter = tasksBefore + (taskStart to taskEnd)
        val becameOverlapped = isRangeFullyOverlapped(contestStartDateTime, contestEndDateTime, tasksAfter)
        return if (becameOverlapped) {
            ContestDamageType.NEW_MISSED
        } else {
            ContestDamageType.NOT_MISSED
        }
    }

    private fun getPersonDamageFromTask(taskStart: Date, taskEnd: Date, person: Person): DamageFromTask {
        var wereMissedContests = 0
        var newMissedContests = 0
        var wereMissedGroupContests = 0
        var newMissedGroupContests = 0

        for (registration in person.contestRegistrations) {
            val damageType = getContestDamageType(registration.contest, registration.startDateTime,
                    taskStart, taskEnd, person.assignedTasks)

            when (damageType) {
                ContestDamageType.WAS_MISSED -> wereMissedContests++
                ContestDamageType.NEW_MISSED -> newMissedContests++
                ContestDamageType.NOT_MISSED -> Unit
            }
        }
        val groupRegistrations = groupRegistrationRepository.findByMembersContains(person)
        for (registration in groupRegistrations) {
            val damageType = getContestDamageType(registration.associatedContest, registration.startDateTime,
                    taskStart, taskEnd, person.assignedTasks)

            when (damageType) {
                ContestDamageType.WAS_MISSED -> wereMissedGroupContests++
                ContestDamageType.NEW_MISSED -> newMissedGroupContests++
                ContestDamageType.NOT_MISSED -> Unit
            }
        }
        return DamageFromTask(newMissedGroupContests, newMissedContests,
                wereMissedGroupContests + newMissedGroupContests,
                wereMissedContests + newMissedContests)
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

        private fun isRangeFullyOverlapped(start: Date, end: Date, ranges: Collection<Pair<Date, Date>>): Boolean {
            val sortedTasks = ranges.sortedBy { it.first }
            var firstNotOverlappedStart = start

            for ((rStart, rEnd) in sortedTasks) {
                if (rEnd <= firstNotOverlappedStart && rStart <= firstNotOverlappedStart) {
                    firstNotOverlappedStart = rEnd
                }
            }
            return firstNotOverlappedStart < end
        }
    }
}

private enum class ContestDamageType {
    NOT_MISSED,
    WAS_MISSED,
    NEW_MISSED
}

private data class DamageFromTask(
        val newMissedContest: Int,
        val newMissedGroupContest: Int,
        val totalMissedGroupContests: Int,
        val totalMissedContests: Int
) : Comparable<DamageFromTask> {

    override fun compareTo(other: DamageFromTask): Int = comparator.compare(this, other)

    private companion object {
        val comparator: Comparator<DamageFromTask> = comparingInt<DamageFromTask> { it.newMissedGroupContest }
                .thenComparingInt { it.newMissedContest }
                .thenComparingInt { it.totalMissedGroupContests }
                .thenComparingInt { it.totalMissedContests }
    }
}
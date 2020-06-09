package ru.ifmo.cs.controller

import org.springframework.stereotype.Component
import ru.ifmo.cs.database.ContestParticipantGroupRepository
import ru.ifmo.cs.database.PersonRepository
import ru.ifmo.cs.entity.*
import java.util.*
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
        val withoutTaskOverlaps = volunteers.filter { it.hasNoTaskBetweenTime(taskStart, taskEnd) }
        return withoutTaskOverlaps.minBy { it.getLossFromTask(taskStart, taskEnd) }
    }

    private fun Person.hasNoTaskBetweenTime(from: Date, to: Date): Boolean {
        return assignedTasks.none { task ->
            task.startDateTime != null && task.endDateTime != null &&
                    areDatesOverlap(task.startDateTime!!, task.endDateTime!!, from, to)
        }
    }

    private fun getContestMissType(contest: Contest, registrationStart: Date?,
                                   taskStart: Date, taskEnd: Date,
                                   oldTasks: Collection<Task>): ContestMissType {
        if (contest.registrationType == RegistrationType.OPEN) {
            return getContestMissTypeForOpenRegistrationContest(oldTasks,
                    contest.startDateTime, contest.endDateTime, taskStart, taskEnd)
        }

        val date = getParticipateStartEndForCountOverlap(contest, registrationStart)
                ?: return ContestMissType.NOT_MISSED

        val alreadyOverlapped = oldTasks.any { task ->
            task.startDateTime != null && task.endDateTime != null &&
                    areDatesOverlap(date.first, date.second, task.startDateTime!!, task.endDateTime!!)
        }
        if (alreadyOverlapped) {
            return ContestMissType.WAS_MISSED
        }
        if (areDatesOverlap(date.first, date.second, taskStart, taskEnd)) {
            return ContestMissType.NEW_MISSED
        }
        return ContestMissType.NOT_MISSED
    }

    private fun getContestMissTypeForOpenRegistrationContest(
            oldTasks: Collection<Task>,
            contestStartDateTime: Date,
            contestEndDateTime: Date,
            taskStart: Date, taskEnd: Date
    ): ContestMissType {
        val tasksBefore = oldTasks.mapNotNull {
            it.startDateTime ?: return@mapNotNull null
            it.endDateTime ?: return@mapNotNull null
            it.startDateTime!! to it.endDateTime!!
        }

        val wasOverlapped = isRangeFullyOverlapped(contestStartDateTime, contestEndDateTime, tasksBefore)
        if (wasOverlapped) {
            return ContestMissType.WAS_MISSED
        }

        val tasksAfter = tasksBefore + (taskStart to taskEnd)
        val becameOverlapped = isRangeFullyOverlapped(contestStartDateTime, contestEndDateTime, tasksAfter)
        return if (becameOverlapped) {
            ContestMissType.NEW_MISSED
        } else {
            ContestMissType.NOT_MISSED
        }
    }

    private fun Person.getLossFromTask(taskStart: Date, taskEnd: Date): LossFromTask {
        var wereMissedContests = 0
        var newMissedContests = 0
        var wereMissedGroupContests = 0
        var newMissedGroupContests = 0

        for (registration in contestRegistrations) {
            val damageType = getContestMissType(registration.contest, registration.startDateTime,
                    taskStart, taskEnd, assignedTasks)

            when (damageType) {
                ContestMissType.WAS_MISSED -> wereMissedContests++
                ContestMissType.NEW_MISSED -> newMissedContests++
                ContestMissType.NOT_MISSED -> Unit
            }
        }
        val groupRegistrations = groupRegistrationRepository.findByMembersContains(this)
        for (registration in groupRegistrations) {
            val damageType = getContestMissType(
                    registration.associatedContest, registration.startDateTime,
                    taskStart, taskEnd, assignedTasks)

            when (damageType) {
                ContestMissType.WAS_MISSED -> wereMissedGroupContests++
                ContestMissType.NEW_MISSED -> newMissedGroupContests++
                ContestMissType.NOT_MISSED -> Unit
            }
        }
        return LossFromTask(newMissedGroupContests, newMissedContests,
                wereMissedGroupContests + newMissedGroupContests,
                wereMissedContests + newMissedContests)
    }

    private enum class ContestMissType {
        NOT_MISSED,
        WAS_MISSED,
        NEW_MISSED
    }

    private data class LossFromTask(
            val newMissedContest: Int,
            val newMissedGroupContest: Int,
            val totalMissedGroupContests: Int,
            val totalMissedContests: Int
    ) : Comparable<LossFromTask> {

        override fun compareTo(other: LossFromTask): Int = COMPARATOR.compare(this, other)

        private companion object {
            val COMPARATOR: Comparator<LossFromTask> =
                    comparingInt<LossFromTask> { it.newMissedGroupContest }
                    .thenComparingInt { it.newMissedContest }
                    .thenComparingInt { it.totalMissedGroupContests }
                    .thenComparingInt { it.totalMissedContests }
        }
    }
}

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

private fun getParticipateStartEndForCountOverlap(contest: Contest,
                                                  registrationStart: Date?): Pair<Date, Date>? {
    return when (contest.registrationType) {
        RegistrationType.OPEN -> {
            // since registration is open, we can participate in any time, so no overlaps can be here
            null
        }
        RegistrationType.PRE_REGISTRATION -> {
            // in pre-registration contests participate from contest start till contest end
            contest.startDateTime to contest.endDateTime
        }
        RegistrationType.PRE_REGISTRATION_WITH_TIME -> {
            if (registrationStart != null) {
                // start time set, but we doesn't know when participant will finish, so use contest end time
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
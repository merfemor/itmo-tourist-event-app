package ru.ifmo.cs.controller

import ru.ifmo.cs.entity.Person
import java.util.*

interface BestAssigneeFinder {
    fun find(): Person?
    fun findForTime(taskStart: Date, taskEnd: Date): Person?
}
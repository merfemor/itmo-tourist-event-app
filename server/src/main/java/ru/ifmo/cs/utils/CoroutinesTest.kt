package ru.ifmo.cs.utils

import kotlinx.coroutines.*


suspend fun doLongJob(n: Int = 0, time: Long = 1000) {
    printlnTh("Start job $n")
//    Thread.sleep(time)
    delay(time)
    printlnTh("End job $n")
}

fun printlnTh(text: String) {
    println("${Thread.currentThread().name}: $text")
}

fun main() = runBlocking {
    printlnTh("Start run blocking")
    launch {
        printlnTh("Start launch")
        doLongJob(1)
        printlnTh("Start 2nd")
        doLongJob(2)
        printlnTh("End launch")
    }
    launch {
        printlnTh("Start launch 2")
        doLongJob(3)
        printlnTh("End launch 2")
    }
    printlnTh("Before scope")
    coroutineScope {
        printlnTh("In scope")
        launch {
            printlnTh("In scope launch")
            doLongJob(4)
            printlnTh("End scope launch")
        }
        printlnTh("End scope")
    }
    printlnTh("Finish run blocking")
}
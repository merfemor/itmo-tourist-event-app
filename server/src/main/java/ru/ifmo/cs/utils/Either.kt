package ru.ifmo.cs.utils

import java.util.*
import java.util.function.Consumer
import java.util.function.Function

class Either<L, R> private constructor(private val left: L?, private val right: R?) {

    init {
        if (left != null && right != null) {
            throw IllegalArgumentException("either left or right must be null")
        }
        if (left == null && right == null) {
            throw IllegalArgumentException("either left or right must be not null")
        }
    }

    fun getLeftSure() = left!!

    fun getRightSure() = right!!

    fun isLeft() = left != null

    fun isRight() = right != null

    fun getLeft(): Optional<L> {
        return Optional.ofNullable(left)
    }

    fun getRight(): Optional<R> {
        return Optional.ofNullable(right)
    }

    fun <NL, NR> map(leftMap: Function<L, NL>, rightMap: Function<R, NR>): Either<NL, NR> {
        return if (left != null) Either.left(leftMap.apply(left)) else Either.right(rightMap.apply(right!!))
    }

    fun doOnLeft(leftConsumer: Consumer<L>): Either<L, R> {
        if (left != null) {
            leftConsumer.accept(left)
        }
        return this
    }

    fun doOnRight(rightConsumer: Consumer<R>): Either<L, R> {
        if (right != null) {
            rightConsumer.accept(right)
        }
        return this
    }

    fun <T> mapToResult(leftMap: Function<L, T>, rightMap: Function<R, T>): T {
        return if (left != null) leftMap.apply(left) else rightMap.apply(right!!)
    }

    companion object {
        @JvmStatic
        fun <L, R> left(l: L): Either<L, R> {
            return Either(l, null)
        }

        @JvmStatic
        fun <L, R> right(r: R): Either<L, R> {
            return Either(null, r)
        }
    }
}

import React from "react";
import {If} from "./components";
import moment from "moment";

export function userRoleToString(role) {
    switch (role) {
        case "PARTICIPANT":
            return "участник";
        case "VOLUNTEER":
            return "волонтёр";
        case "ORGANIZER":
            return "организатор";
        default:
            console.error("Unknown role: " + role)
            return "-";
    }
}

export function personFullName(person) {
    return `${person.lastName} ${person.firstName} ${person.middleName}`
}

export function personShortName(person) {
    const middleName = person.middleName && ` ${person.middleName[0]}.`
    return `${person.lastName} ${person.firstName[0]}.${middleName}`
}

function secondsToTimeString(seconds) {
    const secM = seconds % 60
    const minutes = Math.floor(seconds / 60)
    let minutesStr = `${minutes}`
    if (minutes < 10) {
        minutesStr = "0" + minutesStr
    }
    let secondsStr = `${secM}`
    if (secM < 10) {
        secondsStr = "0" + secondsStr
    }
    return `${minutesStr}:${secondsStr}`
}

export function resultToString(result) {
    if (result == null) {
        return "-"
    }
    return <div>
        <If cond={result.time != null}>
            <b>Время: </b> {secondsToTimeString(result.time)} <br/>
        </If>
        <If cond={result.points != null}>
            <b>Баллы: </b> {result.points} <br/>
        </If>
        <If cond={result.penalty != null}>
            <b>Штраф: </b> {result.penalty}
        </If>
    </div>
}

const DATE_TIME_FORMAT_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric'
};

export function dateTimeToString(dateString) {
    const date = Date.parse(dateString)
    return Intl.DateTimeFormat("ru-RU", DATE_TIME_FORMAT_OPTIONS).format(date)
}

export function dateIntervalToString(from, to) {
    return `${dateTimeToString(from)} - ${dateTimeToString(to)}`
}

export const DATETIME_RANGE_CONTAINER_LOCAL = {
    format: "DD.MM.YYYY HH:mm",
    sundayFirst: false,
    days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: [
        'Январь',
        'Ферваль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ],
    fromDate: 'Начало',
    toDate: 'Конец',
    apply: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    maxDate: 'Максимальная дата'
}
Object.freeze(DATETIME_RANGE_CONTAINER_LOCAL)

export function momentToServerJsonVal(dt) {
    return dt.valueOf()
}

export function momentFromServerJsonVal(jsonVal) {
    if (jsonVal == null) {
        return null
    }
    return moment(Date.parse(jsonVal))
}


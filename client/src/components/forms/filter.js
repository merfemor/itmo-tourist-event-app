import {personFullName} from "../../utils/language_utils";

export function filterPersonByQuery(it, filterQuery) {
    return includesLowerCase(personFullName(it), filterQuery)
}

export function includesLowerCase(str, query) {
    str = str?.toLowerCase() || ""
    query = query?.toLowerCase() || ""
    const res = str.includes(query)
    return res
}
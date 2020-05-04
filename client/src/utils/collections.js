export function anyMatches(collection, predicate) {
    for (let i = 0; i < collection.length; i++) {
        if (predicate(collection[i])) {
            return true
        }
    }
    return false
}
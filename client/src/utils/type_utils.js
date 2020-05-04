export function isNullOrEmpty(str) {
    return str == null || str === ""
}

export function isNotEmpty(str) {
    return str != null && str !== ""
}

export function parseBoolean(str) {
    if (isNullOrEmpty(str)) {
        return null
    }
    if (str === "true") {
        return true
    }
    if (str === "false") {
        return false
    }
    throw new Error("Failed to parse boolean from string \"" + str + "\"")
}
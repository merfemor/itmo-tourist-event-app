function formatLogString(tag, message, object) {
    return tag + ": " + message + (object ? JSON.stringify(object) : "");
}

export const Log = {
    d: (tag, message, object) => {
        console.log(formatLogString(tag, message, object))
    },
    w: (tag, message, object) => {
        console.warn(formatLogString(tag, message, object))
    }
}
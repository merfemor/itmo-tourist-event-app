export const Log = {
    d: (tag, message, object) => {
        console.log(tag + ":", message, object || "")
    },
    w: (tag, message, object) => {
        console.warn(tag + ":", message, object || "")
    }
}
Object.freeze(Log)
interface RGB {
    red: number;
    green: number;
    blue: number;
}
interface HSV {
    hue: number;
    saturation: number;
    value: number;
}
function setColor(color: RGB | HSV) {
    if ("hue" in color) {
        // 'color' now has the type HSV
    }
    // ...
}

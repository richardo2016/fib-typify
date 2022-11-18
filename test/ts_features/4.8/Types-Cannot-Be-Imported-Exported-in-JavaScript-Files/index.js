// @ts-check
// Will fail at runtime because 'SomeType' is not a value.
import { ComponentClass } from "react";
/**
 * @type {ComponentClass}
 */
export const myValue = ComponentClass;
/**
 * @typedef {string | number} MyType
 */
// Will fail at runtime because 'MyType' is not a value.
export { MyType as MyExportedType };

/// <reference lib="es2015" />

import * as React from "react";
interface Props {
    stuff?: string;
}
function MyComponent(props: unknown) {
    return <div {...props} />;
}

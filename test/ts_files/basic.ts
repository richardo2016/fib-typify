#!/usr/bin/fibjs env
/// <reference path="index.d.ts" />

export function add(a: number, b: number) {
    return a + b
}

export function http() {
    return 'http'
}

export function hello() {
    return 'hello, world'
}

console.log('[basic]')
console.log('[basic] __dirname === global.__dirname', __dirname === global.__dirname)
console.log('[basic] __filename === global.__filename', __filename === global.__filename)
console.log('[basic] require === global.require', require === global.require)
console.log('[basic] run === global.run', run === global.run)

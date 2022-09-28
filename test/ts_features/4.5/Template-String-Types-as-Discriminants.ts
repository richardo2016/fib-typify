export interface Success {
    type: `${string}Success`;
    body: string;
}

export interface Error {
    type: `${string}Error`;
    message: string
}

export function handler(r: Success | Error) {
    if (r.type === "HttpSuccess") {
        const token = r.body;
        // (parameter) r: Success
    }
}

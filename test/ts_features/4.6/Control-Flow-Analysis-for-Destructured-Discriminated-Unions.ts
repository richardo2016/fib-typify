/**
 * Previously TypeScript would error on these - once kind and payload were extracted from the same object into variables, they were considered totally independent.
 *
 * In TypeScript 4.6, this just works!
 */
type Action =
  | { kind: "NumberContents"; payload: number }
  | { kind: "StringContents"; payload: string };
function processAction(action: Action) {
  const { kind, payload } = action;
  if (kind === "NumberContents") {
    let num = payload * 2;
    // ...
  } else if (kind === "StringContents") {
    const str = payload.trim();
    // ...
  }
}

# https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
dirs=(
    "The-satisfies-Operator"
    "Unlisted-Property-Narrowing-with-the-in-Operator"
    "Auto-Accessors-in-Classes"
    "Checks-For-Equality-on-NaN"
    "File-Watching-Now-Uses-File-System-Events"
    "Remove-Unused-Imports-and-Sort-Imports-Commands-for-Editors"
    "Go-to-Definition-on-return-Keywords"
    "Performance-Improvements"
    "Correctness-Fixes-and-Breaking-Changes"
    "lib.d.ts-Updates"
    "Better-Types-for-Promise.resolve"
    "JavaScript-Emit-No-Longer-Elides-Imports"
    "exports-is-Prioritized-Over-typesVersions"
    "substitute-Replaced-With-constraint-on-SubstitutionTypes"
)

# make dir and put one index.ts in it、
for dir in ${dirs[@]}; do
    mkdir -p $dir
    [ ! -f $dir/index.ts ] && touch $dir/index.ts
done

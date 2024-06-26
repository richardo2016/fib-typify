
v0.11.6 / 2024-04-17
==================

  * feat: support typescript 4.9 (#24)
  * build: adapt to fibjs 0.37 (#23)
  * feat: upgrade dep.

v0.11.5 / 2022-12-04
====================

  * Release v0.11.5
  * fix: remove LINE_MARKER before redunt cache map content.

v0.11.4 / 2022-11-18
====================

  * Release v0.11.4
  * fix: test case.
  * feat: adapt to typescript 4.8, use this version by default.
  * feat: adapt to typescript 4.7, use this version by default.
  * feat: upgrade version of @fxjs/cli

v0.11.3 / 2022-10-01
====================

  * Release v0.11.3
  * fix: lack of required tsconfig files
  * ci: upgrade ci.

v0.11.2 / 2022-09-29
====================

  * Release v0.11.2
  * feat: adapt to typescript 4.6, use this version by default.
  * chore: specify files to publish.

v0.11.1 / 2022-09-29
====================

  * Release v0.11.1
  * feat: adapt to typescript 4.5, use this version by default.

v0.11.0-rc.1 / 2022-09-29
=========================

  * Release v0.11.0-rc.1
  * feat: allow typescript between 4.1 to 4.4
  * test: add test about typescript@4.4.x
  * feat: adapt to typescript to 4.4 and use it by default. (#22)

v0.11.0 / 2022-09-27
====================

  * Release v0.11.0
  * ci: update support version.
  * feat: allow user use typescript > 4.3
  * update ci config
  * feat: use typescript@4.3 by default, add test about it.
  * doc: add jsdoc for some functions about compiler.

v0.10.0 / 2021-10-12
====================

  * Release v0.10.0
  * ci: stop support to fibjs 0.31
  * feat: support typescript 4.2 (#21)
  * ci: upgrade ci config.
  * ci: migrate to github actions.
  * chore: upgrade deps, fix tsconfig.json

v0.9.0 / 2021-05-08
===================

  * Release v0.9.0
  * feat: upgrade typescript to 4.1.x:
  * chore: deprecate some top level apis
  * bugfix: set non-boolean type option as string type for @fxjs/cli
  * chore: adapt to fibjs >= 0.32.0 only

v0.8.6 / 2021-03-04
===================

  * Release v0.8.6
  * bugfix: fixup usage of `ChainLoader['_moduleOptions']`
  * feat: lock typescript version at 4.0.x to avoid bad case about tsconfig.
  * feat: type robust change.
  * feat: support new binary `fwatch`
  * chore: update exposed index typo.
  * chore: update TODO.
  * chore: upgrade ci version.

v0.8.5 / 2020-08-26
===================

  * Release v0.8.5
  * chore: upgrade typescript@4

v0.8.4 / 2020-05-26
===================

  * Release v0.8.4
  * chore: recover old implementation for `registerTsCompiler` (#19)
  * docs: add yaoqiaofeng as a contributor (#18)
  * chore: update README.md

v0.8.3 / 2020-05-25
===================

  * Release v0.8.3
  * chore: code clean
  * fix: fix compilation error on ts@3.9. (#17)
  * Merge branch 'master' of github.com:richardo2016/fib-typify
  * chore: delight all contributors.
  * docs: add richardo2016 as a contributor (#16)
  * chore: delight contributors section
  * chore: fixup crash when `outDir` set in runmode.
  * chore: robust change.
  * chore: code clean.
  * chore: update README.md

v0.8.2 / 2020-05-25
===================

  * Release v0.8.2

v0.8.1 / 2020-05-25
===================

  * Release v0.8.1
  * feat: support more ts build options to ftsc, add test basic sample for ftsc.
  * chore: update doc.

v0.8.0 / 2020-05-24
===================

  * Release v0.8.0
  * feat: replace program API in registerTsCompiler
  * feat: use customized ts program (#14)

v0.7.0 / 2019-09-07
===================

  * Release v0.7.0
  * support compile .tsx to .js
  * upgrade ci config.
  * upgrade dependencies; deprecate old api.

v0.6.0 / 2019-06-03
===================

  * Release v0.6.0
  * upgrade dependency
  * keep shebang
  * replace @types/fibjs with @fibjs/types.
  * use @fxjs/cli as cli maker.

v0.5.2 / 2019-01-18
===================

  * Release v0.5.2
  * typo fix.

v0.5.1 / 2019-01-12
===================

  * Release v0.5.1
  * fix implement of `resolveExistedEntry`.
  * test case fix.
  * normalize README.md
  * normalize args.
  * move general from `fibTypify` to `Typify`.
  * support auto fallback to `compileFileTo` in `compileDirectoryTo`.
  * fix test case for fibjs <= 0.26.x, where isSupportSetModuleCompiler() === false
  * robust for source-map.
  * fix grandmother-paradox style generating.
  * robust for `compileDirectoryTo`.
  * support use typescript script as entry point.
  * normalize cli script.
  * add 'types' to package.json.
  * publish.

v0.5.0 / 2018-12-28
===================

  * Release v0.5.0
  * adjust for publish.
  * doc normalization.
  * add new feature to doc, fix typo.
  * add test case about using shared Error constructor with`coroutine.start`.
  * adjust directory, add test cases about sourceMap.
  * code format.
  * add some test cases(with TODO record).
  * support emit correct stack lineNumber/columNumber when error occured in typescript.

v0.4.1 / 2018-11-25
===================

  * Release v0.4.1
  * add appveyor ci badget.
  * add appveyor ci config.
  * abstract utils overwriteFile
  * fix overwriting failure when executing '_getCopyWhiteListViaGlobrule'.
  * [README.md] add marked sample before `introduction`.

v0.4.0 / 2018-11-03
===================

  * Release v0.4.0
  * update README.md
  * support read compilerOptions from 'tsconfig.json', and depreacte two useless util functions.

v0.3.1 / 2018-10-02
===================

  * Release v0.3.1
  * fix mistake about fibjs@0.21.0 of builtin-modules
  * upgrade '@types/fibjs'
  * [README.md] update

v0.3.0 / 2018-08-21
===================

  * Release v0.3.0
  * [README] add content about loaderBox.
  * [@fibjs/ci:config] remove 0.21.0, add 0.26.1
  * support loader for fibjs with version between 0.21.0, 0.26.0

v0.2.1 / 2018-08-17
===================

  * Release v0.2.1
  * add 'moduleName' option to sboxOpts.
  * rename 'compileRawToSandbox' to 'compileRawToSandBox', and do other name normalization.
  * fix and update README.md.

v0.2.0 / 2018-06-18
===================

  * 0.2.0
  * fix implement of  cli option '-c', update README.md

v0.1.3 / 2018-06-17
===================

  * 0.1.3
  * fix test case, then update ci config.
  * support bin 'fib-typify'.
  * Merge pull request #2 from richardo2016/dev

v0.1.2 / 2018-06-10
===================

  * 0.1.2
  * support new option in `compileDirToOpts`.
  * v0.1.1
  * correct APIs in README.md
  * add travis ci and npm version badget.
  * add '@fibjs/ci' to support ci.
  * v0.1.0
  * support providing 'compilerOptions' when calling 'compileDirectoryTo'.
  * update README.md
  * init.
  * Initial commit

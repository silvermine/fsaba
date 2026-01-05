# fsaba

[![NPM Version][npm-version]][npm-version-url]
[![License][license-badge]][license-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Conventional Commits][conventional-commits-badge]][conventional-commits-url]

[npm-version]: https://img.shields.io/npm/v/@silvermine/fsaba.svg
[npm-version-url]: https://www.npmjs.com/package/@silvermine/fsaba
[license-badge]: https://img.shields.io/github/license/silvermine/fsaba.svg
[license-url]: ./LICENSE
[coverage-badge]: https://coveralls.io/repos/github/silvermine/fsaba/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/silvermine/fsaba?branch=master
[conventional-commits-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-url]: https://conventionalcommits.org

## What?

FSABA (Fine-grained Subject-Action-Based Authorization) is a policy-based authorization
library. It allows you to define roles with policies that specify what actions subjects
(users) can perform on which resources, with optional conditions for fine-grained access
control.

## Why?

Building authorization logic from scratch is error-prone and often leads to inconsistent
access control across an application. FSABA provides a declarative, testable approach to
authorization that separates policy definitions from application code, making it easier to
reason about and audit permissions.

## License

This software is released under the MIT license. See [the license
file](LICENSE) for more details.

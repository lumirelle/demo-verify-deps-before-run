# Demo -- Verify Deps Before Run

[![License][license-src]][license-href]

A demo of script to port PNPM's verify deps before run to NPM & Yarn with zero-dependency.

## Background

As we all know, using same package manager across team is important to ensure
everyone has the same development environment.

However, sometimes we have to tolerate other members who have different opinions
on package managers. In such cases, the only things we can do is to working hard
to keep the development environment consistent.

PNPM has a nice feature called "verify deps before run", which checks whether
the dependencies are valid before running any scripts. If not, it will
prompt/install the dependencies automatically.

In order to achieve similar behavior with NPM & Yarn, I created this demo
project.

> [!Note]
>
> I only tested this script with NPM & Yarn (Classic). If you have any ideas to
> support other package managers (e.g. Yarn Berry), please feel free to
> contribute!

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE.md) License © [Lumirelle](https://github.com/Lumirelle)

<!-- Badges -->

[license-src]: https://img.shields.io/github/license/lumirelle/demo-verify-deps-before-run.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/lumirelle/demo-verify-deps-before-run/blob/main/LICENSE.md

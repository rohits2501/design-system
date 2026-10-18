# 0001 rationale

## Context

You want one visual language across future GitHub projects, then the same language in the document console, AudioForge, and the Bol dictation screen. Those three apps do not share a framework. Two are Next.js. Bol is Expo, and its keyboards are native.

If the library is tied to one app framework, every later project inherits that framework. If each app keeps its own palette, the GitHub set never looks like one product. The library has to install as CSS plus React, and as a plain token object a React Native screen can import.

## Options considered

### Option 1: Next.js as the host

The catalog and the packages live in a Next.js app. Later projects copy that install path.

**Pros**:

- Matches the document console and AudioForge, which already run Next.js.
- Server rendering is built in.

**Cons**:

- The catalog would prove a Next.js install, not a shared one.
- Bol cannot import Next.js components.

### Option 2: TanStack Start as the host

The catalog is a TanStack Start app. Packages import Start.

**Pros**:

- Start 1.0 is stable and sits on Vite, so CSS imports stay ordinary.
- New apps would match the catalog exactly.

**Cons**:

- Start's server component package is still early (0.1).
- A library that imports Start cannot drop into the existing Next.js apps or into Bol.

### Option 3: Vite+ library, framework left to the app

Vite+ 1.3.0 builds a token package, a React package, and a Vite catalog. Packages import neither Next.js nor TanStack Start. New apps may use Start. Existing apps keep their framework.

**Pros**:

- One install path for a Vite app, a Next.js app, and a React Native screen (the token object).
- The catalog is only a theme gallery, so it does not need server functions.

**Cons**:

- You learn Vite+ (the `vp` command) for this repo.
- Consumers do not have to install `vp`. The published contract is CSS plus a React entry plus a token object.

## Rationale

You already weighed Next.js, TanStack Start, and Vite+ while planning this repo, and you asked to pin the current Vite+ release (1.3.0, 16 October 2026) rather than the "1.0 is here" headline. The library has to serve a Next.js console, a Next.js editorial app, and an Expo screen. Putting Start or Next.js inside the package would make two of those three wait on a rewrite. Vite+ is the toolchain for this repo only. The contract other repos import is boring on purpose: a CSS file, a React entry, and a plain token object.

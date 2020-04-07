# faunadb-js

Unofficial driver

## Why

Fauna is an awesome database but its JavaScript driver is a little bit outdated. It was designed for Node.js and only slightly updated afterward. I opened some issues and from the responses, I realized Fauna does not have enough resources to improve it. I'm sure it will change but I don't want to wait. The library is relatively simple, it's just a data mapper. It can be perfect but it isn't (yet).

## Goals

- TypeScript source code is a must nowadays.
- API should be typed and well documented.
- Types should be validated/parsed also in run-time. When we use io-ts, we can have it for free.
- Fauna models must be serializable via JSON.stringify. Using getters and override toJSON is a design flaw. While Fauna can later switch to something different like Protocol buffers etc., the users of Fauna driver have to have the ability to send Fauna types to clients and back, which is almost impossible right now.

So I set up the repo with tree-shakeable TypeScript library, eslint, jest, etc., and made Client stub. I am not sure how much time I will have to complete it, but I believe this is a good start.

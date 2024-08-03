# secure-localhost 🔒

Proxy your specified localhost port to HTTPS, with automatic certificate installation.

## Why?

+ You're developing locally and stuck with [`SameSite: None` cookie problem](https://stackoverflow.com/questions/60069054/how-to-overcome-the-effect-of-chromes-samesite-cookie-update-in-the-case-of-loc)
+ You don't want to proxy your dev [to external servers](https://ngrok.com)
+ You just wish you could use HTTPS on your localhost

## Start

Using `npx` from Node.JS allows you to [run NPM binaries](https://docs.npmjs.com/cli/v7/commands/npx) without having them installed first.

Forward port 443 (HTTPS default port) to 80 with HTTPS:

```bash
$ npx secure-localhost
```

Forward port 443 to 8000 (pass it to args) with HTTPS:

```bash
$ npx secure-localhost 8000
```

More options run `npx secure-localhost --help`

> For the first launch, you'll asked to install the HTTPS certificate. For windows it will be a dialog prompt. For unix, a sudo password will be asked.

> The certificate is saved to `~/.certs/secure-localhost-server.crt` and `~/.certs/secure-localhost-server.key`

## Caveat

+ Only tested in Windows and Linux for now (Mac users: help us!)
+ If ran without sudo in Unix, it uses port 8443 instead of 433
+ Requires `openssh` to be installed/available on CLI

# secure-localhost 🔒

Proxy your specified localhost port to 443, with automatic HTTPS certificate installation.

## Why?

+ You're developing locally and stuck with [`SameSite: None` cookie problem](https://stackoverflow.com/questions/60069054/how-to-overcome-the-effect-of-chromes-samesite-cookie-update-in-the-case-of-loc)
+ You don't want to proxy your dev [to external servers](https://ngrok.com)
+ You just wish you could use HTTPS on your localhost

## Start

Redirect port 80 to 443 with HTTPS:

```
$ npx secure-localhost
```

Redirect port 8000 to 443 with HTTPS:

```
$ npx secure-localhost 8000
```

> In Windows, for the first launch, you'll asked for a prompt to install the HTTPS certificate.

> The certificate is saved to `~/.certs/secure-localhost-server.crt` and `~/.certs/secure-localhost-server.key`

## Caveat
+ Only support Windows for first installation (UNIX users: help us!)
+ Requires `openssh` to be installed

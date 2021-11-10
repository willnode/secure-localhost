var fs = require('fs');
var path = require('path');
var httpProxy = require('http-proxy');
const create = require('./create');
const approve = require('./approve');

module.exports = async function (target, port) {
    const dir = path.join(require('os').homedir(), '.certs');
    const key = path.join(dir, 'secure-localhost-server.key');
    const cert = path.join(dir, 'secure-localhost-server.crt');

    fs.mkdirSync(dir, {
        recursive: true
    });

    console.log(await create(key, cert));
    console.log(await approve(key, cert));
    var p = httpProxy.createServer({
        target: target,
        ssl: {
            key: fs.readFileSync(key, 'utf8'),
            cert: fs.readFileSync(cert, 'utf8')
        },
        autoRewrite: true,
        changeOrigin: true,
        ws: true,
        xfwd: true,
        hostRewrite: true,
    })
    p.listen(port);
    p.on('error', function (err) {
        console.error(err);
    })
    console.log('Proxing to "%s" through "https://localhost:%s"', target, port);

};
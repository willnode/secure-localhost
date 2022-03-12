var fs = require('fs');
const spawn_util = require('./spawn_util');

module.exports = async function (key, cert) {
    if (!(fs.existsSync(key) && fs.existsSync(cert))) {
        try {
            switch (process.platform) {
                case 'win32':
                    // openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes -keyout ~/.certs/secure-localhost-server.key -out ~/.certs/secure-localhost-server.crt -subj /CN=localhost -addext subjectAltName=DNS:localhost,IP:127.0.0.1
                    await spawn_util('openssl', [
                        'req', '-x509', '-newkey', 'rsa:4096', '-sha256', '-days', '365', '-nodes',
                        '-keyout', key, '-out', cert, '-subj', '/CN=localhost', '-addext',
                        'subjectAltName=DNS:localhost,IP:127.0.0.1'
                    ]);
                    break;
                case 'darwin':
                case 'linux':
                    // openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes -keyout ~/.certs/secure-localhost-server.key -out ~/.certs/secure-localhost-server.crt -subj /CN=localhost -config <(cat /System/Library/OpenSSL/openssl.cnf <(printf '[SAN]\nsubjectAltName=DNS:dev.mycompany.com'))
                    await spawn_util('openssl', [
                        'req', '-x509', '-newkey', 'rsa:4096', '-sha256', '-days', '365', '-nodes',
                        '-keyout', key, '-out', cert, '-subj', '/CN=localhost', '-reqexts', 'SAN', '-extensions', 'SAN', '-config',
                        __dirname + '/openssl.cnf'
                    ]);
                    break;
            }
            resolve('SSL certs created');
        } catch (code) {
            if (code instanceof Error) {
                throw code;
            }
            throw 'SSL certs creation failed with code ' + code;
        }
    } else {
        resolve('SSL certs already exist');
    }
};
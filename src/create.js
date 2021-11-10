var fs = require('fs');
var path = require('path');

module.exports = function (key, cert) {
    return new Promise(function (resolve, reject) {

        if (!(fs.existsSync(key) && fs.existsSync(cert))) {
            var child = require('child_process').spawn('openssl', [
                'req', '-x509', '-newkey', 'rsa:4096', '-sha256', '-days', '365', '-nodes', '-keyout', key, '-out', cert, '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1'
            ]);
            child.stdout.on('data', function (data) {
             //   process.stdout.write(data);
            });
            child.stderr.on('data', function (data) {
            //    process.stderr.write(data);
            });
            child.on('close', function (code) {
                resolve('SSL certs created');
            });
        } else {
            resolve('SSL certs already exist');
        }
    });
};
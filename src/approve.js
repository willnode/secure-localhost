var fs = require('fs');
var path = require('path');

module.exports = function (key, cert) {
    return new Promise(function (resolve, reject) {
        if ((fs.existsSync(key) && fs.existsSync(cert))) {
            var spawn = require('child_process').spawn;
            let child;
            switch (process.platform) {
                case 'win32':
                    child = spawn('certutil', ['-addstore', '-user', 'root', cert]);
                case 'darwin':
                    child = spawn('security', ['add-trusted-cert', '-d', '-r', 'trustRoot', '-k', '/Library/Keychains/System.keychain', cert]);
                case 'linux':
                    child = spawn('certutil', ['certutil', '-A', '-d', 'sql:~/.pki/nssdb', '-t', 'C', '-n', 'Certificate Common Name', '-i', cert]);
            }
            child.stdout.on('data', function (data) {
                // process.stdout.write(data);
            });
            child.stderr.on('data', function (data) {
                //  process.stderr.write(data);
            });
            child.on('close', function (code) {
                if (code === 0) {
                    resolve('SSL approved');
                } else {
                    reject(new Error('Failed to add certificate to trusted store'));
                }
                resolve();
            });
        } else {
            resolve();
        }
    });
};
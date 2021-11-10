var fs = require('fs');
var path = require('path');

module.exports = function (key, cert) {
    return new Promise(function (resolve, reject) {
        if ((fs.existsSync(key) && fs.existsSync(cert))) {
            var child = require('child_process').spawn('certutil', ['-addstore', '-user', 'root', cert]);
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
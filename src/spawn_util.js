var execFile = require('child_process').execFile;

module.exports = function (commands, args) {
    return new Promise(function (resolve, reject) {
        execFile(commands, args, {
            stdio: 'pipe',
        }, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    })
};
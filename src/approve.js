var fs = require('fs');
const spawn_util = require('./spawn_util');

module.exports = async function (key, cert) {
    if ((fs.existsSync(key) && fs.existsSync(cert))) {
        try {
            switch (process.platform) {
                case 'win32':
                    await spawn_util('certutil', ['-addstore', '-user', 'root', cert]);
                    break;
                case 'darwin':
                    try {
                        if (!(await spawn_util('security', ['verify-cert', '-p', 'ssl', '-n', 'localhost', '-r', cert])).includes('not verified')) throw new Error();
                    } catch (error) {
                        if (process.getuid() === 0) {
                            await spawn_util('security', ['add-trusted-cert', '-r', 'trustRoot', '-p', 'ssl', '-p', 'basic', '-s', 'localhost', '-k', '/Library/Keychains/System.keychain', cert]);
                        } else {
                            throw new Error('Certificate is not verified. Please run this command as root (for once).');
                        }
                    }
                    break;
                case 'linux':
                    await spawn_util('certutil', ['certutil', '-A', '-d', 'sql:~/.pki/nssdb', '-t', 'C', '-n', 'Certificate Common Name', '-i', cert]);
                    break;
            }
            return ('SSL approved');
        } catch (code) {
            if (code instanceof Error) {
                throw code;
            }
            throw (new Error('Failed to add certificate to trusted store with code ' + code));
        }
    }
};
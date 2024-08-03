var fs = require('fs');
const spawn_util = require('./spawn_util');
const { execSync } = require('child_process');

const shell = (cmd) => execSync(cmd, { encoding: 'utf8' });

function executableIsAvailable(name) {
    try { shell(`which ${name}`); return true }
    catch (error) { return false }
}

async function approveWin32(cert) {
    await spawn_util('certutil', ['-addstore', '-user', 'root', cert]);
}

async function approveUnix(...cmds) {
    if (process.getuid() === 0) {
        for (const cmd of cmds) {
            await spawn_util(cmd[0], cmd.slice(1));
        }
    } else {
        console.log('Attempting to trust a self signed cert, sudo is required...');
        for (const cmd of cmds) {
            await spawn_util('sudo', cmd);
        }
    }
}

async function approveDarwin(cert) {
    if ((await spawn_util('security', ['verify-cert', '-p', 'ssl', '-n', 'localhost', '-r', cert])).includes('not verified')) {
        await approveUnix(['security', 'add-trusted-cert', '-r', 'trustRoot', '-p', 'ssl', '-p', 'basic', '-s', 'localhost', '-k', '/Library/Keychains/System.keychain', cert])
    }
}

async function approveLinux(cert) {
    if (executableIsAvailable('update-ca-certificates')) {
        // debian
        let destCert = '/usr/local/share/ca-certificates/secure-localhost.crt';
        if (fs.existsSync(destCert)) {
            return;
        }
        console.log('Attempting to trust a self signed cert, sudo is required...');
        await approveUnix(['cp', cert, destCert], ['update-ca-certificates'])
    } else if (executableIsAvailable('update-ca-trust')) {
        // arch / fedora / rhel
        let destCert = '/etc/pki/ca-trust/source/anchors/secure-localhost.crt';
        if (fs.existsSync(destCert)) {
            return;
        }
        await approveUnix(['cp', cert, destCert], ['update-ca-trust'])
    }
}

module.exports = async function (key, cert) {
    if (!fs.existsSync(key) || !fs.existsSync(cert)) {
        return;
    }
    try {
        switch (process.platform) {
            case 'win32':
                await approveWin32(cert);
                break;
            case 'darwin':
                await approveDarwin(cert);
                break;
            case 'linux':
                await approveLinux(cert);
                break;
            default:
                throw new Error('Unsupported platform ' + process.platform)
        }
        return 'SSL approved';
    } catch (code) {
        if (code instanceof Error) {
            throw code;
        }
        throw new Error('Failed to add certificate to trusted store with code ' + code);
    }
};

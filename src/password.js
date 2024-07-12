import crypto from "crypto";

export async function password_hash(password){
    return new Promise(async (resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
                if(err) reject(err);
                else resolve({password: key.toString('base64'), hash: buf.toString('base64')});
            });
        });
    });
}

export async function password_hash_check(password, buf){
    return new Promise(async (resolve, reject) => {
        crypto.pbkdf2(password, buf, 100000, 64, 'sha512', (err, key) => {
            resolve(key.toString('base64'));
        });
    });
}
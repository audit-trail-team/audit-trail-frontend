const crypto = require('crypto');

function encrypt(text, key) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted; // Prepend the IV to the ciphertext
}

function decrypt(ciphertext, key) {
    const components = ciphertext.split(':');
    const iv = Buffer.from(components.shift(), 'base64');
    const encryptedText = components.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage
const key = crypto.randomBytes(32); // The key should be secure and managed appropriately
const text = "Hello, world!";
const encrypted = encrypt(text, key);
console.log('Encrypted:', encrypted);
const decrypted = decrypt(encrypted, key);
console.log('Decrypted:', decrypted);

"use server";

import * as crypto from "crypto";

// Key should be appropriate for the AES variant you choose: AES-256 uses a 32-byte key.
const algorithm = "aes-256-ctr" as crypto.CipherCCMTypes;
const privkey = process.env.ENCRYPTION_PRIVATE_KEY;
const Buffer = require("buffer").Buffer; // Node.js Buffer
// Your Buffer code here
const privateKey = Buffer.from(privkey as string, "base64");
export const decrypt = async (encrypted: string, index: number) => {
  // create buffer of length 16 with the index as the value
  const iv = Buffer.alloc(16);
  iv.writeUInt16BE(index, 0);
  console.log("privateKey", privateKey);
  const decipher = crypto.createDecipheriv(algorithm, privateKey as any, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const encrypt = async (text: string, index: number) => {
  // create buffer of length 16 with the index as the value
  const iv = Buffer.alloc(16);
  iv.writeUInt16BE(index, 0);
  const cipher = crypto.createCipheriv(algorithm, privateKey as any, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

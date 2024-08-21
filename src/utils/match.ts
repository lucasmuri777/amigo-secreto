import * as crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const key = crypto
  .createHash('sha512')
  .update(process.env.KEY_CRIPTO as string)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(process.env.IV_CRIPTO as string)
  .digest('hex')
  .substring(0, 16)

// Encrypt data
export const encryptMatch = (id: number ): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV)
  return Buffer.from(
    cipher.update(`${id}`, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export const decryptMatch = (encryptedData: string): number =>{
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, encryptionIV)
  let decrypted = (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ) // Decrypts data and converts to utf8

  return parseInt(decrypted);
}


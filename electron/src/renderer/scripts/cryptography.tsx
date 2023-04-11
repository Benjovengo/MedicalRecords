import { JSEncrypt } from "jsencrypt";

// Public and private keys
import { encryptionPublicKey, decryptionPrivateKey } from "../../../work/sensitive";

/**
 * Encrypt a message.
 * 
 * @param plainText the text to be encrypted
 * @returns the encrypted text
 */
export function encryptText (plainText: string) {
  var encrypt = new JSEncrypt();
  
  encrypt.setPublicKey(encryptionPublicKey);

  return encrypt.encrypt(plainText)
}


/**
 * Decrypts a message.
 * 
 * @param encryptedText the text to be decrypted
 * @returns the decrypted text
 */
export function decryptText (encryptedText: string) {
  var decrypt = new JSEncrypt();
  
  decrypt.setPrivateKey(decryptionPrivateKey);
  return decrypt.decrypt(encryptedText);
}

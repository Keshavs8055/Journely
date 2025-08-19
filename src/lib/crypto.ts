// This file should only be used in client components ('use client')
// as it relies on the Web Crypto API, which is browser-only.

async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, '0').slice(0, 32)); // Ensure key is 32 bytes for AES-256
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptContent(content: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encodedContent = new TextEncoder().encode(content);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedContent
  );

  const buffer = new Uint8Array(iv.length + encryptedContent.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encryptedContent), iv.length);

  // Return as Base64 string to safely store in Firestore
  return btoa(String.fromCharCode.apply(null, Array.from(buffer)));
}

export async function decryptContent(encryptedBase64: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const encryptedDataWithIv = new Uint8Array(
    atob(encryptedBase64).split('').map(char => char.charCodeAt(0))
  );

  const iv = encryptedDataWithIv.slice(0, 12);
  const encryptedContent = encryptedDataWithIv.slice(12);

  const decryptedContent = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedContent
  );

  return new TextDecoder().decode(decryptedContent);
}

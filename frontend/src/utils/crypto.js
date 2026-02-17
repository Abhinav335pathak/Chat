

export const encryptMessage = async (plainText, secretKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(secretKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plainText)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
};

const getKey = async (secretKey) => {
  if (!secretKey) return null;
  if (![16, 32].includes(secretKey.length)) return null;

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

export const decryptMessage = async (ciphertext, iv, secretKey) => {
  try {
    const key = await getKey(secretKey);
    if (!key) return "🔒 Encrypted message";

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)),
      },
      key,
      Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return "🔒 Encrypted message";
  }
};


export default { encryptMessage, decryptMessage };
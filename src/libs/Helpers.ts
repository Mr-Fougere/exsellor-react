export const changeFavicon = (iconUrl: string): void => {
  const link: HTMLLinkElement =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");
  link.rel = "icon";
  link.href = iconUrl;

  document.head.appendChild(link);
};

export const updateTabInformation = (title: string, iconUrl: string): void => {
  document.title = title;
  changeFavicon(iconUrl);
};

export function stringToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer;
}

export function arrayBufferToHex(buffer: any) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((byte) => {
    return byte.toString(16).padStart(2, "0");
  });
  return hexCodes.join("");
}

export async function hashData(data: string) {
  const dataArrayBuffer = stringToArrayBuffer(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataArrayBuffer);

  return arrayBufferToHex(hashBuffer);
}

export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const buffer = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return buffer.buffer;
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

export function ab2b64(buffer: ArrayBuffer): string {
  const binaryString = String.fromCharCode(...new Uint8Array(buffer));
  return window.btoa(binaryString);
}

export function b64toab(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function convertByteArrayToBase64(byteData: ArrayBuffer | Uint8Array | number[]): string {
  // Normaliza para Uint8Array
  let bytes: Uint8Array;
  
  if (byteData instanceof ArrayBuffer) {
    bytes = new Uint8Array(byteData);
  } else if (Array.isArray(byteData)) {
    bytes = new Uint8Array(byteData);
  } else {
    bytes = byteData;
  }

  // Converte para Base64
  let binary = '';
  bytes.forEach((byte) => binary += String.fromCharCode(byte));
  return window.btoa(binary);
}

export default convertByteArrayToBase64
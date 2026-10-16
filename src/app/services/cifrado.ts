// Cifra un texto con SHA-256 usando la Web Crypto API del navegador.
// Es un hash de un solo sentido: no se puede recuperar la contraseña original,
// que es justo lo que se quiere para que nunca aparezca en texto plano.
export async function sha256(texto: string): Promise<string> {
  const bytes = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

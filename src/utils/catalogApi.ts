/**
 * Mock helpers still used by pages that aren't connected to the backend yet.
 * The contact form uses sendContactMessage; the backend's POST /api/contact can replace it.
 */

export function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendContactMessage(): Promise<void> {
  await delay(900);
}

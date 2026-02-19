import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/lib/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Número oficial WhatsApp Lolla Toledo Mega Hair */
export const WHATSAPP_NUMBER = "5567992964308";
export const WHATSAPP_MSG = "Olá, Lolla! Vim pelo site oficial Lolla Toledo Mega Hair e gostaria de mais informações.";

/** Retorna o número de telefone formatado para exibição, ex: (67) 99264-4308 */
export function formatPhone(number: string): string {
  const ddd = number.slice(2, 4);
  const n = number.slice(4);
  if (n.length === 9) return `(${ddd}) ${n.slice(0, 5)}-${n.slice(5)}`;
  if (n.length === 8) return `(${ddd}) ${n.slice(0, 4)}-${n.slice(4)}`;
  return number;
}

/** Gera o link de redirecionamento para WhatsApp usando o número oficial. */
export function whatsappUrl(message?: string): string {
  const msg = message || WHATSAPP_MSG;
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;
}


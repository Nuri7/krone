import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export function formatPhoneDisplay(phone) {
  return phone.replace('+49 ', '0').replace(/\s/g, ' ');
}

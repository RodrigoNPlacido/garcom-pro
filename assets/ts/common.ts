// Imports
import { receiptSectionUpdater } from "./receipt.js"

// Const
const DICT: string = "0123456789abcdefghijklmnopqsrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Functions
export function getCookie(id: string | null = null) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [_, allValue] = cookie.split("=");
    const splitedValues = allValue.split("#");
    if (!splitedValues[splitedValues.length - 1]) {splitedValues.pop();}

    for (const value of splitedValues) {
      if (!id) {
        return splitedValues;
      }

      if (value.endsWith(id)) {
        return [value];
      }
    }
  }

  return null;
}

function addCookie() {}
function updateCookie() {}

export function deleteCookie() {
  document.cookie = "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  receiptSectionUpdater();
}

export function base62Encrypt(value: number, type: string | null = null) {
  let encryptValue = "";

  if (value === 0) {
    encryptValue = "0";
  } else {
    while (value !== 0) {
      encryptValue += DICT[value % 62];
      value = Math.floor(value / 62);
      }
  }

  const lengthMap: Record<string, number> = {
    "price": 4,
    "time": 5
  };
  const requiredLength = lengthMap[type ?? ''] || encryptValue.length;
  encryptValue = encryptValue.padEnd(requiredLength, "0");

  return encryptValue.split('').reverse().join('');
}

export function base62Decrypt(value: string) {
  let result = 0;
  const reversedValue = value.split('').reverse().join('');

  for (let index = 0; index < value.length; index++) {
    const indexChar = DICT.indexOf(reversedValue[index]) 
    if (indexChar == -1) {
      console.warn("erro");
      return;
    }
    result += indexChar * 62**index;
  }

  return result;
}
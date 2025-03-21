/* =====================
Imports
===================== */
import { receiptSectionUpdater, receiptElements, receiptVars } from "./receipt.js";
import { modalElements, modalVars } from "./modal.js";
/* =====================
Const
===================== */
/* =====================
Functions
===================== */
export function getCookie(id = null) {
    if (!document.cookie) {
        return null;
    }
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [_, allValue] = cookie.split("=");
        const splitedValues = allValue.split("#");
        if (!splitedValues[splitedValues.length - 1]) {
            splitedValues.pop();
        }
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
export function updateCookie(values, commissions, paymentMethods, time) {
    let dataCookie = getCookie();
    let cookie;
    if (dataCookie == null) {
        cookie = "";
    }
    else {
        cookie = dataCookie.join("#") + "#";
    }
    let rewriteCookie = "";
    for (let index = 0; index < values.length; index++) {
        const encodedValues = [
            base62Encrypt(Math.round(values[index]), "price"),
            base62Encrypt(commissions[index]),
            base62Encrypt(paymentMethods[index]),
        ].join('');
        rewriteCookie += encodedValues;
    }
    rewriteCookie += base62Encrypt(time, "time");
    const date = new Date();
    const expirationDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `data=${cookie + rewriteCookie + "#"}; expires=${expirationDate.toUTCString()}; path=/`;
}
export function deleteCookie() {
    document.cookie = "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    receiptSectionUpdater();
}
export function base62Encrypt(value, type = null) {
    const DICT = "0123456789abcdefghijklmnopqsrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let encryptValue = "";
    if (value === 0) {
        encryptValue = "0";
    }
    else {
        while (value !== 0) {
            encryptValue += DICT[value % 62];
            value = Math.floor(value / 62);
        }
    }
    const lengthMap = {
        "price": 4,
        "time": 5
    };
    const requiredLength = lengthMap[type !== null && type !== void 0 ? type : ''] || encryptValue.length;
    encryptValue = encryptValue.padEnd(requiredLength, "0");
    return encryptValue.split('').reverse().join('');
}
export function base62Decrypt(value) {
    const DICT = "0123456789abcdefghijklmnopqsrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = 0;
    const reversedValue = value.split('').reverse().join('');
    for (let index = 0; index < value.length; index++) {
        const indexChar = DICT.indexOf(reversedValue[index]);
        if (indexChar == -1) {
            console.warn("erro");
            return;
        }
        result += indexChar * Math.pow(62, index);
    }
    return result;
}
export function toggleViewPopup(section) {
    switch (section) {
        case receiptElements.receiptTaker:
            if (receiptVars.receiptTaker.show) {
                receiptElements.receiptTaker.style.marginLeft = "105vw";
                receiptVars.receiptTaker.show = false;
            }
            else {
                receiptElements.receiptTaker.style.marginLeft = "0vw";
                receiptVars.receiptTaker.show = true;
            }
            break;
        case modalElements.modal:
            if (modalVars.show) {
                modalElements.modal.classList.remove("d-flex");
                modalElements.modal.classList.add("d-none");
                modalVars.show = false;
            }
            else {
                modalElements.modal.classList.remove("d-none");
                modalElements.modal.classList.add("d-flex");
                modalVars.show = true;
            }
            break;
        case receiptElements.infoReceipt:
            if (receiptVars.infoReceipt.show) {
                receiptElements.infoReceipt.style.marginLeft = "105vw";
                receiptVars.infoReceipt.show = false;
            }
            else {
                receiptElements.infoReceipt.style.marginLeft = "0vw";
                receiptVars.infoReceipt.show = true;
            }
            break;
        default:
            console.warn("Erro");
            return;
    }
}

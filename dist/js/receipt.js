var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* =====================
Imports
===================== */
import { getCookie, base62Decrypt, deleteCookie, toggleViewPopup } from "./common.js";
import { modalElements, modalConfirm, modalSetting } from "./modal.js";
/* =====================
Const
===================== */
export const receiptElements = {
    addReceiptButton: document.querySelector("#add-receipt__button"),
    downloadReceiptButton: document.querySelector("#download-receipts__button"),
    deleteAllReceiptButton: document.querySelector("#delete-all-receipts__button"),
    receiptTaker: document.querySelector("#receipt-taker"),
    receiptTakerExitButton: document.querySelector("#receipt-taker--exit__button")
};
export const receiptVars = {
    receiptTaker: {
        show: false,
        value: 0,
        Comment: true,
        PaymentMethod: null
    }
};
/* =====================
Functions
===================== */
export function receiptSectionUpdater() { }
function addReceipt() {
    if (!receiptElements.receiptTaker) {
        console.warn("erro");
        return;
    }
    toggleViewPopup(receiptElements.receiptTaker);
}
function download() {
    const content = { "version": "1.1", "receipts": [] };
    const receipts = getCookie(null);
    if (!receipts) {
        console.warn("Erro");
        return;
    }
    for (const receipt of receipts) {
        const subcontent = { "values": [], "commission": [], "paymentMethod": [], "time": 0 };
        for (let index = 0; index < receipt.length - 5; index += 6) {
            const segment = receipt.slice(index, index + 6);
            const encryptedValue = segment.slice(0, 4);
            const encryptedCommission = segment.slice(4, 5);
            const encryptedPaymentMethod = segment.slice(5, 6);
            const value = base62Decrypt(encryptedValue);
            const commission = base62Decrypt(encryptedCommission);
            const paymentMethod = base62Decrypt(encryptedPaymentMethod);
            if (!value) {
                console.warn("erro");
                return;
            }
            if (!commission) {
                console.warn("erro");
                return;
            }
            if (!paymentMethod) {
                console.warn("erro");
                return;
            }
            subcontent.values.push(value);
            subcontent.commission.push(commission);
            subcontent.paymentMethod.push(paymentMethod);
        }
        const encryptedTime = receipt.slice(receipt.length - 5, receipt.length);
        const time = base62Decrypt(encryptedTime);
        if (!time) {
            console.warn("erro");
            return;
        }
        subcontent.time = time;
        content.receipts.push(subcontent);
    }
    const contentString = JSON.stringify(content, null, 2);
    const blob = new Blob([contentString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const time = Math.floor(new Date().getTime() / 1000) - 1704078000;
    const filename = formattedDate + "-" + time;
    link.href = url;
    link.download = `${filename}.gpro`;
    link.click();
    URL.revokeObjectURL(url);
}
function deleteAllReceipts() {
    return __awaiter(this, void 0, void 0, function* () {
        modalSetting("Deseja apagar tdas as comandas?");
        toggleViewPopup(modalElements.modal);
        const confirm = yield modalConfirm();
        toggleViewPopup(modalElements.modal);
        if (confirm) {
            deleteCookie();
        }
    });
}
// Receipt Taker
function selectionPaymentMethod() { }
function selectionCommission() { }
function keyPress() { }
function removeSubReceipt() { }
function addSubReceipt() { }
function submitReceipt() { }
/* =====================
Events
===================== */
function receiptEvents() {
    var _a;
    if (!receiptElements.addReceiptButton) {
        console.warn("erro");
        return;
    }
    receiptElements.addReceiptButton.addEventListener("click", addReceipt);
    if (!receiptElements.receiptTakerExitButton) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerExitButton.addEventListener("click", () => { toggleViewPopup(receiptElements.receiptTaker); });
    if (!receiptElements.downloadReceiptButton) {
        console.warn("erro");
        return;
    }
    receiptElements.downloadReceiptButton.addEventListener("click", download);
    if (!receiptElements.deleteAllReceiptButton) {
        console.warn("erro");
        return;
    }
    (_a = receiptElements.deleteAllReceiptButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", deleteAllReceipts);
}
/* =====================
Main
===================== */
receiptEvents();

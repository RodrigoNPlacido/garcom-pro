/* ===================== 
Imports 
===================== */
import { getCookie, base62Decrypt, deleteCookie, toggleViewPopup } from "./common.js"
import { modalElements, modalConfirm, modalSetting } from "./modal.js";

/* =====================
Type
===================== */
type Content = {
  version: string;
  receipts: Subcontent[];
}
type Subcontent = {
  values: number[];
  commission: number[];
  paymentMethod: number[];
  time: number;
};
type ReceiptVars = {
  receiptTaker: ReceiptTaker
}
type ReceiptTaker = {
  show: boolean,
  value: number,
  commission: boolean,
  paymentMethod: string | null
}


/* =====================
Const
===================== */
export const receiptElements = {
  addReceiptButton: document.querySelector<HTMLElement>("#add-receipt__button"),
  downloadReceiptButton: document.querySelector<HTMLElement>("#download-receipts__button"),
  deleteAllReceiptButton: document.querySelector<HTMLElement>("#delete-all-receipts__button"),
  receiptTaker: document.querySelector<HTMLElement>("#receipt-taker"),
  receiptTakerExitButton: document.querySelector<HTMLElement>("#receipt-taker--exit__button"),
  keyboardKey: document.querySelectorAll<HTMLElement>(".keyboard__key"),
  receiptTakerScreen: document.querySelector<HTMLElement>("#receipt-taker__screen")
}
export const receiptVars = {
  receiptTaker: {
    show: false,
    value: 0,
    Comment: true,
    PaymentMethod: null
  }
}


/* =====================
Functions
===================== */
export function receiptSectionUpdater() {}

function addReceipt() {
  if (!receiptElements.receiptTaker) {console.warn("erro"); return;}
  toggleViewPopup(receiptElements.receiptTaker);
}

function download() {
  const content: Content = {"version": "1.1", "receipts": []};
  const receipts = getCookie(null);

  if (!receipts) {console.warn("Erro"); return;}
  for (const receipt of receipts) {
    const subcontent: Subcontent = {"values": [], "commission": [], "paymentMethod": [], "time": 0};
    
    for (let index=0; index < receipt.length - 5; index+=6) {
      const segment = receipt.slice(index, index+6);
      const encryptedValue = segment.slice(0, 4);
      const encryptedCommission = segment.slice(4, 5);
      const encryptedPaymentMethod = segment.slice(5, 6);

      const value = base62Decrypt(encryptedValue);
      const commission = base62Decrypt(encryptedCommission);
      const paymentMethod = base62Decrypt(encryptedPaymentMethod);

      if (!value) {console.warn("erro"); return;}
      if (!commission) {console.warn("erro"); return;}
      if (!paymentMethod) {console.warn("erro"); return;}
      subcontent.values.push(value);
      subcontent.commission.push(commission);
      subcontent.paymentMethod.push(paymentMethod);
    }

    const encryptedTime = receipt.slice(receipt.length - 5, receipt.length);
    const time = base62Decrypt(encryptedTime);

    if (!time) {console.warn("erro"); return;}
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
  link.download = `${filename}.gpro`
  link.click();
  URL.revokeObjectURL(url);
}

async function deleteAllReceipts() {
  modalSetting("Deseja apagar tdas as comandas?");
  toggleViewPopup(modalElements.modal!);
  const confirm = await modalConfirm();
  toggleViewPopup(modalElements.modal!);
  
  if (confirm) {
    deleteCookie();
  }
}

// Receipt Taker
function selectionPaymentMethod() {}
function selectionCommission() {}

function screenReceiptTakerUpdater() {
  if (!receiptElements.receiptTakerScreen) {console.warn("erro"); return;}
  receiptElements.receiptTakerScreen.innerHTML = `$ ${String((receiptVars.receiptTaker.value / 100).toFixed(2))}`;
}

function keyPress(keyElement: Element) {
  const keyValue = keyElement.getAttribute("data-value");
  
  if (keyValue == "00") {
    receiptVars.receiptTaker.value *= 100;
  } else if (keyValue == "del") {
    receiptVars.receiptTaker.value = Math.floor(receiptVars.receiptTaker.value / 10)
  } else {
    const value = Number(keyValue);
    receiptVars.receiptTaker.value = receiptVars.receiptTaker.value * 10 + value;
  }

  screenReceiptTakerUpdater();
}

function removeSubReceipt() {}
function addSubReceipt() {}
function submitReceipt() {}


/* =====================
Events
===================== */
function receiptEvents() {
  if (!receiptElements.addReceiptButton) {console.warn("erro"); return;}
  receiptElements.addReceiptButton.addEventListener("click", addReceipt);
  if (!receiptElements.receiptTakerExitButton) {console.warn("erro"); return;}
  receiptElements.receiptTakerExitButton.addEventListener("click", () => {toggleViewPopup(receiptElements.receiptTaker!)})
  if (!receiptElements.downloadReceiptButton) {console.warn("erro"); return;}
  receiptElements.downloadReceiptButton!.addEventListener("click", download);
  if (!receiptElements.deleteAllReceiptButton) {console.warn("erro"); return;}
  receiptElements.deleteAllReceiptButton?.addEventListener("click", deleteAllReceipts);
  if (!receiptElements.keyboardKey) {console.warn("erro"); return;}
  receiptElements.keyboardKey.forEach((keyElement:HTMLElement) => {
    keyElement.addEventListener("click", () => {keyPress(keyElement)});
  });
}


/* =====================
Main
===================== */
receiptEvents();
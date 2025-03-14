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
import { getCookie, updateCookie, base62Decrypt, deleteCookie, toggleViewPopup } from "./common.js";
import { modalElements, modalConfirm, modalSetting } from "./modal.js";
/* =====================
Const
===================== */
export const receiptElements = {
    orderReceipts: document.querySelector(".order__receipts"),
    addReceiptButton: document.querySelector("#add-receipt__button"),
    downloadReceiptButton: document.querySelector("#download-receipts__button"),
    deleteAllReceiptButton: document.querySelector("#delete-all-receipts__button"),
    receiptTaker: document.querySelector("#receipt-taker"),
    receiptTakerExitButton: document.querySelector("#receipt-taker--exit__button"),
    keyboardKey: document.querySelectorAll(".keyboard__key"),
    receiptTakerScreen: document.querySelector("#receipt-taker__screen"),
    receiptTakerCommission: document.querySelector("#receipt-taker__commission"),
    receiptTakerPaymentMethodItems: document.querySelectorAll(".paymentMethod__item"),
    receiptTakerPaymentMethod: document.querySelector("#receipt-taker__paymentMethod"),
    receiptTakerAddButton: document.querySelector("#receipt-taker__add-button"),
    receiptTakerRemoveButton: document.querySelector("#receipt-taker__remove-button"),
    receiptTakerSubmitButton: document.querySelector("#receipt-taker__submit-button"),
    receiptTakerMethodPaymentSection: document.querySelector("#receipt-taker__payment-method--section")
};
export const receiptVars = {
    receiptTaker: {
        show: false,
        value: [0],
        commission: [true],
        paymentMethod: [null],
        size: 1
    }
};
/* =====================
Functions
===================== */
function orderReceiptEvent(element) {
    const id = element.id;
    const cookie = getCookie(id);
}
export function receiptSectionUpdater() {
    const cookie = getCookie();
    if (cookie == null) {
        // Você ainda não tem comandas...
        receiptElements.orderReceipts.innerHTML = "Sem Comandas Registradas. Clique em [+] e comece agora mesmo";
        return;
    }
    let html = "";
    for (let segment of cookie) {
        let totalValue = 0;
        for (let index = 0; index < segment.length - 5; index += 6) {
            const subsegment = segment.slice(index, index + 6);
            const encryptedValue = subsegment.slice(0, 4);
            const value = base62Decrypt(encryptedValue);
            if (!value) {
                console.warn("erro");
                return;
            }
            totalValue += value;
        }
        const encryptedTime = segment.slice(segment.length - 5, segment.length);
        const time = base62Decrypt(encryptedTime) + 1704078000;
        const dataTime = new Date(time * 1000);
        const week = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"][dataTime.getDay()];
        const day = dataTime.getDate();
        const month = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][dataTime.getMonth()];
        const year = dataTime.getFullYear();
        const hour = String(dataTime.getHours()).padStart(2, "0");
        ;
        const minute = String(dataTime.getMinutes()).padStart(2, "0");
        ;
        html = `<div class="col-auto col-md-6 col-lg-4 p-0 cursor-pointer"><div id="${encryptedTime}" class="order__receipt rounded py-2 px-2 m-1"><p class="fs-8 m-0">#${encryptedTime}</p><p class="fs-7 m-0 mb-2">${week}, ${day} ${month}, ${year} - ${hour}:${minute}</p><div class="d-flex justify-content-between"><p class="fs-6 m-0 fw-bold">Valor Total</p><p class="fs-6 m-0 fw-bold">${(totalValue / 100).toFixed(2)}</p></div></div></div>`
            + html;
    }
    receiptElements.orderReceipts.innerHTML = html;
    const elements = receiptElements.orderReceipts.querySelectorAll(".order__receipt");
    elements.forEach((element) => {
        element.removeEventListener("click", function () { orderReceiptEvent(element); });
        element.addEventListener("click", function () { orderReceiptEvent(element); });
    });
}
function addReceipt() {
    if (!receiptElements.receiptTaker) {
        console.warn("erro");
        return;
    }
    toggleViewPopup(receiptElements.receiptTaker);
}
function download() {
    return __awaiter(this, void 0, void 0, function* () {
        const content = { "version": "1.1", "receipts": [] };
        const receipts = getCookie(null);
        if (!receipts) {
            modalSetting("Não há comandas registradas.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
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
    });
}
function deleteAllReceipts() {
    return __awaiter(this, void 0, void 0, function* () {
        const receipts = getCookie(null);
        if (!receipts) {
            modalSetting("Não há comandas registradas.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
            return;
        }
        modalSetting("Deseja apagar todas as comandas?");
        toggleViewPopup(modalElements.modal);
        const confirm = yield modalConfirm();
        toggleViewPopup(modalElements.modal);
        if (confirm) {
            deleteCookie();
            receiptSectionUpdater();
        }
    });
}
// Receipt Taker
function clearReceiptTaker(ms) {
    setTimeout(() => {
        receiptVars.receiptTaker.commission = [true];
        receiptVars.receiptTaker.value = [0];
        receiptVars.receiptTaker.paymentMethod = [null];
        receiptVars.receiptTaker.size = 1;
        selectionPaymentMethod();
        if (!receiptElements.receiptTakerCommission) {
            console.warn("erro");
            return;
        }
        receiptElements.receiptTakerCommission.checked = false;
        screenReceiptTakerUpdater();
        if (!receiptElements.receiptTakerMethodPaymentSection) {
            console.warn("erro");
            return;
        }
        receiptElements.receiptTakerMethodPaymentSection.innerHTML = "";
    }, ms);
}
function selectionPaymentMethod(element = null) {
    let methodName;
    let methodSuperName;
    if (element == null) {
        methodSuperName = null;
        methodName = "null";
    }
    else {
        methodName = element.getAttribute("data-method");
        methodSuperName = methodName;
        if (!methodName) {
            console.warn("erro");
            return;
        }
    }
    if (!receiptElements.receiptTakerPaymentMethod) {
        console.warn("erro");
        return;
    }
    const methodPaymentStringify = {
        pix: `<i class="fa-brands fa-pix text-pix"></i> Pix`,
        money: `<i class="fa-solid fa-money-bill text-success"></i> Dinheiro`,
        debit: `<i class="fa-brands fa-cc-mastercard text-warning"></i> Débito`,
        credit: `<i class="fa-brands fa-cc-mastercard text-primary"></i> Crédito`,
        mumbuca: `<i class="fa-solid fa-credit-card text-danger"></i> Mumbuca`,
        voucher: `<i class="fa-solid fa-credit-card text-pink"></i> Voucher`,
        null: "Selecione a forma de pagamento"
    };
    const methodLabel = methodPaymentStringify.hasOwnProperty(methodName)
        ? methodPaymentStringify[methodName]
        : "";
    receiptElements.receiptTakerPaymentMethod.innerHTML = methodLabel;
    receiptVars.receiptTaker.paymentMethod[receiptVars.receiptTaker.size - 1] = methodSuperName;
}
function selectionCommission() {
    receiptVars.receiptTaker.commission[receiptVars.receiptTaker.size - 1] = !receiptElements.receiptTakerCommission.checked;
}
function screenReceiptTakerUpdater() {
    if (!receiptElements.receiptTakerScreen) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerScreen.innerHTML = `$ ${String((receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] / 100).toFixed(2))}`;
}
function keyPress(keyElement) {
    const keyValue = keyElement.getAttribute("data-value");
    if (keyValue == "00") {
        receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] *= 100;
    }
    else if (keyValue == "del") {
        receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] = Math.floor(receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] / 10);
    }
    else {
        const value = Number(keyValue);
        receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] = receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1] * 10 + value;
    }
    screenReceiptTakerUpdater();
}
function removeSubReceipt() {
    return __awaiter(this, void 0, void 0, function* () {
        if (receiptVars.receiptTaker.size == 1) {
            modalSetting("Você ainda não tem nenhuma subcomanda.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
            return;
        }
        receiptVars.receiptTaker.commission.splice(-2, 1);
        receiptVars.receiptTaker.paymentMethod.splice(-2, 1);
        receiptVars.receiptTaker.value.splice(-2, 1);
        receiptVars.receiptTaker.size -= 1;
        if (!receiptElements.receiptTakerMethodPaymentSection) {
            console.warn("erro");
            return;
        }
        const allElements = receiptElements.receiptTakerMethodPaymentSection.querySelectorAll("div");
        const lastElement = allElements[allElements.length - 1];
        receiptElements.receiptTakerMethodPaymentSection.removeChild(lastElement);
    });
}
function addSubReceipt() {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = receiptVars.receiptTaker.paymentMethod[receiptVars.receiptTaker.size - 1];
        const value = receiptVars.receiptTaker.value[receiptVars.receiptTaker.size - 1];
        if (!methodName) {
            modalSetting("Escolha o método de pagamento.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
            return;
        }
        else if (value === 0) {
            modalSetting("O valor 0,00 não é aceito.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
            return;
        }
        else if (value > 14000000) {
            modalSetting("O valor não é aceito.", "Fechar", "Ok");
            toggleViewPopup(modalElements.modal);
            yield modalConfirm();
            toggleViewPopup(modalElements.modal);
            return;
        }
        if (!receiptElements.receiptTakerMethodPaymentSection) {
            console.warn("erro");
            return;
        }
        const methodPaymentStringify = {
            pix: `fa-brands fa-pix text-pix`,
            money: `fa-solid fa-money-bill text-success`,
            debit: `fa-brands fa-cc-mastercard text-warning`,
            credit: `fa-brands fa-cc-mastercard text-primary`,
            mumbuca: `fa-solid fa-credit-card text-danger`,
            voucher: `fa-solid fa-credit-card text-pink`
        };
        const methodClass = methodPaymentStringify.hasOwnProperty(methodName)
            ? methodPaymentStringify[methodName]
            : "";
        const element = document.createElement("div");
        element.classList.add("payment-types__item");
        element.classList.add("rounded");
        element.classList.add("text-center");
        element.classList.add("m-1");
        element.innerHTML = `<p class="fs-6 fw-bold m-0"><i class="${methodClass}"></i> ${(value / 100).toFixed(2)}</p>`;
        receiptElements.receiptTakerMethodPaymentSection.appendChild(element);
        receiptVars.receiptTaker.commission.push(true);
        receiptVars.receiptTaker.value.push(0);
        receiptVars.receiptTaker.paymentMethod.push(null);
        receiptVars.receiptTaker.size += 1;
        selectionPaymentMethod();
        if (!receiptElements.receiptTakerCommission) {
            console.warn("erro");
            return;
        }
        receiptElements.receiptTakerCommission.checked = false;
        screenReceiptTakerUpdater();
    });
}
function submitReceipt() {
    return __awaiter(this, void 0, void 0, function* () {
        const size = receiptVars.receiptTaker.size;
        const lastMethodName = receiptVars.receiptTaker.paymentMethod[size - 1];
        const lastValue = receiptVars.receiptTaker.value[size - 1];
        if ((!lastMethodName || lastValue == 0 || lastValue > 14000000) && !(!lastMethodName && lastValue == 0 && size > 1)) {
            if (!lastMethodName) {
                modalSetting("Escolha o método de pagamento.", "Fechar", "Ok");
                toggleViewPopup(modalElements.modal);
                yield modalConfirm();
                toggleViewPopup(modalElements.modal);
            }
            else if (lastValue == 0) {
                modalSetting("O valor 0,00 não é aceito.", "Fechar", "Ok");
                toggleViewPopup(modalElements.modal);
                yield modalConfirm();
                toggleViewPopup(modalElements.modal);
            }
            else if (lastValue > 14000000) {
                modalSetting("O valor não é aceito.", "Fechar", "Ok");
                toggleViewPopup(modalElements.modal);
                yield modalConfirm();
                toggleViewPopup(modalElements.modal);
            }
            return;
        }
        if (!lastMethodName && lastValue == 0) {
            receiptVars.receiptTaker.value.pop();
            receiptVars.receiptTaker.commission.pop();
            receiptVars.receiptTaker.paymentMethod.pop();
            receiptVars.receiptTaker.size -= 1;
        }
        const namePaymentMethodToNumber = {
            "pix": 0,
            "money": 1,
            "debit": 2,
            "credit": 3,
            "mumbuca": 4,
            "voucher": 5
        };
        const values = receiptVars.receiptTaker.value;
        const commissions = receiptVars.receiptTaker.commission;
        const commissionsNumber = commissions.map(b => (b ? 10 : 0));
        const paymentMethods = receiptVars.receiptTaker.paymentMethod;
        const paymentMethodsFiltered = paymentMethods.filter((method) => method !== null);
        const paymentMethodsNumber = paymentMethodsFiltered.map(method => namePaymentMethodToNumber[method]);
        const date = new Date();
        const timeInSeconds = Math.floor(date.getTime() / 1000) - 1704078000; // Unix Time  -  2024/1/1 
        updateCookie(values, commissionsNumber, paymentMethodsNumber, timeInSeconds);
        receiptSectionUpdater();
        toggleViewPopup(receiptElements.receiptTaker);
        clearReceiptTaker(450);
    });
}
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
    receiptElements.receiptTakerExitButton.addEventListener("click", () => { toggleViewPopup(receiptElements.receiptTaker); clearReceiptTaker(450); });
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
    if (!receiptElements.keyboardKey) {
        console.warn("erro");
        return;
    }
    receiptElements.keyboardKey.forEach((keyElement) => {
        keyElement.addEventListener("click", () => { keyPress(keyElement); });
    });
    if (!receiptElements.receiptTakerCommission) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerCommission.addEventListener("change", selectionCommission);
    if (!receiptElements.receiptTakerPaymentMethod) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerPaymentMethodItems.forEach((paymentMethodItem) => {
        paymentMethodItem.addEventListener("click", () => { selectionPaymentMethod(paymentMethodItem); });
    });
    if (!receiptElements.receiptTakerAddButton) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerAddButton.addEventListener("click", addSubReceipt);
    if (!receiptElements.receiptTakerRemoveButton) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerRemoveButton.addEventListener("click", removeSubReceipt);
    if (!receiptElements.receiptTakerSubmitButton) {
        console.warn("erro");
        return;
    }
    receiptElements.receiptTakerSubmitButton.addEventListener("click", submitReceipt);
}
/* =====================
Main
===================== */
receiptSectionUpdater();
receiptEvents();

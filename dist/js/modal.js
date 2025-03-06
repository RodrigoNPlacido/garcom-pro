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
Const
===================== */
export const modalElements = {
    modal: document.querySelector(".my-modal"),
    content: document.querySelector(".my-modal__content"),
    declineButton: document.querySelector(".my-modal__button-decline"),
    confirmButton: document.querySelector(".my-modal__button-confirm")
};
export const modalVars = {
    show: false
};
/* =====================
Functions
===================== */
export function modalSetting(textModal = "Tem certeza que deseja fazer isso?", declineButton = "Recusar", confirmButton = "Confirmar") {
    modalElements.content.innerHTML = textModal;
    modalElements.declineButton.innerHTML = declineButton;
    modalElements.confirmButton.innerHTML = confirmButton;
}
export function modalConfirm() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            modalElements.modal.onclick = () => {
                resolve(false);
            };
            modalElements.declineButton.onclick = () => {
                resolve(false);
            };
            modalElements.confirmButton.onclick = () => {
                resolve(true);
            };
        });
    });
}

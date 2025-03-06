/* =====================
Const
===================== */
export const modalElements = {
  modal: document.querySelector<HTMLElement>(".my-modal"),
  content: document.querySelector<HTMLElement>(".my-modal__content"),
  declineButton: document.querySelector<HTMLElement>(".my-modal__button-decline"),
  confirmButton: document.querySelector<HTMLElement>(".my-modal__button-confirm")
};

export const modalVars = {
  show: false
}


/* =====================
Functions
===================== */
export function modalSetting(textModal:string = "Tem certeza que deseja fazer isso?", declineButton:string = "Recusar", confirmButton:string = "Confirmar") {
  modalElements.content!.innerHTML = textModal;
  modalElements.declineButton!.innerHTML = declineButton;
  modalElements.confirmButton!.innerHTML = confirmButton;
}

export async function modalConfirm() {
  return new Promise((resolve) => {
    modalElements.modal!.onclick = () => {
      resolve(false);
    };

    modalElements.declineButton!.onclick = () => {
      resolve(false);
    };

    modalElements.confirmButton!.onclick = () => {
      resolve(true);
    };
  });
}
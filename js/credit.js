document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".credit-item");
    const modals = document.querySelectorAll(".credit-modal");

    let activeModal = null;
    let previousFocus = null;
    let previousOverflow = "";

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(
                button.dataset.credit
            );

            if (!modal) return;

            previousFocus = document.activeElement;
            previousOverflow = document.body.style.overflow;

            modal.hidden = false;
            activeModal = modal;
            document.body.style.overflow = "hidden";

            modal.querySelector(".credit-close")?.focus();
        });
    });

    function closeModal() {
        if (!activeModal) return;

        activeModal.hidden = true;
        activeModal = null;
        document.body.style.overflow = previousOverflow;
        previousFocus?.focus();
    }

    modals.forEach(modal => {
        modal.querySelector(".credit-close")
            ?.addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal();
        });
    });

    document.addEventListener("keydown", event => {
        if (!activeModal) return;

        if (event.key === "Escape") {
            closeModal();
            return;
        }

        if (event.key === "Tab") {
            const focusable = [
                ...activeModal.querySelectorAll(
                    'button, a[href], input, select, textarea'
                )
            ].filter(el => !el.disabled);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey &&
                document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});
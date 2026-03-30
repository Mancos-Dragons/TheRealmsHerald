export const ModalService = {
    _createModalHTML() {
        if (document.getElementById('custom-modal-layer')) return;

        const modalHTML = `
            <div id="custom-modal-layer" class="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center hidden backdrop-blur-sm transition-opacity opacity-0">
                <div class="custom-modal-content bg-[#161616] border border-amber-900/50 rounded shadow-2xl shadow-black/50 p-6 w-full max-w-sm transform scale-95 transition-transform flex flex-col gap-4">
                    <h3 id="custom-modal-title" class="text-amber-500 font-serif font-bold text-xl mb-2"></h3>
                    <p id="custom-modal-msg" class="text-gray-300 mb-4"></p>
                    <div class="flex justify-end gap-3 mt-2">
                        <button id="custom-modal-btn-cancel" class="hidden px-4 py-2 rounded bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">Cancelar</button>
                        <button id="custom-modal-btn-ok" class="px-4 py-2 rounded bg-amber-700 text-white hover:bg-amber-600 transition font-bold shadow">Aceptar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    _showModal(title, msg, type = 'alert') {
        return new Promise((resolve) => {
            this._createModalHTML();

            const layer = document.getElementById('custom-modal-layer');
            const content = layer.querySelector('.custom-modal-content');
            const titleEl = document.getElementById('custom-modal-title');
            const msgEl = document.getElementById('custom-modal-msg');
            const btnOk = document.getElementById('custom-modal-btn-ok');
            const btnCancel = document.getElementById('custom-modal-btn-cancel');

            titleEl.textContent = title;
            msgEl.textContent = msg;

            if (type === 'confirm') {
                btnCancel.classList.remove('hidden');
            } else {
                btnCancel.classList.add('hidden');
            }

            // Animar entrada
            layer.classList.remove('hidden');
            // Timeout para permitir el renderizado antes de aplicar la opacidad
            setTimeout(() => {
                layer.classList.remove('opacity-0');
                content.classList.remove('scale-95');
            }, 10);

            const closeModal = (result) => {
                layer.classList.add('opacity-0');
                content.classList.add('scale-95');
                setTimeout(() => {
                    layer.classList.add('hidden');
                    // Limpiar eventos para evitar memory leaks
                    btnOk.onclick = null;
                    btnCancel.onclick = null;
                    resolve(result);
                }, 200); // Mismo tiempo que la transición de Tailwind
            };

            btnOk.onclick = () => closeModal(true);
            btnCancel.onclick = () => closeModal(false);
        });
    },

    alert(title, msg) {
        // Soporte para firmas antiguas (msg) o nuevas (title, msg)
        if (!msg) {
            msg = title;
            title = 'Aviso';
        }
        return this._showModal(title, msg, 'alert');
    },

    confirm(title, msg) {
        if (!msg) {
            msg = title;
            title = 'Confirmación';
        }
        return this._showModal(title, msg, 'confirm');
    }
};
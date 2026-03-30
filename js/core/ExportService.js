/**
 * @file ExportService.js
 * @description Servicio centralizado para generación de PDF e imágenes.
 */

export const ExportService = {
    /**
     * Exporta un elemento DOM a PDF procesando página por página como imágenes.
     * Usa la estrategia de captura de Canvas individual para máxima fidelidad.
     * @param {string} elementId - ID del contenedor padre.
     * @param {string} filename - Nombre del archivo.
     * @param {object} callbacks - { onBefore: fn, onAfter: fn }
     */
    async exportToPDF(elementId, filename, callbacks = {}) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const originalScroll = window.scrollY;

        // 1. Ejecutar limpieza previa (Controller)
        if (callbacks.onBefore) callbacks.onBefore(container);

        try {
            // Verificar disponibilidad de librerías
            const { jsPDF } = window.jspdf;
            if (!jsPDF || !window.html2canvas) {
                throw new Error("Librerías de PDF no cargadas (jspdf/html2canvas).");
            }

            const pages = container.querySelectorAll('.paper-page');
            if (pages.length === 0) throw new Error("No hay páginas para exportar.");

            // Crear documento PDF (A4 Vertical: 210mm x 297mm)
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = 210;
            const pdfHeight = 297;

            // Procesar cada página individualmente
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                
                // Forzar scroll al inicio
                window.scrollTo(0, 0);

                // Obtener dimensiones reales del elemento para el canvas
                const rect = page.getBoundingClientRect();
                
                // Configuración agresiva para fidelidad visual
                const canvas = await window.html2canvas(page, {
                    scale: 2, // Calidad Retina (x2)
                    useCORS: true, // Intentar cargar imágenes externas
                    logging: false,
                    allowTaint: true, // Permitir imágenes sin CORS (necesario para texturas externas)
                    backgroundColor: '#ffffff', // Fondo blanco de seguridad
                    width: rect.width,
                    height: rect.height,
                    // Forzamos el ancho de ventana para que CSS Grid no cambie de layout
                    windowWidth: 1400, 
                    x: 0,
                    y: 0,
                    // Función para limpiar el clon antes de renderizar
                    onclone: (clonedDoc) => {
                        const clonedPage = clonedDoc.querySelector(`.paper-page[data-page="${page.dataset.page}"]`);
                        if (clonedPage) {
                            clonedPage.style.margin = '0';
                            clonedPage.style.boxShadow = 'none';
                            clonedPage.style.transform = 'none'; // Quitar cualquier zoom residual
                        }
                    }
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPG alta calidad

                // Si no es la primera página, añadir nueva hoja al PDF
                if (i > 0) pdf.addPage();

                // Añadir la imagen ajustada exactamente al tamaño A4
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
            pdf.save(finalName);

        } catch (error) {
            console.error("Error PDF:", error);
            // Mensaje específico para errores de seguridad
            if (error.message && (error.message.includes("CORS") || error.message.includes("taint") || error.message.includes("SecurityError"))) {
                alert("⚠️ Error de Seguridad de Imágenes (CORS)\n\nEl navegador bloqueó la exportación porque algunas imágenes (texturas o fotos) vienen de servidores externos sin permiso.\n\nSOLUCIÓN: Descarga las imágenes a tu PC y úsalas con el botón 'Subir Imagen' del editor.");
            } else {
                alert("Error al generar PDF: " + error.message);
            }
        } finally {
            // 4. Restaurar vista
            if (callbacks.onAfter) callbacks.onAfter(container);
            window.scrollTo(0, originalScroll);
        }
    }
};
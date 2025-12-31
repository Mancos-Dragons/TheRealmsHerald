import { LanguageService } from '../../core/LanguageService.js';

export default class NewspaperView {
    constructor(container) {
        this.container = container;
    }

    renderWorkspace(config) {
        const t = (key) => LanguageService.get(key);
        const inputClass = "w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded focus:border-amber-500 outline-none font-sans text-sm";
        const labelClass = "block text-xs text-amber-500 font-bold uppercase tracking-wider mb-1";
        const btnClass = "p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white transition flex flex-col items-center gap-1 text-[10px]";

        this.container.innerHTML = `
            <div class="flex w-full h-full bg-[#0d0d0d] overflow-hidden fade-in font-sans">
                
                <aside class="w-96 bg-[#111] border-r border-[#222] flex flex-col z-20 shadow-2xl shrink-0">
                    <div class="p-4 border-b border-[#222] bg-[#161616] flex justify-between items-center">
                        <div>
                            <h2 class="text-amber-600 font-bold medieval-font text-2xl truncate w-64" title="${config.name}">
                                ${config.name}
                            </h2>
                            <p class="text-xs text-gray-500 uppercase tracking-widest" data-i18n="news.editor.title">${t('news.editor.title')}</p>
                        </div>
                        <button id="btn-config-toggle" class="text-gray-400 hover:text-white p-2 rounded hover:bg-[#222]">
                            <i class="ph ph-gear text-xl"></i>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
                        <form id="editor-form" class="space-y-4">
                            <input type="hidden" id="edit-id">
                            
                            <div>
                                <label class="${labelClass}" data-i18n="news.type">${t('news.type')}</label>
                                <div class="flex bg-[#1c1c1c] rounded p-1 border border-gray-700">
                                    <button type="button" class="flex-1 py-1 text-xs rounded bg-amber-700 text-white font-bold transition" id="type-news" data-i18n="news.type.news">${t('news.type.news')}</button>
                                    <button type="button" class="flex-1 py-1 text-xs rounded text-gray-400 hover:text-white transition" id="type-ad" data-i18n="news.type.ad">${t('news.type.ad')}</button>
                                </div>
                                <input type="hidden" id="inp-type" value="news">
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="news.headline">${t('news.headline')}</label>
                                <input type="text" id="inp-title" class="${inputClass} font-bold" placeholder="${t('news.headline.placeholder')}" required>
                            </div>

                            <div id="opts-news" class="space-y-4">
                                <div>
                                    <label class="${labelClass}" data-i18n="news.size">${t('news.size')}</label>
                                    <select id="inp-size" class="${inputClass} cursor-pointer">
                                        <option value="span-12" data-i18n="news.size.cover">${t('news.size.cover')}</option>
                                        <option value="span-8" data-i18n="news.size.feat">${t('news.size.feat')}</option>
                                        <option value="span-6" selected data-i18n="news.size.std">${t('news.size.std')}</option>
                                        <option value="span-4" data-i18n="news.size.col">${t('news.size.col')}</option>
                                        <option value="span-3" data-i18n="news.size.brief">${t('news.size.brief')}</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div id="opts-ad" class="hidden space-y-4">
                                <div>
                                    <label class="${labelClass}" data-i18n="news.ad.format">${t('news.ad.format')}</label>
                                    <select id="inp-ad-type" class="${inputClass} cursor-pointer">
                                        <option value="span-3" data-i18n="news.ad.box.s">${t('news.ad.box.s')}</option>
                                        <option value="span-4" data-i18n="news.ad.box.m">${t('news.ad.box.m')}</option>
                                        <option value="span-6" data-i18n="news.ad.box.l">${t('news.ad.box.l')}</option>
                                        <option value="banner" data-i18n="news.ad.banner">${t('news.ad.banner')}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="${labelClass}" data-i18n="news.page">${t('news.page')}</label>
                                    <select id="inp-page" class="${inputClass} cursor-pointer"></select>
                                </div>
                                <div>
                                    <label class="${labelClass}" data-i18n="news.image">${t('news.image')}</label>
                                    <input type="text" id="inp-img" class="${inputClass}" placeholder="https://...">
                                </div>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="news.body">${t('news.body')}</label>
                                <textarea id="inp-body" rows="8" class="${inputClass} leading-relaxed" placeholder="${t('news.body.placeholder')}"></textarea>
                            </div>

                            <div class="flex gap-2 pt-2">
                                <button type="submit" id="btn-submit" class="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded font-bold uppercase tracking-wide transition shadow-lg" data-i18n="news.btn.add">${t('news.btn.add')}</button>
                                <button type="button" id="btn-cancel" class="hidden px-4 border border-red-900/50 text-red-400 bg-red-900/10 hover:bg-red-900/30 rounded transition"><i class="ph ph-x"></i></button>
                            </div>
                        </form>
                    </div>

                    <div class="p-2 border-t border-[#222] bg-[#161616] grid grid-cols-4 gap-1">
                         <button id="btn-new" class="${btnClass}">
                            <i class="ph ph-file-plus text-lg"></i> <span data-i18n="news.btn.new">${t('news.btn.new')}</span>
                         </button>
                         <button id="btn-import" class="${btnClass}">
                            <i class="ph ph-upload-simple text-lg"></i> <span data-i18n="news.btn.load">${t('news.btn.load')}</span>
                         </button>
                         <button id="btn-save-json" class="${btnClass}">
                            <i class="ph ph-floppy-disk text-lg"></i> <span data-i18n="news.btn.save">${t('news.btn.save')}</span>
                         </button>
                         <button id="btn-export-pdf" class="${btnClass} text-amber-500 hover:text-amber-400">
                            <i class="ph ph-file-pdf text-lg"></i> <span data-i18n="news.btn.pdf">${t('news.btn.pdf')}</span>
                         </button>
                    </div>
                    <input type="file" id="file-import" class="hidden" accept=".json">
                </aside>

                <main class="flex-1 bg-[#18181b] overflow-hidden relative flex flex-col">
                    <div class="h-12 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
                        <div class="text-gray-500 text-xs uppercase tracking-widest font-mono">Workspace</div>
                        <div class="flex items-center gap-2 bg-[#111] rounded p-1 border border-[#333]">
                            <button id="zoom-out" class="p-1 text-gray-400 hover:text-white rounded"><i class="ph ph-minus"></i></button>
                            <span class="text-xs text-gray-300 w-12 text-center font-mono" id="zoom-display">90%</span>
                            <button id="zoom-in" class="p-1 text-gray-400 hover:text-white rounded"><i class="ph ph-plus"></i></button>
                        </div>
                    </div>
                    <div class="flex-1 overflow-auto flex justify-center p-10 bg-[url('assets/img/dark-wood.png')] bg-repeat" id="preview-scroll-area">
                        <div id="paper-capture" class="transition-transform duration-200 ease-out origin-top shadow-2xl"></div>
                    </div>
                </main>
            </div>
            
            <div id="config-modal-layer" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center fade-in">
                <div class="bg-[#111] border border-gray-700 w-96 rounded-lg overflow-hidden shadow-2xl">
                    <div class="bg-[#1a1a1a] p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 class="text-amber-500 font-bold medieval-font" data-i18n="news.settings.title">${t('news.settings.title')}</h3>
                        <button id="btn-close-modal" class="text-gray-400 hover:text-white"><i class="ph ph-x"></i></button>
                    </div>
                    <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div class="space-y-3 pb-4 border-b border-gray-800">
                            <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.identity">${t('conf.identity')}</h4>
                            <div><label class="${labelClass}" data-i18n="conf.name">${t('conf.name')}</label><input type="text" id="modal-name" class="${inputClass}" value="${config.name}"></div>
                            <div><label class="${labelClass}" data-i18n="conf.sub">${t('conf.sub')}</label><input type="text" id="modal-subtitle" class="${inputClass}" value="${config.subtitle}"></div>
                            <div class="grid grid-cols-2 gap-3">
                                <div><label class="${labelClass}" data-i18n="conf.price">${t('conf.price')}</label><input type="text" id="modal-price" class="${inputClass}" value="${config.price}"></div>
                            </div>
                        </div>
                        <div class="space-y-3 pb-4 border-b border-gray-800">
                            <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.aesthetics">${t('conf.aesthetics')}</h4>
                            <div>
                                <label class="${labelClass}" data-i18n="conf.paper">${t('conf.paper')}</label>
                                <select id="modal-texture" class="${inputClass}">
                                    <option value="texture-clean">Pergamino Real</option>
                                    <option value="texture-gritty">Panfleto Sucio</option>
                                    <option value="texture-magic">Hoja Arcana</option>
                                </select>
                            </div>
                            <div>
                                <label class="${labelClass}" data-i18n="conf.font">${t('conf.font')}</label>
                                <select id="modal-font" class="${inputClass}">
                                    <option value="font-royal">Corte Real</option>
                                    <option value="font-common">Imprenta Común</option>
                                    <option value="font-arcane">Grimorio</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.chrono">${t('conf.chrono')}</h4>
                            <div><label class="${labelClass}" data-i18n="conf.date.base">${t('conf.date.base')}</label><input type="date" id="modal-base-date" class="${inputClass}" value="${config.baseDate}"></div>
                            <div><label class="${labelClass}" data-i18n="conf.date.curr">${t('conf.date.curr')}</label><input type="date" id="modal-current-date" class="${inputClass}" value="${config.currentDate}"></div>
                            <div class="grid grid-cols-2 gap-3">
                                <div><label class="${labelClass}" data-i18n="conf.freq">${t('conf.freq')}</label><input type="number" id="modal-freq" class="${inputClass}" value="${config.frequency}"></div>
                                <div><label class="${labelClass}" data-i18n="conf.manual">${t('conf.manual')}</label><input type="number" id="modal-manual" class="${inputClass}" value="${config.manualEdition}" placeholder="0 = Auto"></div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-800 flex justify-end">
                        <button id="btn-save-config" class="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded font-bold transition" data-i18n="btn.save">${t('btn.save')}</button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupTypeToggle();
        
        document.getElementById('modal-texture').value = config.texture || 'texture-clean';
        document.getElementById('modal-font').value = config.fontTheme || 'font-royal';
    }

    setupTypeToggle() {
        const typeNewsBtn = document.getElementById('type-news');
        const typeAdBtn = document.getElementById('type-ad');
        const optsNews = document.getElementById('opts-news');
        const optsAd = document.getElementById('opts-ad');

        const setNews = () => {
            document.getElementById('inp-type').value = 'news';
            typeNewsBtn.classList.add('bg-amber-700','text-white'); typeNewsBtn.classList.remove('text-gray-400');
            typeAdBtn.classList.remove('bg-amber-700','text-white'); typeAdBtn.classList.add('text-gray-400');
            optsNews.classList.remove('hidden'); optsAd.classList.add('hidden');
        };
        const setAd = () => {
            document.getElementById('inp-type').value = 'ad';
            typeAdBtn.classList.add('bg-amber-700','text-white'); typeAdBtn.classList.remove('text-gray-400');
            typeNewsBtn.classList.remove('bg-amber-700','text-white'); typeNewsBtn.classList.add('text-gray-400');
            optsNews.classList.add('hidden'); optsAd.classList.remove('hidden');
        };

        typeNewsBtn.onclick = setNews;
        typeAdBtn.onclick = setAd;
    }

    renderPages(itemsByPage, config, maxPages, editionNumber) {
        const container = document.getElementById('paper-capture');
        if (!container) return;
        container.innerHTML = '';

        const textureClass = config.texture || 'texture-clean';
        const fontClass = config.fontTheme || 'font-royal';

        for (let i = 1; i <= maxPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = `paper-page ${textureClass} ${fontClass}`;
            pageDiv.dataset.page = i;

            if (i === 1) {
                const header = document.createElement('header');
                const dateObj = new Date(config.currentDate);
                const dateStr = dateObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                
                header.innerHTML = `
                    <div class="newspaper-header">
                        <h1 class="newspaper-name">${config.name}</h1>
                        <div class="newspaper-meta">
                            <span>${config.price}</span>
                            <span>Ed. ${editionNumber}</span>
                            <span>${dateStr}</span>
                        </div>
                    </div>`;
                pageDiv.appendChild(header);
            } else {
                const miniHeader = document.createElement('div');
                miniHeader.className = 'newspaper-meta mb-4 opacity-70';
                miniHeader.innerHTML = `<span>Pág ${i}</span><span>Ed. ${editionNumber}</span>`;
                pageDiv.appendChild(miniHeader);
            }

            const colsContainer = document.createElement('div');
            colsContainer.className = 'columns-container'; 
            colsContainer.id = `page-${i}-cols`;

            const items = itemsByPage[i] || [];
            let hasBanner = false;

            items.forEach(item => {
                if (item.type === 'ad' && item.size === 'banner') {
                    hasBanner = true;
                    pageDiv.appendChild(this.createBannerElement(item));
                } else {
                    const el = this.createItemElement(item);
                    colsContainer.appendChild(el);
                }
            });

            if (hasBanner) pageDiv.classList.add('has-banner');
            pageDiv.appendChild(colsContainer);
            container.appendChild(pageDiv);
        }
    }

    createItemElement(item) {
        const gridClass = item.size || 'span-6'; 

        if (item.type === 'ad') {
            const el = document.createElement('div');
            el.className = `ad-box ${gridClass}`; 
            el.draggable = true;
            el.dataset.id = item.id;
            el.innerHTML = `
                <h4>${item.title}</h4>
                ${item.image ? `<img src="${item.image}" class="news-img">` : ''}
                <p>${item.body}</p>
            `;
            return el;
        } else {
            const el = document.createElement('article');
            el.className = `news-item ${gridClass}`; 
            el.draggable = true;
            el.dataset.id = item.id;

            let formattedBody = item.body.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            let html = '';
            if (item.title) html += `<h3 class="headline">${item.title}</h3>`;
            if (item.image) html += `<img src="${item.image}" class="news-img" onerror="this.style.display='none'">`;
            html += `<div class="news-body">${formattedBody}</div>`;

            el.innerHTML = html;
            return el;
        }
    }

    createBannerElement(item) {
        const el = document.createElement('div');
        el.className = 'ad-banner-container';
        el.draggable = true;
        el.dataset.id = item.id;
        el.innerHTML = `
            <div class="ad-banner-content">
                <h3>${item.title}</h3>
                <span>${item.body}</span>
            </div>
        `;
        return el;
    }

    markOverflowItems(pageId, itemsOutOfBounds) {
        const page = document.querySelector(`.paper-page[data-page="${pageId}"]`);
        if(!page) return;
        itemsOutOfBounds.forEach(itemId => {
            const el = page.querySelector(`[data-id="${itemId}"]`);
            if(el) {
                el.classList.add('error-overflow');
                el.title = "¡Espacio insuficiente!";
            }
        });
    }

    updatePageSelect(maxPages, selectedPage) {
        const select = document.getElementById('inp-page');
        if (!select) return;
        select.innerHTML = '';
        for (let i = 1; i <= maxPages; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.text = `Página ${i}`;
            if (i == selectedPage) opt.selected = true;
            select.appendChild(opt);
        }
    }

    toggleConfigModal(show) {
        const modal = document.getElementById('config-modal-layer');
        if (show) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
    }

    setZoom(level) {
        const paper = document.getElementById('paper-capture');
        const display = document.getElementById('zoom-display');
        if (paper) paper.style.transform = `scale(${level})`;
        if (display) display.innerText = `${Math.round(level * 100)}%`;
    }

    fillForm(item, page) {
        document.getElementById('edit-id').value = item.id;
        document.getElementById('inp-title').value = item.title;
        document.getElementById('inp-body').value = item.body;
        document.getElementById('inp-img').value = item.image || '';
        document.getElementById('inp-page').value = page;
        
        const type = item.type || 'news';
        document.getElementById('inp-type').value = type;
        
        if(type === 'ad') document.getElementById('type-ad').click();
        else document.getElementById('type-news').click();

        if (type === 'news') {
            document.getElementById('inp-size').value = item.size || 'span-6';
        } else {
            document.getElementById('inp-ad-type').value = item.size || 'span-4';
        }

        const btn = document.getElementById('btn-submit');
        btn.innerText = LanguageService.get('news.btn.save_edit'); 
        btn.classList.replace('bg-amber-700', 'bg-blue-700');
        document.getElementById('btn-cancel').classList.remove('hidden');
    }

    resetForm() {
        document.getElementById('editor-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('type-news').click();
        const btn = document.getElementById('btn-submit');
        btn.innerText = LanguageService.get('news.btn.add');
        btn.classList.replace('bg-blue-700', 'bg-amber-700');
        document.getElementById('btn-cancel').classList.add('hidden');
    }
}
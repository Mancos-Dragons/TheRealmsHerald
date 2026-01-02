import { LanguageService } from '../../core/LanguageService.js';

export default class NewspaperView {
    constructor(container) {
        this.container = container;
    }

    renderWorkspace(config) {
        const t = (key) => LanguageService.get(key);
        const baseInputClass = "w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 focus:border-amber-500 outline-none font-sans text-sm";
        const inputClass = `${baseInputClass} rounded`; 
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
                                    <button type="button" class="flex-1 py-1 text-xs rounded text-gray-400 hover:text-white transition" id="type-special">★ ${t('news.type.special').substring(0,8)}</button>
                                </div>
                                <input type="hidden" id="inp-type" value="news">
                            </div>

                            <div>
                                <label class="${labelClass}" id="lbl-title" data-i18n="news.headline">${t('news.headline')}</label>
                                <input type="text" id="inp-title" class="${inputClass}" placeholder="${t('news.headline.placeholder')}" required>
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

                            <div id="opts-special" class="hidden space-y-4 bg-[#2a1a1a] p-3 rounded border border-amber-900/30">
                                <p class="text-[10px] text-amber-500 mb-2 italic">⚠️ Ocupará toda la Pág. 1.</p>
                                <div>
                                    <label class="${labelClass}" data-i18n="news.special.format">${t('news.special.format')}</label>
                                    <select id="inp-special-style" class="${inputClass}">
                                        <option value="style-wanted" data-i18n="news.special.wanted">${t('news.special.wanted')}</option>
                                        <option value="style-decree" data-i18n="news.special.decree">${t('news.special.decree')}</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="${labelClass}" id="lbl-extra" data-i18n="news.special.reward">${t('news.special.reward')}</label>
                                    <input type="text" id="inp-extra" class="${inputClass}" placeholder="Ej: 5000 GP">
                                </div>

                                <div id="div-decree-settings" class="hidden space-y-3 pt-2 border-t border-gray-700">
                                    <div>
                                        <div class="flex justify-between items-end mb-1">
                                            <label class="${labelClass} mb-0" data-i18n="news.special.seal">${t('news.special.seal')}</label>
                                            <i class="ph ph-info text-amber-500 cursor-help" title="Ejemplos: ph-crown, ph-scroll, ph-sword"></i>
                                        </div>
                                        <input type="text" id="inp-decree-icon" class="${inputClass}" placeholder="Ej: ph-crown">
                                    </div>
                                    <div>
                                        <label class="${labelClass}" data-i18n="news.special.seal.img">${t('news.special.seal.img')}</label>
                                        <div class="flex">
                                            <input type="text" id="inp-decree-img" class="${baseInputClass} rounded-l flex-1" placeholder="https://...">
                                            <button type="button" id="btn-upload-decree" class="px-3 bg-[#222] border border-l-0 border-gray-700 text-gray-400 hover:text-white rounded-r transition">
                                                <i class="ph ph-upload-simple"></i>
                                            </button>
                                        </div>
                                        <input type="file" id="file-upload-decree" class="hidden" accept="image/*">
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3 items-end">
                                <div id="page-selector-container">
                                    <label class="${labelClass}" data-i18n="news.page">${t('news.page')}</label>
                                    <select id="inp-page" class="${inputClass} cursor-pointer h-[38px]"></select>
                                </div>
                                <div>
                                    <label class="${labelClass}" id="lbl-image" data-i18n="news.image">${t('news.image')}</label>
                                    <div class="flex h-[38px]">
                                        <input type="text" id="inp-img" class="${baseInputClass} rounded-l flex-1 h-full" placeholder="https://...">
                                        <button type="button" id="btn-upload-main" class="px-3 bg-[#222] border border-l-0 border-gray-700 text-gray-400 hover:text-white rounded-r transition h-full">
                                            <i class="ph ph-upload-simple"></i>
                                        </button>
                                    </div>
                                    <input type="file" id="file-upload-main" class="hidden" accept="image/*">
                                </div>
                            </div>

                            <div>
                                <label class="${labelClass}" id="lbl-body" data-i18n="news.body">${t('news.body')}</label>
                                <textarea id="inp-body" rows="8" class="${inputClass} leading-relaxed" placeholder="${t('news.body.placeholder')}"></textarea>
                            </div>

                            <div class="flex gap-2 pt-2">
                                <button type="submit" id="btn-submit" class="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded font-bold uppercase tracking-wide transition shadow-lg" data-i18n="news.btn.add">${t('news.btn.add')}</button>
                                <div id="edit-actions" class="hidden flex gap-2">
                                    <button type="button" id="btn-delete" class="px-4 border border-red-900 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded transition"><i class="ph ph-trash-simple text-lg"></i></button>
                                    <button type="button" id="btn-cancel" class="px-4 border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded transition"><i class="ph ph-x text-lg"></i></button>
                                </div>
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
            
            <div id="config-modal-layer" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center fade-in"></div>
        `;
        
        this.renderConfigModal();
        this.setupTypeToggle();
    }

    renderConfigModal() {
        const t = (key) => LanguageService.get(key);
        const modalHTML = `
            <div class="bg-[#111] border border-gray-700 w-96 rounded-lg overflow-hidden shadow-2xl">
                <div class="bg-[#1a1a1a] p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 class="text-amber-500 font-bold medieval-font" data-i18n="news.settings.title">${t('news.settings.title')}</h3>
                    <button id="btn-close-modal" class="text-gray-400 hover:text-white"><i class="ph ph-x"></i></button>
                </div>
                <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div class="space-y-3 pb-4 border-b border-gray-800">
                        <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.identity">${t('conf.identity')}</h4>
                        <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.name">${t('conf.name')}</label><input type="text" id="modal-name" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                        <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.sub">${t('conf.sub')}</label><input type="text" id="modal-subtitle" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.price">${t('conf.price')}</label><input type="text" id="modal-price" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                        </div>
                    </div>
                    <div class="space-y-3 pb-4 border-b border-gray-800">
                        <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.aesthetics">${t('conf.aesthetics')}</h4>
                        <div>
                            <label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.paper">${t('conf.paper')}</label>
                            <select id="modal-texture" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded cursor-pointer">
                                <option value="texture-clean">Pergamino Real</option>
                                <option value="texture-gritty">Panfleto Sucio</option>
                                <option value="texture-magic">Hoja Arcana</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.font">${t('conf.font')}</label>
                            <select id="modal-font" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded cursor-pointer">
                                <option value="font-royal">Corte Real</option>
                                <option value="font-common">Imprenta Común</option>
                                <option value="font-arcane">Grimorio</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <h4 class="text-xs text-gray-500 font-bold uppercase" data-i18n="conf.chrono">${t('conf.chrono')}</h4>
                        <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.date.base">${t('conf.date.base')}</label><input type="date" id="modal-base-date" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                        <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.date.curr">${t('conf.date.curr')}</label><input type="date" id="modal-current-date" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.freq">${t('conf.freq')}</label><input type="number" id="modal-freq" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded"></div>
                            <div><label class="block text-xs text-amber-500 font-bold mb-1" data-i18n="conf.manual">${t('conf.manual')}</label><input type="number" id="modal-manual" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded" placeholder="0 = Auto"></div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t border-gray-800 flex justify-end">
                    <button id="btn-save-config" class="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded font-bold transition" data-i18n="btn.save">${t('btn.save')}</button>
                </div>
            </div>
        `;
        document.getElementById('config-modal-layer').innerHTML = modalHTML;
    }

    setupTypeToggle() {
        const btns = {
            news: document.getElementById('type-news'),
            ad: document.getElementById('type-ad'),
            special: document.getElementById('type-special')
        };
        const panels = {
            news: document.getElementById('opts-news'),
            ad: document.getElementById('opts-ad'),
            special: document.getElementById('opts-special')
        };
        const input = document.getElementById('inp-type');
        const pageSelector = document.getElementById('page-selector-container');
        
        const lblTitle = document.getElementById('lbl-title');
        const lblBody = document.getElementById('lbl-body');
        const lblExtra = document.getElementById('lbl-extra');
        const lblImage = document.getElementById('lbl-image');
        
        const selStyle = document.getElementById('inp-special-style');
        const divDecreeSettings = document.getElementById('div-decree-settings');

        const updateLabels = () => {
            const type = input.value;
            const t = LanguageService.get.bind(LanguageService);
            
            lblTitle.innerText = t('news.headline');
            lblBody.innerText = t('news.body');
            lblImage.innerText = t('news.image');
            
            if (type === 'special') {
                const style = selStyle.value;
                if (style === 'style-decree') {
                    lblTitle.innerText = t('lbl.decree.title');
                    lblBody.innerText = t('lbl.decree.body');
                    lblExtra.innerText = t('lbl.decree.auth');
                    lblImage.innerText = t('lbl.decree.image');
                    divDecreeSettings.classList.remove('hidden');
                } else {
                    lblTitle.innerText = t('lbl.wanted.name');
                    lblBody.innerText = t('lbl.wanted.desc');
                    lblExtra.innerText = t('lbl.wanted.reward');
                    lblImage.innerText = t('lbl.wanted.image');
                    divDecreeSettings.classList.add('hidden');
                }
            } else {
                divDecreeSettings.classList.add('hidden');
            }
        };

        selStyle.addEventListener('change', updateLabels);

        const activate = (type) => {
            input.value = type;
            Object.keys(btns).forEach(k => {
                if(k === type) {
                    btns[k].classList.add('bg-amber-700','text-white');
                    btns[k].classList.remove('text-gray-400');
                    panels[k].classList.remove('hidden');
                } else {
                    btns[k].classList.remove('bg-amber-700','text-white');
                    btns[k].classList.add('text-gray-400');
                    panels[k].classList.add('hidden');
                }
            });
            
            if(type === 'special') pageSelector.classList.add('opacity-50', 'pointer-events-none');
            else pageSelector.classList.remove('opacity-50', 'pointer-events-none');
            
            updateLabels();
        };

        btns.news.onclick = () => activate('news');
        btns.ad.onclick = () => activate('ad');
        btns.special.onclick = () => activate('special');
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
        if (item.type === 'special') {
            const el = document.createElement('div');
            el.className = `news-item type-special ${item.specialStyle || 'style-wanted'}`;
            el.draggable = true;
            el.dataset.id = item.id;
            
            let content = '';
            
            if (item.specialStyle === 'style-wanted') {
                const titleText = LanguageService.get('news.special.wanted.title');
                content = `
                    <h2 class="headline">${titleText}</h2>
                    ${item.image ? `<img src="${item.image}" class="news-img">` : ''}
                    <div class="news-body">
                        <h3>${item.title}</h3>
                        <p>${item.body}</p>
                    </div>
                    <div class="wanted-reward">${item.extra || 'REWARD'}</div>
                `;
            } else {
                let sealContent = '<i class="ph ph-crown"></i>';
                
                if (item.decreeImg) {
                    sealContent = `
                        <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; position:relative;">
                            <img src="${item.decreeImg}" style="
                                width: 100%; 
                                height: 100%; 
                                object-fit: contain; 
                                filter: grayscale(100%) brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(5) contrast(1.5); 
                                mix-blend-mode: multiply; 
                                opacity: 0.9;">
                        </div>`;
                } else if (item.decreeIcon) {
                    if (item.decreeIcon.startsWith('ph-')) {
                        sealContent = `<i class="ph ${item.decreeIcon}"></i>`;
                    } else {
                        sealContent = `<span>${item.decreeIcon}</span>`;
                    }
                }

                let decorativeImg = '';
                if (item.image) {
                    decorativeImg = `<img src="${item.image}" class="news-img" style="max-height: 200px; margin: 20px auto; width:auto;">`;
                }

                content = `
                    <div class="decree-seal">${sealContent}</div>
                    <h2 class="headline">${item.title}</h2>
                    ${decorativeImg}
                    <div class="news-body">${item.body.replace(/\n/g, '<br>')}</div>
                    <div class="mt-8 text-xl font-bold font-serif text-end w-full px-10">
                        Fdo: ${item.extra || 'La Corona'}
                    </div>
                `;
            }
            
            el.innerHTML = content;
            return el;
        } 
        
        const gridClass = item.size || 'span-6'; 
        const el = document.createElement('article');
        
        if(item.type === 'ad') {
             el.className = `ad-box ${gridClass}`;
             el.innerHTML = `<h4>${item.title}</h4>${item.image?`<img src="${item.image}" class="news-img">`:''}<p>${item.body}</p>`;
        } else {
             el.className = `news-item ${gridClass}`; 
             let body = item.body.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
             el.innerHTML = `${item.title?`<h3 class="headline">${item.title}</h3>`:''}${item.image?`<img src="${item.image}" class="news-img">`:''}<div class="news-body">${body}</div>`;
        }
        el.draggable = true;
        el.dataset.id = item.id;
        return el;
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
        if(!modal) return;
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
        
        if(item.type === 'special') {
            document.getElementById('type-special').click();
            document.getElementById('inp-special-style').value = item.specialStyle || 'style-wanted';
            document.getElementById('inp-extra').value = item.extra || '';
            document.getElementById('inp-decree-icon').value = item.decreeIcon || '';
            document.getElementById('inp-decree-img').value = item.decreeImg || '';
            
            document.getElementById('inp-special-style').dispatchEvent(new Event('change'));
        } else if (item.type === 'ad') {
            document.getElementById('type-ad').click();
            document.getElementById('inp-ad-type').value = item.size;
        } else {
            document.getElementById('type-news').click();
            document.getElementById('inp-size').value = item.size;
        }
        
        const btn = document.getElementById('btn-submit');
        btn.innerText = LanguageService.get('news.btn.save_edit'); 
        btn.classList.replace('bg-amber-700', 'bg-blue-700');
        document.getElementById('edit-actions').classList.remove('hidden');
    }

    resetForm() {
        document.getElementById('editor-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('type-news').click();
        const btn = document.getElementById('btn-submit');
        btn.innerText = LanguageService.get('news.btn.add');
        btn.classList.replace('bg-blue-700', 'bg-amber-700');
        document.getElementById('edit-actions').classList.add('hidden');
    }
}
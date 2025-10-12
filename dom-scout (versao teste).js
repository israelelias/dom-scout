// ===================================
// 🔭 DOM SCOUT v4.2 - Compact UI
// ===================================
// Para usar: Cole este código no Console (F12) e pressione Enter
// Atalho: Ctrl+F para abrir e navegar

(function() {
    'use strict';
    
    // Previne múltiplas execuções
    if (window.domScoutInstalled) {
        console.log('🔭 DOM Scout já instalado. Pressione Ctrl+F para usar.');
        return;
    }
    window.domScoutInstalled = true;

    // Estado da ferramenta
    let isVisible = false;
    let highlightedElements = [];
    let currentMatches = [];
    let currentIndex = 0;

    // Opções de busca
    const searchOptions = {
        regex: false,
        wholeWords: false,
        caseSensitive: false,
        accentSensitive: false,
        highlightAll: true,
        htmlMode: false,
        useTemplate: false
    };

    // Sistema de templates
    const STORAGE_KEY = 'domScoutTemplates';
    let savedTemplates = loadTemplates();
    let currentTemplate = null;

    // ===================================
    // 🎨 ESTILOS (Compact Version)
    // ===================================
    const styles = `
        #dom-scout-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 2147483647;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px B(0,0,0,0.3);
            padding: 8px 12px; /* Reduzido */
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            animation: slideDown 0.3s ease-out;
            height: auto;
            max-height: 350px;
            overflow: visible;
        }

        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        #dom-scout-wrapper { max-width: 1200px; margin: 0 auto; width: 100%; }

        #dom-scout-main {
            display: flex;
            gap: 8px; /* Reduzido */
            align-items: center;
            margin-bottom: 8px; /* Reduzido */
            flex-wrap: wrap;
        }

        #dom-scout-input {
            flex: 1;
            padding: 8px 15px; /* Reduzido */
            border: none;
            border-radius: 20px; /* Reduzido */
            font-size: 14px; /* Reduzido */
            outline: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            min-width: 200px;
        }
        
        #dom-scout-input:disabled { background-color: #e9ecef; cursor: not-allowed; opacity: 0.7; }
        #dom-scout-input:focus { box-shadow: 0 4px 15px rgba(0,0,0,0.3); transform: scale(1.01); }

        #dom-scout-info {
            color: white;
            font-size: 12px; /* Reduzido */
            min-width: 100px; /* Reduzido */
            text-align: center;
            font-weight: 500;
            padding: 6px 12px; /* Reduzido */
            background: rgba(255,255,255,0.1);
            border-radius: 15px; /* Reduzido */
        }

        .dom-scout-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 6px 12px; /* Reduzido */
            border-radius: 15px; /* Reduzido */
            cursor: pointer;
            font-size: 12px; /* Reduzido */
            transition: all 0.3s;
            font-weight: 500;
            white-space: nowrap;
        }

        .dom-scout-btn:hover { background: rgba(255,255,255,0.35); transform: translateY(-1px); }
        .dom-scout-btn:active { transform: translateY(0); }

        #dom-scout-options { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; } /* Gap Reduzido */

        .dom-scout-option {
            display: flex; align-items: center; gap: 5px; /* Reduzido */
            color: white; font-size: 12px; /* Reduzido */
            cursor: pointer; user-select: none; padding: 3px 6px; /* Reduzido */
            border-radius: 10px; transition: background 0.2s;
        }

        .dom-scout-option:hover { background: rgba(255,255,255,0.1); }
        .dom-scout-option input[type="checkbox"] { cursor: pointer; width: 14px; height: 14px; } /* Reduzido */
        .dom-scout-option.disabled { opacity: 0.5; cursor: not-allowed; }
        .dom-scout-option.disabled input[type="checkbox"] { cursor: not-allowed; }

        /* Estilos de highlight e badges permanecem os mesmos para visibilidade */
        .dom-scout-highlight { outline: 3px solid #ff6b6b !important; outline-offset: 2px; background-color: rgba(255, 107, 107, 0.15) !important; position: relative !important; z-index: 999999 !important; animation: highlightPulse 1.5s ease-in-out infinite; }
        .dom-scout-highlight-current { outline: 5px solid #ffd93d !important; outline-offset: 3px; background-color: rgba(255, 217, 61, 0.25) !important; animation: highlightPulseCurrent 1s ease-in-out infinite; box-shadow: 0 0 20px rgba(255, 217, 61, 0.6) !important; }
        .dom-scout-highlight-star { outline: 4px solid #4ecdc4 !important; outline-offset: 2px; background-color: rgba(78, 205, 196, 0.2) !important; animation: highlightPulseStar 1.5s ease-in-out infinite; }
        @keyframes highlightPulse { 0%, 100% { outline-color: #ff6b6b; } 50% { outline-color: #ff8787; } }
        @keyframes highlightPulseCurrent { 0%, 100% { outline-color: #ffd93d; } 50% { outline-color: #feca57; } }
        @keyframes highlightPulseStar { 0%, 100% { outline-color: #4ecdc4; } 50% { outline-color: #45b8b0; } }
        .dom-scout-badge { position: absolute; top: -12px; right: -12px; background: #ff6b6b; color: white; border-radius: 12px; padding: 4px 8px; font-size: 11px; font-weight: bold; z-index: 10000000; box-shadow: 0 2px 8px rgba(0,0,0,0.3); pointer-events: none; }
        .dom-scout-badge-current { background: #ffd93d; color: #333; font-size: 12px; padding: 5px 10px; animation: badgePulse 1s ease-in-out infinite; }
        .dom-scout-badge-star { background: #4ecdc4; color: white; }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .dom-scout-action-badge { position: absolute; top: -12px; left: -12px; background: #4ecdc4; color: white; border-radius: 12px; padding: 4px 10px; font-size: 11px; font-weight: bold; z-index: 10000000; box-shadow: 0 2px 8px rgba(0,0,0,0.3); pointer-events: none; animation: actionBadgePulse 1.5s ease-in-out infinite; }
        @keyframes actionBadgePulse { 0%, 100% { background: #4ecdc4; transform: scale(1); } 50% { background: #45b8b0; transform: scale(1.05); } }
        .dom-scout-error { color: #ffcccc; font-size: 12px; margin-top: 5px; }
        .dom-scout-success { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(78, 205, 196, 0.95); color: white; padding: 20px 40px; border-radius: 15px; font-size: 18px; font-weight: bold; z-index: 2147483648; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: successPopup 0.3s ease-out; }
        @keyframes successPopup { from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

        /* Templates Section Compact */
        #dom-scout-templates {
            display: none; margin-top: 8px; /* Reduzido */
            padding: 10px; /* Reduzido */
            border-top: 1px solid rgba(255,255,255,0.2);
            background: rgba(0,0,0,0.1); border-radius: 12px; /* Reduzido */
            animation: expandTemplates 0.3s ease-out;
        }
        #dom-scout-templates.active { display: block; }
        @keyframes expandTemplates { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 200px; } }
        #dom-scout-template-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; } /* Gap Reduzido */
        #dom-scout-template-select { flex: 1; min-width: 180px; padding: 6px 12px; /* Reduzido */ border: none; border-radius: 15px; font-size: 12px; /* Reduzido */ background: rgba(255,255,255,0.9); cursor: pointer; outline: none; }
        #dom-scout-template-select:focus { box-shadow: 0 0 0 2px rgba(255,255,255,0.5); }
        .dom-scout-template-btn { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 6px 12px; /* Reduzido */ border-radius: 15px; cursor: pointer; font-size: 11px; /* Reduzido */ transition: all 0.3s; font-weight: 500; white-space: nowrap; }
        .dom-scout-template-btn:hover { background: rgba(255,255,255,0.35); transform: translateY(-1px); }
        .dom-scout-template-btn:active { transform: translateY(0); }
        .dom-scout-template-btn.save { background: rgba(78, 205, 196, 0.3); border-color: rgba(78, 205, 196, 0.5); }
        .dom-scout-template-btn.save:hover { background: rgba(78, 205, 196, 0.4); }
        .dom-scout-template-btn.delete { background: rgba(255, 107, 107, 0.3); border-color: rgba(255, 107, 107, 0.5); }
        .dom-scout-template-btn.delete:hover { background: rgba(255, 107, 107, 0.4); }
        .dom-scout-template-info { color: rgba(255,255,255,0.8); font-size: 10px; /* Reduzido */ margin-top: 5px; font-style: italic; }
        .dom-scout-template-placeholder { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 10px; }
        
        /* Template Status Indicator */
        #dom-scout-status-bar {
            display: none; margin-top: 8px; padding: 6px 10px; /* Reduzido */
            background: rgba(0,0,0,0.15); border-radius: 12px;
            color: rgba(255,255,255,0.9); font-size: 11px; /* Reduzido */
            text-align: center;
        }

        #dom-scout-container .dom-scout-info-footer {
             color: rgba(255,255,255,0.7); font-size: 10px; margin-top: 5px;
        }

        .dom-scout-highlight, .dom-scout-highlight-current, .dom-scout-highlight-star { position: relative !important; }
        @media (max-width: 768px) { #dom-scout-container { padding: 8px; } #dom-scout-main { gap: 5px; } .dom-scout-btn { padding: 5px 10px; font-size: 11px; } }
    `;
    
    // ... o restante do código JavaScript permanece idêntico ...

    // Injeta os estilos
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // ===================================
    // 🎯 CRIAÇÃO DA INTERFACE
    // ===================================
    function createSearchUI() {
        const container = document.createElement('div');
        container.id = 'dom-scout-container';
        container.style.display = 'none';
        
        container.innerHTML = `
            <div id="dom-scout-wrapper">
                <div id="dom-scout-main">
                    <input 
                        type="text" 
                        id="dom-scout-input" 
                        placeholder="🔭 Buscar texto na página..." 
                        autocomplete="off"
                        spellcheck="false"
                    />
                    <span id="dom-scout-info">0 resultados</span>
                    <button class="dom-scout-btn" id="dom-scout-clear">Limpar</button>
                    <button class="dom-scout-btn" id="dom-scout-close">Fechar</button>
                </div>
                <div id="dom-scout-options">
                    <label class="dom-scout-option" title="Buscar por elementos HTML (tag, class, id, atributo)">
                        <input type="checkbox" id="opt-html-mode">
                        <span>🏷️ HTML</span>
                    </label>
                    <label class="dom-scout-option" id="opt-use-template-label" title="Usar template salvo com placeholder {text}">
                        <input type="checkbox" id="opt-use-template">
                        <span>📋 Template</span>
                    </label>
                    <button class="dom-scout-btn" id="dom-scout-template-options-btn" style="display: none;">Opções</button>
                    <label class="dom-scout-option" title="Usar expressões regulares">
                        <input type="checkbox" id="opt-regex">
                        <span>Regex</span>
                    </label>
                    <label class="dom-scout-option" title="Buscar apenas palavras completas">
                        <input type="checkbox" id="opt-whole-words">
                        <span>Palavras</span>
                    </label>
                    <label class="dom-scout-option" title="Diferenciar maiúsculas e minúsculas">
                        <input type="checkbox" id="opt-case-sensitive">
                        <span>Aa</span>
                    </label>
                    <label class="dom-scout-option" title="Considerar acentos (á ≠ a)">
                        <input type="checkbox" id="opt-accent-sensitive">
                        <span>À</span>
                    </label>
                    <label class="dom-scout-option" title="Destacar todos os resultados">
                        <input type="checkbox" id="opt-highlight-all" checked>
                        <span>Todas</span>
                    </label>
                </div>
                <div id="dom-scout-status-bar">
                    Nenhum template carregado.
                </div>
                <div id="dom-scout-templates">
                    <div id="dom-scout-template-controls">
                        <select id="dom-scout-template-select">
                            <option value="">Selecione um template...</option>
                        </select>
                        <button class="dom-scout-template-btn save" id="dom-scout-template-save" title="Salvar query atual como template">💾 Salvar</button>
                        <button class="dom-scout-template-btn" id="dom-scout-template-load" title="Carregar template selecionado">📥 Carregar</button>
                        <button class="dom-scout-template-btn delete" id="dom-scout-template-delete" title="Excluir template selecionado">🗑️ Excluir</button>
                        <button class="dom-scout-template-btn" id="dom-scout-template-close">Fechar</button>
                    </div>
                    <div class="dom-scout-template-info" id="dom-scout-template-info">
                        Use <span class="dom-scout-template-placeholder">{text}</span> para placeholders
                    </div>
                </div>
                <div id="dom-scout-error"></div>
                <div class="dom-scout-info-footer" style="color: rgba(255,255,255,0.7); font-size: 10px; margin-top: 5px;">
                    Operadores: < (escopo) > (hierarquia) * (destaque) & (ação) | Ctrl+F: próximo | Enter: clicar
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    }

    const searchContainer = createSearchUI();
    const searchInput = document.getElementById('dom-scout-input');
    const searchInfo = document.getElementById('dom-scout-info');
    const searchError = document.getElementById('dom-scout-error');
    const clearBtn = document.getElementById('dom-scout-clear');
    const closeBtn = document.getElementById('dom-scout-close');
    const statusBar = document.getElementById('dom-scout-status-bar');

    // Checkboxes de opções
    const optHtmlMode = document.getElementById('opt-html-mode');
    const optUseTemplate = document.getElementById('opt-use-template');
    const optUseTemplateLabel = document.getElementById('opt-use-template-label');
    const optRegex = document.getElementById('opt-regex');
    const optWholeWords = document.getElementById('opt-whole-words');
    const optCaseSensitive = document.getElementById('opt-case-sensitive');
    const optAccentSensitive = document.getElementById('opt-accent-sensitive');
    const optHighlightAll = document.getElementById('opt-highlight-all');

    // Elementos de templates
    const templatesSection = document.getElementById('dom-scout-templates');
    const templateSelect = document.getElementById('dom-scout-template-select');
    const templateSaveBtn = document.getElementById('dom-scout-template-save');
    const templateLoadBtn = document.getElementById('dom-scout-template-load');
    const templateDeleteBtn = document.getElementById('dom-scout-template-delete');
    const templateOptionsBtn = document.getElementById('dom-scout-template-options-btn');
    const templateCloseBtn = document.getElementById('dom-scout-template-close');
    const templateInfo = document.getElementById('dom-scout-template-info');
    
    function removeAccents(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function createSearchRegex(term) { try { let pattern = searchOptions.regex ? term : escapeRegex(term); if (searchOptions.wholeWords && !searchOptions.regex) { pattern = `\\b${pattern}\\b`; } let flags = 'g'; if (!searchOptions.caseSensitive) { flags += 'i'; } return new RegExp(pattern, flags); } catch (e) { return null; } }
    function prepareString(str) { return searchOptions.accentSensitive ? str : removeAccents(str); }
    function showSuccess(message) { const div = document.createElement('div'); div.className = 'dom-scout-success'; div.textContent = message; document.body.appendChild(div); setTimeout(() => { div.style.animation = 'successPopup 0.3s ease-out reverse'; setTimeout(() => div.remove(), 300); }, 1500); }
    function loadTemplates() { try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) : []; } catch (e) { console.error('Erro ao carregar templates:', e); return []; } }
    function saveTemplates() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTemplates)); } catch (e) { console.error('Erro ao salvar templates:', e); showSuccess('❌ Erro ao salvar template'); } }
    function updateTemplateSelect() { templateSelect.innerHTML = '<option value="">Selecione um template...</option>'; savedTemplates.forEach((template, index) => { const option = document.createElement('option'); option.value = index; option.textContent = template.name; templateSelect.appendChild(option); }); }
    function saveCurrentTemplate() { const query = searchInput.value.trim(); if (!query) { showSuccess('❌ Digite uma query primeiro'); return; } const name = prompt('Nome do template:', ''); if (!name) return; const template = { name: name.trim(), query: query, htmlMode: searchOptions.htmlMode, timestamp: Date.now() }; savedTemplates.push(template); saveTemplates(); updateTemplateSelect(); showSuccess('✓ Template salvo!'); toggleTemplatePanel(false); }
    function loadSelectedTemplate() { const index = templateSelect.value; if (index === '') { showSuccess('❌ Selecione um template'); return; } const template = savedTemplates[index]; if (!template) return; currentTemplate = template; if (!searchOptions.useTemplate) { searchInput.value = template.query; if (template.htmlMode && !searchOptions.htmlMode) { optHtmlMode.checked = true; searchOptions.htmlMode = true; updateUIState(); } showSuccess('✓ Template carregado!'); } else { searchInput.value = ''; searchInput.placeholder = `Valor para: ${template.name}`; searchInput.disabled = false; searchInput.focus(); showSuccess('✓ Template ativo!'); } updateStatusBar(); toggleTemplatePanel(false); }
    function deleteSelectedTemplate() { const index = templateSelect.value; if (index === '') { showSuccess('❌ Selecione um template'); return; } const template = savedTemplates[index]; if (!confirm(`Excluir template "${template.name}"?`)) return; savedTemplates.splice(index, 1); saveTemplates(); updateTemplateSelect(); if (currentTemplate === template) { currentTemplate = null; updateStatusBar(); if (searchOptions.useTemplate) { searchInput.disabled = true; searchInput.placeholder = 'Carregue um template'; } } showSuccess('✓ Template excluído!'); toggleTemplatePanel(false); }
    function processTemplateQuery(userInput) { if (!currentTemplate) return userInput; let processedQuery = currentTemplate.query.replace(/\{text\}/g, userInput); return processedQuery; }
    function updateStatusBar() { if (!searchOptions.htmlMode && !searchOptions.useTemplate) { statusBar.style.display = 'none'; return; } statusBar.style.display = 'block'; statusBar.textContent = currentTemplate ? `Template: "${currentTemplate.name}"` : 'Nenhum template carregado.'; }
    function toggleTemplatePanel(show) { templatesSection.classList.toggle('active', show); const isUseTemplateMode = searchOptions.useTemplate; templateSaveBtn.style.display = isUseTemplateMode ? 'none' : 'inline-block'; templateDeleteBtn.style.display = isUseTemplateMode ? 'none' : 'inline-block'; }
    function parseAdvancedQuery(query) { const parts = query.split('&').map(p => p.trim()); const mainQuery = parts[0]; const actionQuery = parts[1] || null; let scopeQuery = null; let hierarchyQuery = mainQuery; if (mainQuery.includes('<')) { const scopeParts = mainQuery.split('<').map(p => p.trim()); scopeQuery = scopeParts[0]; hierarchyQuery = scopeParts.slice(1).join('<').trim(); } let scopeFilters = null; if (scopeQuery) { const parsed = parseFilters(scopeQuery); if (parsed.error) return parsed; scopeFilters = parsed.filters; } const hierarchyLevels = hierarchyQuery.split('>').map(p => p.trim()); const parsedHierarchy = []; let highlightIndex = -1; hierarchyLevels.forEach((level, index) => { const hasHighlight = level.includes('*'); if (hasHighlight) { highlightIndex = index; level = level.replace(/\*/g, '').trim(); } const parsed = parseFilters(level); if (parsed.error) { parsedHierarchy.push({ error: parsed.error }); return; } parsedHierarchy.push({ filters: parsed.filters, highlight: hasHighlight, level: index }); }); const errorLevel = parsedHierarchy.find(h => h.error); if (errorLevel) return { error: errorLevel.error }; let actionFilters = null; if (actionQuery) { const parsed = parseFilters(actionQuery); if (parsed.error) return parsed; actionFilters = parsed.filters; } if (highlightIndex === -1 && parsedHierarchy.length > 0) { highlightIndex = parsedHierarchy.length - 1; parsedHierarchy[highlightIndex].highlight = true; } return { scope: scopeFilters, hierarchy: parsedHierarchy, highlightIndex: highlightIndex, action: actionFilters }; }
    function parseFilters(queryPart) { const filters = []; const regex = /(tag|class|id|attr|text):([^\s:]+(?:=[^\s:]+)?)/gi; let match; let hasMatch = false; while ((match = regex.exec(queryPart)) !== null) { hasMatch = true; const type = match[1].toLowerCase(); let fullValue = match[2]; let key = fullValue; let value = null; if (fullValue.includes('=')) { const parts = fullValue.split('='); key = parts[0]; value = parts.slice(1).join('='); } filters.push({ type, key, value }); } if (!hasMatch) return { error: 'Sintaxe inválida' }; return { filters }; }
    function searchHTML(query) { clearHighlights(); searchError.textContent = ''; currentMatches = []; currentIndex = 0; if (!query) { updateInfo(0, 0); return; } const parsed = parseAdvancedQuery(query); if (parsed.error) { searchError.textContent = `❌ ${parsed.error}`; updateInfo(0, 0); return; } let searchScope = [document.body]; if (parsed.scope) { searchScope = []; document.querySelectorAll('*').forEach(element => { if (!element.closest('#dom-scout-container') && matchFilters(element, parsed.scope)) searchScope.push(element); }); if (searchScope.length === 0) { searchError.textContent = '⚠️ Escopo não encontrado'; updateInfo(0, 0); return; } } const matchedElements = []; searchScope.forEach(scope => matchedElements.push(...findHierarchyMatches(scope, parsed))); currentMatches = matchedElements.filter((item, index, self) => self.findIndex(t => t.element === item.element) === index).map(item => ({ element: item.element, count: 1, actionElement: item.actionElement, isStarred: item.isStarred })).sort((a, b) => a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1); if (searchOptions.highlightAll) currentMatches.forEach((match, index) => highlightElement(match.element, index + 1, match.count, false, match.actionElement, match.isStarred)); updateInfo(currentMatches.length, 1); if (currentMatches.length > 0) goToMatch(0); }
    function findHierarchyMatches(scope, parsed) { const results = []; const { hierarchy, highlightIndex, action } = parsed; if (hierarchy.length === 0) return results; function traverse(elements, level, path) { if (level >= hierarchy.length) { const elToHighlight = path[highlightIndex]; if (!elToHighlight) return; let actionEl = null; if (action) { for (const cand of elToHighlight.querySelectorAll('*')) { if (matchFilters(cand, action)) { actionEl = cand; break; } } } results.push({ element: elToHighlight, actionElement: actionEl, isStarred: hierarchy[highlightIndex]?.highlight || false }); return; } const { filters } = hierarchy[level]; for (const el of elements) { for (const cand of el.querySelectorAll('*')) { if (!cand.closest('#dom-scout-container') && matchFilters(cand, filters)) { const newPath = [...path]; newPath[level] = cand; traverse([cand], level + 1, newPath); } } } } traverse([scope], 0, []); return results; }
    function matchFilters(element, filters) { for (const { type, key, value } of filters) { switch (type) { case 'tag': if (!matchTag(element, key)) return false; break; case 'class': if (!matchClass(element, key)) return false; break; case 'id': if (!matchId(element, key)) return false; break; case 'attr': if (!matchAttribute(element, key, value)) return false; break; case 'text': if (!matchText(element, key)) return false; break; } } return true; }
    function matchTag(el, val) { const tag = el.tagName.toLowerCase(); const s = prepareString(val); if (searchOptions.regex) try { return new RegExp(s, searchOptions.caseSensitive ? '' : 'i').test(tag); } catch (e) { return false; } return searchOptions.caseSensitive ? tag === s : tag === s.toLowerCase(); }
    function matchClass(el, val) { if (!el.className || typeof el.className !== 'string') return false; const classes = el.className.split(/\s+/).filter(c => c); const s = prepareString(val); if (searchOptions.regex) try { return classes.some(c => new RegExp(s, searchOptions.caseSensitive ? '' : 'i').test(prepareString(c))); } catch (e) { return false; } return classes.some(c => searchOptions.caseSensitive ? prepareString(c).includes(s) : prepareString(c).toLowerCase().includes(s.toLowerCase())); }
    function matchId(el, val) { if (!el.id) return false; const id = prepareString(el.id); const s = prepareString(val); if (searchOptions.regex) try { return new RegExp(s, searchOptions.caseSensitive ? '' : 'i').test(id); } catch (e) { return false; } return searchOptions.caseSensitive ? id.includes(s) : id.toLowerCase().includes(s.toLowerCase()); }
    function matchAttribute(el, name, val) { const attr = el.attributes[name]; if (!attr) return false; if (val === null) return true; const attrVal = prepareString(attr.value); const s = prepareString(val); if (searchOptions.regex) try { return new RegExp(s, searchOptions.caseSensitive ? '' : 'i').test(attrVal); } catch (e) { return false; } return searchOptions.caseSensitive ? attrVal.includes(s) : attrVal.toLowerCase().includes(s.toLowerCase()); }
    function matchText(el, val) { const text = prepareString(el.textContent.trim()); const s = prepareString(val); if (!text) return false; if (searchOptions.regex) try { return new RegExp(s, searchOptions.caseSensitive ? '' : 'i').test(text); } catch (e) { return false; } if (searchOptions.wholeWords) return new RegExp(`\\b${escapeRegex(s)}\\b`, searchOptions.caseSensitive ? '' : 'i').test(text); return searchOptions.caseSensitive ? text.includes(s) : text.toLowerCase().includes(s.toLowerCase()); }
    function searchText(term) { if (searchOptions.useTemplate && currentTemplate) { term = processTemplateQuery(term); if (currentTemplate.htmlMode) { searchHTML(term); return; } } if (searchOptions.htmlMode) { searchHTML(term); return; } clearHighlights(); searchError.textContent = ''; currentMatches = []; currentIndex = 0; if (!term) { updateInfo(0, 0); return; } const regex = createSearchRegex(prepareString(term)); if (!regex) { searchError.textContent = '❌ Regex inválida'; updateInfo(0, 0); return; } const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => !n.parentElement.closest('#dom-scout-container, SCRIPT, STYLE') && n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }); const matched = new Map(); let node; while (node = walker.nextNode()) { if (regex.test(prepareString(node.textContent))) { const el = node.parentElement; matched.set(el, (matched.get(el) || 0) + 1); } regex.lastIndex = 0; } currentMatches = Array.from(matched.entries()).map(([element, count]) => ({ element, count, actionElement: null, isStarred: false })).sort((a, b) => a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1); if (searchOptions.highlightAll) currentMatches.forEach((match, index) => highlightElement(match.element, index + 1, match.count, false, null, false)); updateInfo(currentMatches.length, 1); if (currentMatches.length > 0) goToMatch(0); }
    function highlightElement(el, index, count, isCurrent, actionEl, isStarred) { el.classList.add('dom-scout-highlight'); if (isStarred) el.classList.add('dom-scout-highlight-star'); if (isCurrent) el.classList.add('dom-scout-highlight-current'); const badge = document.createElement('div'); badge.className = `dom-scout-badge ${isCurrent ? 'dom-scout-badge-current' : ''} ${isStarred ? 'dom-scout-badge-star' : ''}`; badge.textContent = count > 1 ? `${index} (${count}×)` : index; badge.dataset.domScoutBadge = 'true'; if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative'; el.appendChild(badge); if (actionEl && isCurrent) { const actionBadge = document.createElement('div'); actionBadge.className = 'dom-scout-action-badge'; actionBadge.textContent = '⚡ AÇÃO'; actionBadge.dataset.domScoutActionBadge = 'true'; el.appendChild(actionBadge); } }
    function clearHighlights() { document.querySelectorAll('.dom-scout-highlight, .dom-scout-highlight-star').forEach(el => { el.classList.remove('dom-scout-highlight', 'dom-scout-highlight-current', 'dom-scout-highlight-star'); el.querySelectorAll('[data-dom-scout-badge], [data-dom-scout-action-badge]').forEach(b => b.remove()); }); }
    function goToMatch(index) { if (currentMatches.length === 0) return; if (currentMatches[currentIndex]) { const cur = currentMatches[currentIndex].element; cur.classList.remove('dom-scout-highlight-current'); cur.querySelector('.dom-scout-badge')?.classList.remove('dom-scout-badge-current'); cur.querySelector('[data-dom-scout-action-badge]')?.remove(); } currentIndex = (index + currentMatches.length) % currentMatches.length; const { element, count, actionElement, isStarred } = currentMatches[currentIndex]; if (!searchOptions.highlightAll) { clearHighlights(); highlightElement(element, currentIndex + 1, count, true, actionElement, isStarred); } else { element.classList.add('dom-scout-highlight-current'); element.querySelector('.dom-scout-badge')?.classList.add('dom-scout-badge-current'); if (actionElement) { const actionBadge = document.createElement('div'); actionBadge.className = 'dom-scout-action-badge'; actionBadge.textContent = '⚡ AÇÃO'; actionBadge.dataset.domScoutActionBadge = 'true'; element.appendChild(actionBadge); } } element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }); updateInfo(currentMatches.length, currentIndex + 1); }
    function nextMatch() { if (currentMatches.length > 0) goToMatch(currentIndex + 1); }
    function prevMatch() { if (currentMatches.length > 0) goToMatch(currentIndex - 1); }
    function executeAction() { if (currentMatches.length === 0) return; const { actionElement, element } = currentMatches[currentIndex]; const elToClick = actionElement || element; if (elToClick) { elToClick.click(); showSuccess(`✓ Ação executada`); } }
    function updateInfo(total, current) { searchInfo.textContent = total === 0 ? 'Nenhum resultado' : `${current} de ${total}`; }
    function showSearch() { searchContainer.style.display = 'block'; searchInput.focus(); searchInput.select(); isVisible = true; }
    function hideSearch() { searchContainer.style.display = 'none'; clearHighlights(); isVisible = false; }
    function updatePlaceholder() { if (searchOptions.useTemplate) { searchInput.placeholder = currentTemplate ? `Valor para: ${currentTemplate.name}` : 'Carregue um template'; } else if (searchOptions.htmlMode) { searchInput.placeholder = 'tag:div > *span > text:valor & button'; } else { searchInput.placeholder = '🔭 Buscar texto na página...'; } }
    function updateUIState() { const isHtml = searchOptions.htmlMode; optUseTemplateLabel.classList.toggle('disabled', !isHtml); if (!isHtml && searchOptions.useTemplate) { optUseTemplate.checked = false; searchOptions.useTemplate = false; } templateOptionsBtn.style.display = isHtml ? 'inline-block' : 'none'; optWholeWords.parentElement.classList.toggle('disabled', isHtml); optWholeWords.disabled = isHtml; updateStatusBar(); searchInput.disabled = searchOptions.useTemplate && !currentTemplate; updatePlaceholder(); if (!isHtml && !searchOptions.useTemplate) toggleTemplatePanel(false); }
    document.addEventListener('keydown', e => { const t = e.target; if ((t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') && t.id !== 'dom-scout-input') return; if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); if (!isVisible) showSearch(); else nextMatch(); } if (e.shiftKey && e.key === 'F' && isVisible) { e.preventDefault(); prevMatch(); } if (e.key === 'Escape' && isVisible) hideSearch(); if (isVisible && !searchInput.contains(t) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); executeAction(); } });
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); executeAction(); } });
    let searchTimeout; searchInput.addEventListener('input', e => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => searchText(e.target.value), 300); });
    optHtmlMode.addEventListener('change', () => { searchOptions.htmlMode = optHtmlMode.checked; if (!searchOptions.htmlMode) { optUseTemplate.checked = false; searchOptions.useTemplate = false; } updateUIState(); if (searchInput.value) searchText(searchInput.value); });
    optUseTemplate.addEventListener('change', () => { if (optUseTemplate.checked && !searchOptions.htmlMode) { optUseTemplate.checked = false; showSuccess('❌ Ative "HTML" primeiro'); return; } searchOptions.useTemplate = optUseTemplate.checked; updateUIState(); if (searchOptions.useTemplate) toggleTemplatePanel(true); });
    [optRegex, optWholeWords, optCaseSensitive, optAccentSensitive, optHighlightAll].forEach(cb => { cb.addEventListener('change', e => { const opt = e.target.id.replace('opt-', '').replace(/-./g, x => x[1].toUpperCase()); searchOptions[opt] = e.target.checked; if (searchInput.value) searchText(searchInput.value); }); });
    templateOptionsBtn.addEventListener('click', () => toggleTemplatePanel(true));
    templateCloseBtn.addEventListener('click', () => toggleTemplatePanel(false));
    templateSaveBtn.addEventListener('click', saveCurrentTemplate);
    templateLoadBtn.addEventListener('click', loadSelectedTemplate);
    templateDeleteBtn.addEventListener('click', deleteSelectedTemplate);
    templateSelect.addEventListener('change', () => { if (searchOptions.useTemplate && templateSelect.value) loadSelectedTemplate(); });
    clearBtn.addEventListener('click', () => { searchInput.value = ''; clearHighlights(); searchError.textContent = ''; updateInfo(0, 0); searchInput.focus(); });
    closeBtn.addEventListener('click', hideSearch);
    updateTemplateSelect(); updateUIState();
    console.log('%c🔭 DOM Scout v4.2 instalado!', 'color: #667eea; font-size: 18px; font-weight: bold;');
    console.log('%c✨ UI mais compacta e textos de opções abreviados.', 'color: #4ecdc4; font-size: 14px;');
    console.log('%c⌨️  Ctrl+F: Abrir/Próximo | Shift+F: Anterior | Enter: Clicar | ESC: Fechar', 'color: #ffd93d;');
})();

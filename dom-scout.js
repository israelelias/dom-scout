// ===================================
// 🔭 DOM SCOUT v4.0 - Operadores Refatorados
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
    // 🎨 ESTILOS
    // ===================================
    const styles = `
        #dom-scout-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 2147483647;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            padding: 15px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            animation: slideDown 0.3s ease-out;
            /* ✅ CORREÇÃO EDGE: Altura inicial definida */
            min-height: 55px;
            height: auto;
            max-height: 300px;
            overflow: visible;
        }

        @keyframes slideDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        #dom-scout-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            /* ✅ Garante layout correto */
            width: 100%;
        }

        #dom-scout-main {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
            /* ✅ Evita overflow */
            flex-wrap: wrap;
        }

        #dom-scout-input {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            /* ✅ Min width para evitar colapso */
            min-width: 200px;
        }

        #dom-scout-input:focus {
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform: scale(1.01);
        }

        #dom-scout-info {
            color: white;
            font-size: 14px;
            min-width: 120px;
            text-align: center;
            font-weight: 500;
            padding: 8px 16px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
        }

        .dom-scout-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            font-weight: 500;
            white-space: nowrap;
        }

        .dom-scout-btn:hover {
            background: rgba(255,255,255,0.35);
            transform: translateY(-2px);
        }

        .dom-scout-btn:active {
            transform: translateY(0);
        }

        #dom-scout-options {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .dom-scout-option {
            display: flex;
            align-items: center;
            gap: 6px;
            color: white;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            padding: 4px 8px;
            border-radius: 12px;
            transition: background 0.2s;
        }

        .dom-scout-option:hover {
            background: rgba(255,255,255,0.1);
        }

        .dom-scout-option input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }

        .dom-scout-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Highlight nos elementos */
        .dom-scout-highlight {
            outline: 3px solid #ff6b6b !important;
            outline-offset: 2px;
            background-color: rgba(255, 107, 107, 0.15) !important;
            position: relative !important;
            z-index: 999999 !important;
            animation: highlightPulse 1.5s ease-in-out infinite;
        }

        .dom-scout-highlight-current {
            outline: 5px solid #ffd93d !important;
            outline-offset: 3px;
            background-color: rgba(255, 217, 61, 0.25) !important;
            animation: highlightPulseCurrent 1s ease-in-out infinite;
            box-shadow: 0 0 20px rgba(255, 217, 61, 0.6) !important;
        }

        /* Highlight especial para elementos marcados com * */
        .dom-scout-highlight-star {
            outline: 4px solid #4ecdc4 !important;
            outline-offset: 2px;
            background-color: rgba(78, 205, 196, 0.2) !important;
            animation: highlightPulseStar 1.5s ease-in-out infinite;
        }

        @keyframes highlightPulse {
            0%, 100% {
                outline-color: #ff6b6b;
            }
            50% {
                outline-color: #ff8787;
            }
        }

        @keyframes highlightPulseCurrent {
            0%, 100% {
                outline-color: #ffd93d;
                transform: scale(1);
            }
            50% {
                outline-color: #feca57;
                transform: scale(1.01);
            }
        }

        @keyframes highlightPulseStar {
            0%, 100% {
                outline-color: #4ecdc4;
            }
            50% {
                outline-color: #45b8b0;
            }
        }

        /* Badge de contagem */
        .dom-scout-badge {
            position: absolute;
            top: -12px;
            right: -12px;
            background: #ff6b6b;
            color: white;
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10000000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            pointer-events: none;
        }

        .dom-scout-badge-current {
            background: #ffd93d;
            color: #333;
            font-size: 12px;
            padding: 5px 10px;
            animation: badgePulse 1s ease-in-out infinite;
        }

        .dom-scout-badge-star {
            background: #4ecdc4;
            color: white;
        }

        @keyframes badgePulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }

        /* Badge de ação (botão/link clicável) */
        .dom-scout-action-badge {
            position: absolute;
            top: -12px;
            left: -12px;
            background: #4ecdc4;
            color: white;
            border-radius: 12px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10000000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            pointer-events: none;
            animation: actionBadgePulse 1.5s ease-in-out infinite;
        }

        @keyframes actionBadgePulse {
            0%, 100% {
                background: #4ecdc4;
                transform: scale(1);
            }
            50% {
                background: #45b8b0;
                transform: scale(1.05);
            }
        }

        /* Mensagem de erro */
        .dom-scout-error {
            color: #ffcccc;
            font-size: 12px;
            margin-top: 5px;
        }

        /* ✅ CORREÇÃO EDGE: Mensagem de sucesso com dimensões fixas */
        .dom-scout-success {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(78, 205, 196, 0.95);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 2147483648;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: successPopup 0.3s ease-out;
            /* ✅ CORREÇÃO EDGE: Dimensões explícitas para evitar expansão */
            min-width: 200px;
            max-width: 500px;
            width: auto;
            min-height: 60px;
            max-height: 150px;
            height: auto;
            /* ✅ Centraliza conteúdo */
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* ✅ Previne problemas de layout */
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
        }

        @keyframes successPopup {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        /* Templates Section */
        #dom-scout-templates {
            display: none;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
            /* ✅ Animação suave de expansão */
            animation: expandTemplates 0.3s ease-out;
        }

        #dom-scout-templates.active {
            display: block;
        }

        @keyframes expandTemplates {
            from {
                opacity: 0;
                max-height: 0;
            }
            to {
                opacity: 1;
                max-height: 200px;
            }
        }

        #dom-scout-template-controls {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        #dom-scout-template-select {
            flex: 1;
            min-width: 200px;
            padding: 8px 15px;
            border: none;
            border-radius: 20px;
            font-size: 13px;
            background: rgba(255,255,255,0.9);
            cursor: pointer;
            outline: none;
        }

        #dom-scout-template-select:focus {
            box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
        }

        .dom-scout-template-btn {
            background: rgba(255,255,255,0.25);
            border: 1px solid rgba(255,255,255,0.4);
            color: white;
            padding: 8px 14px;
            border-radius: 18px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
            font-weight: 500;
            white-space: nowrap;
        }

        .dom-scout-template-btn:hover {
            background: rgba(255,255,255,0.35);
            transform: translateY(-1px);
        }

        .dom-scout-template-btn:active {
            transform: translateY(0);
        }

        .dom-scout-template-btn.save {
            background: rgba(78, 205, 196, 0.3);
            border-color: rgba(78, 205, 196, 0.5);
        }

        .dom-scout-template-btn.save:hover {
            background: rgba(78, 205, 196, 0.4);
        }

        .dom-scout-template-btn.delete {
            background: rgba(255, 107, 107, 0.3);
            border-color: rgba(255, 107, 107, 0.5);
        }

        .dom-scout-template-btn.delete:hover {
            background: rgba(255, 107, 107, 0.4);
        }

        .dom-scout-template-info {
            color: rgba(255,255,255,0.8);
            font-size: 11px;
            margin-top: 5px;
            font-style: italic;
        }

        .dom-scout-template-placeholder {
            color: rgba(255,255,255,0.7);
            background: rgba(255,255,255,0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
        }

        /* Ajuste de position para badges */
        .dom-scout-highlight,
        .dom-scout-highlight-current,
        .dom-scout-highlight-star {
            position: relative !important;
        }

        /* ✅ CORREÇÃO EDGE: Media queries para responsividade */
        @media (max-width: 768px) {
            #dom-scout-container {
                padding: 10px 15px;
            }
            
            #dom-scout-main {
                gap: 5px;
            }
            
            .dom-scout-btn {
                padding: 6px 12px;
                font-size: 12px;
            }
        }
    `;

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
                        <span>🏷️ Buscar Elementos HTML</span>
                    </label>
                    <label class="dom-scout-option" title="Usar template salvo com placeholder {text}">
                        <input type="checkbox" id="opt-use-template">
                        <span>📋 Usar Template</span>
                    </label>
                    <label class="dom-scout-option" title="Usar expressões regulares">
                        <input type="checkbox" id="opt-regex">
                        <span>Regex</span>
                    </label>
                    <label class="dom-scout-option" title="Buscar apenas palavras completas">
                        <input type="checkbox" id="opt-whole-words">
                        <span>Palavras Inteiras</span>
                    </label>
                    <label class="dom-scout-option" title="Diferenciar maiúsculas e minúsculas">
                        <input type="checkbox" id="opt-case-sensitive">
                        <span>Aa (Case Sensitive)</span>
                    </label>
                    <label class="dom-scout-option" title="Considerar acentos (á ≠ a)">
                        <input type="checkbox" id="opt-accent-sensitive">
                        <span>À (Com Acentos)</span>
                    </label>
                    <label class="dom-scout-option" title="Destacar todos os resultados">
                        <input type="checkbox" id="opt-highlight-all" checked>
                        <span>Destacar Todas</span>
                    </label>
                </div>
                <div id="dom-scout-templates">
                    <div id="dom-scout-template-controls">
                        <select id="dom-scout-template-select">
                            <option value="">Selecione um template...</option>
                        </select>
                        <button class="dom-scout-template-btn save" id="dom-scout-template-save" title="Salvar query atual como template">💾 Salvar</button>
                        <button class="dom-scout-template-btn" id="dom-scout-template-load" title="Carregar template selecionado">📥 Carregar</button>
                        <button class="dom-scout-template-btn delete" id="dom-scout-template-delete" title="Excluir template selecionado">🗑️ Excluir</button>
                    </div>
                    <div class="dom-scout-template-info" id="dom-scout-template-info">
                        💡 Use <span class="dom-scout-template-placeholder">{text}</span> para placeholders | <span class="dom-scout-template-placeholder">*</span> para definir destaque
                    </div>
                </div>
                <div id="dom-scout-error"></div>
                <div style="color: rgba(255,255,255,0.8); font-size: 11px; margin-top: 8px;">
                    💡 Operadores: < (escopo) > (hierarquia) * (destaque) & (ação) | Ctrl+F: próximo | Shift+F: anterior | Enter/Espaço: clicar
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

    // Checkboxes de opções
    const optHtmlMode = document.getElementById('opt-html-mode');
    const optUseTemplate = document.getElementById('opt-use-template');
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
    const templateInfo = document.getElementById('dom-scout-template-info');

    // ===================================
    // 🔧 FUNÇÕES AUXILIARES
    // ===================================

    function removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function createSearchRegex(term) {
        try {
            let pattern = term;
            if (!searchOptions.regex) {
                pattern = escapeRegex(term);
            }
            if (searchOptions.wholeWords && !searchOptions.regex) {
                pattern = `\\b${pattern}\\b`;
            }
            let flags = 'g';
            if (!searchOptions.caseSensitive) {
                flags += 'i';
            }
            return new RegExp(pattern, flags);
        } catch (e) {
            return null;
        }
    }

    function prepareString(str) {
        if (!searchOptions.accentSensitive) {
            return removeAccents(str);
        }
        return str;
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'dom-scout-success';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'successPopup 0.3s ease-out reverse';
            setTimeout(() => successDiv.remove(), 300);
        }, 1500);
    }

    // ===================================
    // 📋 SISTEMA DE TEMPLATES
    // ===================================

    function loadTemplates() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Erro ao carregar templates:', e);
            return [];
        }
    }

    function saveTemplates() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTemplates));
        } catch (e) {
            console.error('Erro ao salvar templates:', e);
            showSuccess('❌ Erro ao salvar template');
        }
    }

    function updateTemplateSelect() {
        templateSelect.innerHTML = '<option value="">Selecione um template...</option>';
        savedTemplates.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = template.name;
            templateSelect.appendChild(option);
        });
    }

    function saveCurrentTemplate() {
        const query = searchInput.value.trim();
        if (!query) {
            showSuccess('❌ Digite uma query primeiro');
            return;
        }
        const name = prompt('Nome do template:', '');
        if (!name) return;

        const template = {
            name: name.trim(),
            query: query,
            htmlMode: searchOptions.htmlMode,
            timestamp: Date.now()
        };

        savedTemplates.push(template);
        saveTemplates();
        updateTemplateSelect();
        showSuccess('✓ Template salvo!');
    }

    function loadSelectedTemplate() {
        const index = templateSelect.value;
        if (index === '') {
            showSuccess('❌ Selecione um template');
            return;
        }

        const template = savedTemplates[index];
        if (!template) return;

        currentTemplate = template;
        
        if (!searchOptions.useTemplate) {
            searchInput.value = template.query;
            if (template.htmlMode && !searchOptions.htmlMode) {
                optHtmlMode.checked = true;
                searchOptions.htmlMode = true;
                updatePlaceholder();
                optWholeWords.disabled = true;
                optWholeWords.parentElement.classList.add('disabled');
            }
            showSuccess('✓ Template carregado!');
        } else {
            searchInput.value = '';
            searchInput.placeholder = `Digite o valor para: ${template.name}`;
            showSuccess('✓ Template ativo! Digite o valor');
        }
    }

    function deleteSelectedTemplate() {
        const index = templateSelect.value;
        if (index === '') {
            showSuccess('❌ Selecione um template');
            return;
        }

        const template = savedTemplates[index];
        if (!confirm(`Excluir template "${template.name}"?`)) return;

        savedTemplates.splice(index, 1);
        saveTemplates();
        updateTemplateSelect();
        
        if (currentTemplate === template) {
            currentTemplate = null;
        }
        showSuccess('✓ Template excluído!');
    }

    function processTemplateQuery(userInput) {
        if (!currentTemplate) {
            return userInput;
        }

        let processedQuery = currentTemplate.query.replace(/\{text\}/g, userInput);
        templateInfo.innerHTML = `
            💡 Usando template: <span class="dom-scout-template-placeholder">${currentTemplate.name}</span>
            <br>Query: <span style="font-family: 'Courier New', monospace; font-size: 10px;">${processedQuery}</span>
        `;
        
        return processedQuery;
    }

    // ===================================
    // 🔍 PARSE AVANÇADO COM NOVOS OPERADORES
    // ===================================

    /**
     * Parse avançado da query com suporte aos operadores refatorados:
     * < = Escopo (limita onde buscar - opcional, apenas para performance)
     * > = Hierarquia (define relação pai > filho)
     * * = Destaque (define qual elemento será destacado)
     * & = Ação (define elemento clicável)
     * 
     * Exemplos:
     * tag:footer > tag:ul > *tag:li & tag:a
     * - Escopo: document.body (padrão)
     * - Hierarquia: footer > ul > li
     * - Destaque: li (marcado com *)
     * - Ação: a
     * 
     * tag:footer < tag:div > *tag:span > tag:a & tag:button
     * - Escopo: footer (limitador de busca)
     * - Hierarquia: div > span > a
     * - Destaque: span (marcado com *)
     * - Ação: button
     */
    function parseAdvancedQuery(query) {
        // Separa ação (usando &)
        const parts = query.split('&').map(p => p.trim());
        const mainQuery = parts[0];
        const actionQuery = parts[1] || null;

        // Separa escopo (usando <)
        let scopeQuery = null;
        let hierarchyQuery = mainQuery;
        
        if (mainQuery.includes('<')) {
            const scopeParts = mainQuery.split('<').map(p => p.trim());
            scopeQuery = scopeParts[0];
            hierarchyQuery = scopeParts.slice(1).join('<').trim();
        }

        // Parse do escopo (limitador de busca)
        let scopeFilters = null;
        if (scopeQuery) {
            const parsed = parseFilters(scopeQuery);
            if (parsed.error) return parsed;
            scopeFilters = parsed.filters;
        }

        // Parse da hierarquia (pode ter múltiplos níveis com >)
        const hierarchyLevels = hierarchyQuery.split('>').map(p => p.trim());
        const parsedHierarchy = [];
        let highlightIndex = -1; // Índice do elemento marcado com *

        hierarchyLevels.forEach((level, index) => {
            // Verifica se tem * (destaque)
            const hasHighlight = level.includes('*');
            if (hasHighlight) {
                highlightIndex = index;
                // Remove o * para fazer parse
                level = level.replace(/\*/g, '').trim();
            }

            const parsed = parseFilters(level);
            if (parsed.error) {
                parsedHierarchy.push({ error: parsed.error });
                return;
            }

            parsedHierarchy.push({
                filters: parsed.filters,
                highlight: hasHighlight,
                level: index
            });
        });

        // Verifica erros
        const errorLevel = parsedHierarchy.find(h => h.error);
        if (errorLevel) {
            return { error: errorLevel.error };
        }

        // Parse da ação
        let actionFilters = null;
        if (actionQuery) {
            const parsed = parseFilters(actionQuery);
            if (parsed.error) return parsed;
            actionFilters = parsed.filters;
        }

        // Fallback inteligente: se não tem *, destaca o penúltimo nível
        // (o último geralmente é texto ou conteúdo, o penúltimo é o container)
        if (highlightIndex === -1 && parsedHierarchy.length > 0) {
            // Se tem ação, destaca o elemento antes da ação
            // Se não tem ação, destaca o último elemento
            highlightIndex = parsedHierarchy.length - 1;
            parsedHierarchy[highlightIndex].highlight = true;
        }

        return {
            scope: scopeFilters,
            hierarchy: parsedHierarchy,
            highlightIndex: highlightIndex,
            action: actionFilters
        };
    }

    function parseFilters(queryPart) {
        const filters = [];
        const regex = /(tag|class|id|attr|text):([^\s:]+(?:=[^\s:]+)?)/gi;
        let match;
        let hasMatch = false;

        while ((match = regex.exec(queryPart)) !== null) {
            hasMatch = true;
            const type = match[1].toLowerCase();
            let fullValue = match[2];
            let key = fullValue;
            let value = null;

            if (fullValue.includes('=')) {
                const parts = fullValue.split('=');
                key = parts[0];
                value = parts.slice(1).join('=');
            }

            filters.push({ type, key, value });
        }

        if (!hasMatch) {
            return {
                error: 'Sintaxe: [tag:footer <] tag:div > *tag:span [& tag:button]'
            };
        }

        return { filters };
    }

    // ===================================
    // 🔍 BUSCA HTML COM OPERADORES REFATORADOS
    // ===================================
    function searchHTML(query) {
        clearHighlights();
        searchError.textContent = '';
        currentMatches = [];
        currentIndex = 0;

        if (!query || query.length === 0) {
            updateInfo(0, 0);
            return;
        }

        // Parse da query
        const parsed = parseAdvancedQuery(query);
        
        if (parsed.error) {
            searchError.textContent = `❌ ${parsed.error}`;
            updateInfo(0, 0);
            return;
        }

        // Define o escopo de busca
        let searchScope = [document.body];
        
        // Se tem escopo definido (<), limita a busca
        if (parsed.scope) {
            const allElements = document.querySelectorAll('*');
            searchScope = [];
            
            allElements.forEach(element => {
                if (element.closest('#dom-scout-container')) return;
                if (matchFilters(element, parsed.scope)) {
                    searchScope.push(element);
                }
            });

            if (searchScope.length === 0) {
                searchError.textContent = '⚠️ Nenhum elemento no escopo definido';
                updateInfo(0, 0);
                return;
            }
        }

        // Busca elementos que correspondem à hierarquia
        const matchedElements = [];

        searchScope.forEach(scope => {
            const candidates = findHierarchyMatches(scope, parsed);
            matchedElements.push(...candidates);
        });

        // Remove duplicatas
        currentMatches = matchedElements
            .filter((item, index, self) => 
                self.findIndex(t => t.element === item.element) === index
            )
            .map(item => ({ 
                element: item.element, 
                count: 1,
                actionElement: item.actionElement,
                isStarred: item.isStarred
            }))
            .sort((a, b) => {
                const pos = a.element.compareDocumentPosition(b.element);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

        // Aplica highlights
        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false, match.actionElement, match.isStarred);
            });
        }

        updateInfo(currentMatches.length, currentIndex + 1);

        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    /**
     * Encontra elementos que correspondem à hierarquia completa
     * REGRA: Só destaca elementos se TODA a hierarquia for válida
     * 
     * CORREÇÃO v4.0.1: Agora funciona corretamente com hierarquias sem *
     * 
     * Exemplo: tag:footer < tag:ul > tag:li > tag:a > text:yyy
     * 1. Encontra <ul> dentro do footer
     * 2. Para cada <ul>, encontra <li>
     * 3. Para cada <li>, encontra <a>
     * 4. Para cada <a>, valida text:yyy
     * 5. Se válido, destaca o último elemento (fallback) ou o marcado com *
     */
    function findHierarchyMatches(scope, parsed) {
        const results = [];
        const hierarchy = parsed.hierarchy;
        const highlightIndex = parsed.highlightIndex;

        if (hierarchy.length === 0) return results;

        // Função recursiva para percorrer a hierarquia
        function traverseHierarchy(currentElements, level, pathElements) {
            if (level >= hierarchy.length) {
                // Chegou ao final da hierarquia - encontrou um match completo
                const elementToHighlight = pathElements[highlightIndex];

                // ✅ CORREÇÃO: Verifica se existe elemento para destacar
                if (!elementToHighlight) return;

                // Busca ação dentro do elemento destacado
                let actionElement = null;
                if (parsed.action) {
                    const actionCandidates = elementToHighlight.querySelectorAll('*');
                    for (const actionCandidate of actionCandidates) {
                        if (matchFilters(actionCandidate, parsed.action)) {
                            actionElement = actionCandidate;
                            break;
                        }
                    }
                }

                results.push({
                    element: elementToHighlight,
                    actionElement: actionElement,
                    // ✅ CORREÇÃO: Usa informação real do highlight
                    isStarred: hierarchy[highlightIndex]?.highlight || false
                });
                return;
            }

            const levelData = hierarchy[level];
            const currentLevelFilters = levelData.filters;

            // Para cada elemento do nível anterior, busca matches no nível atual
            for (const currentElement of currentElements) {
                // Busca elementos que correspondem aos filtros deste nível
                const candidates = currentElement.querySelectorAll('*');

                for (const candidate of candidates) {
                    if (candidate.closest('#dom-scout-container')) continue;

                    // ✅ CORREÇÃO: Remove verificação complexa desnecessária
                    // Verifica se o candidato corresponde aos filtros deste nível
                    if (matchFilters(candidate, currentLevelFilters)) {
                        // Cria novo caminho com este candidato
                        const newPath = [...pathElements];
                        newPath[level] = candidate;

                        // Continua para o próximo nível
                        traverseHierarchy([candidate], level + 1, newPath);
                    }
                }
            }
        }

        // Inicia a travessia
        traverseHierarchy([scope], 0, []);

        return results;
    }

    function matchFilters(element, filters, checkDirectTextOnly = false) {
        for (const filter of filters) {
            const { type, key, value } = filter;

            switch (type) {
                case 'tag':
                    if (!matchTag(element, key)) return false;
                    break;
                
                case 'class':
                    if (!matchClass(element, key)) return false;
                    break;
                
                case 'id':
                    if (!matchId(element, key)) return false;
                    break;
                
                case 'attr':
                    if (!matchAttribute(element, key, value)) return false;
                    break;
                
                case 'text':
                    if (!matchText(element, key, checkDirectTextOnly)) return false;
                    break;
            }
        }
        return true;
    }

    function matchTag(element, tagName) {
        const elementTag = element.tagName.toLowerCase();
        const searchTag = prepareString(tagName);
        
        if (searchOptions.regex) {
            try {
                const regex = new RegExp(searchTag, searchOptions.caseSensitive ? '' : 'i');
                return regex.test(elementTag);
            } catch (e) {
                return false;
            }
        }
        
        return searchOptions.caseSensitive 
            ? elementTag === searchTag
            : elementTag === searchTag.toLowerCase();
    }

    function matchClass(element, className) {
        if (!element.className || typeof element.className !== 'string') return false;
        
        const classes = element.className.split(/\s+/).filter(c => c);
        const searchClass = prepareString(className);
        
        if (searchOptions.regex) {
            try {
                const regex = new RegExp(searchClass, searchOptions.caseSensitive ? '' : 'i');
                return classes.some(cls => regex.test(prepareString(cls)));
            } catch (e) {
                return false;
            }
        }
        
        return classes.some(cls => {
            const preparedCls = prepareString(cls);
            return searchOptions.caseSensitive
                ? preparedCls.includes(searchClass)
                : preparedCls.toLowerCase().includes(searchClass.toLowerCase());
        });
    }

    function matchId(element, idValue) {
        if (!element.id) return false;
        
        const elementId = prepareString(element.id);
        const searchId = prepareString(idValue);
        
        if (searchOptions.regex) {
            try {
                const regex = new RegExp(searchId, searchOptions.caseSensitive ? '' : 'i');
                return regex.test(elementId);
            } catch (e) {
                return false;
            }
        }
        
        return searchOptions.caseSensitive
            ? elementId.includes(searchId)
            : elementId.toLowerCase().includes(searchId.toLowerCase());
    }

    function matchAttribute(element, attrName, attrValue) {
        const attr = element.attributes[attrName];
        if (!attr) return false;
        
        if (attrValue === null) return true;
        
        const elementAttrValue = prepareString(attr.value);
        const searchValue = prepareString(attrValue);
        
        if (searchOptions.regex) {
            try {
                const regex = new RegExp(searchValue, searchOptions.caseSensitive ? '' : 'i');
                return regex.test(elementAttrValue);
            } catch (e) {
                return false;
            }
        }
        
        return searchOptions.caseSensitive
            ? elementAttrValue.includes(searchValue)
            : elementAttrValue.toLowerCase().includes(searchValue.toLowerCase());
    }

    function matchText(element, textValue, directOnly = false) {
        let text;
        
        if (directOnly) {
            text = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ');
        } else {
            text = element.textContent.trim();
        }
        
        const elementText = prepareString(text);
        const searchText = prepareString(textValue);
        
        if (!elementText) return false;
        
        if (searchOptions.regex) {
            try {
                const regex = new RegExp(searchText, searchOptions.caseSensitive ? '' : 'i');
                return regex.test(elementText);
            } catch (e) {
                return false;
            }
        }
        
        if (searchOptions.wholeWords) {
            const regex = new RegExp(`\\b${escapeRegex(searchText)}\\b`, searchOptions.caseSensitive ? '' : 'i');
            return regex.test(elementText);
        }
        
        return searchOptions.caseSensitive
            ? elementText.includes(searchText)
            : elementText.toLowerCase().includes(searchText.toLowerCase());
    }

    // ===================================
    // 🔍 BUSCA DE TEXTO
    // ===================================
    function searchText(term) {
        if (searchOptions.useTemplate && currentTemplate) {
            term = processTemplateQuery(term);
            if (currentTemplate.htmlMode) {
                searchHTML(term);
                return;
            }
        }

        if (searchOptions.htmlMode) {
            searchHTML(term);
            return;
        }

        clearHighlights();
        searchError.textContent = '';
        currentMatches = [];
        currentIndex = 0;

        if (!term || term.length === 0) {
            updateInfo(0, 0);
            return;
        }

        let searchTerm = term;
        if (!searchOptions.accentSensitive) {
            searchTerm = removeAccents(searchTerm);
        }

        const regex = createSearchRegex(searchTerm);
        if (!regex) {
            searchError.textContent = '❌ Expressão regular inválida';
            updateInfo(0, 0);
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement && node.parentElement.closest('#dom-scout-container')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const matchedElements = new Map();

        let node;
        while (node = walker.nextNode()) {
            let text = node.textContent;
            
            if (!searchOptions.accentSensitive) {
                text = removeAccents(text);
            }

            if (regex.test(text)) {
                let element = node.parentElement;
                
                if (matchedElements.has(element)) {
                    matchedElements.set(element, matchedElements.get(element) + 1);
                } else {
                    matchedElements.set(element, 1);
                }
            }
            
            regex.lastIndex = 0;
        }

        currentMatches = Array.from(matchedElements.entries())
            .map(([element, count]) => ({ element, count, actionElement: null, isStarred: false }))
            .sort((a, b) => {
                const pos = a.element.compareDocumentPosition(b.element);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false, null, false);
            });
        }

        updateInfo(currentMatches.length, currentIndex + 1);

        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    // ===================================
    // 🎨 HIGHLIGHT COM SUPORTE A *
    // ===================================
    function highlightElement(element, index, matchCount, isCurrent, actionElement, isStarred) {
        element.classList.add('dom-scout-highlight');
        
        if (isStarred) {
            element.classList.add('dom-scout-highlight-star');
        }
        
        if (isCurrent) {
            element.classList.add('dom-scout-highlight-current');
        }

        const badge = document.createElement('div');
        badge.className = 'dom-scout-badge';
        
        if (isStarred) {
            badge.classList.add('dom-scout-badge-star');
        }
        
        if (isCurrent) {
            badge.className += ' dom-scout-badge-current';
        }
        
        badge.textContent = matchCount > 1 ? `${index} (${matchCount}×)` : index;
        badge.setAttribute('data-dom-scout-badge', 'true');

        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(badge);

        if (actionElement && isCurrent) {
            const actionBadge = document.createElement('div');
            actionBadge.className = 'dom-scout-action-badge';
            actionBadge.textContent = '⚡ AÇÃO';
            actionBadge.setAttribute('data-dom-scout-action-badge', 'true');
            element.appendChild(actionBadge);
        }
    }

    // ===================================
    // 🧹 LIMPAR HIGHLIGHTS
    // ===================================
    function clearHighlights() {
        document.querySelectorAll('.dom-scout-highlight, .dom-scout-highlight-star').forEach(el => {
            el.classList.remove('dom-scout-highlight');
            el.classList.remove('dom-scout-highlight-current');
            el.classList.remove('dom-scout-highlight-star');
            
            const badges = el.querySelectorAll('[data-dom-scout-badge], [data-dom-scout-action-badge]');
            badges.forEach(badge => badge.remove());
        });

        highlightedElements = [];
    }

    // ===================================
    // 🎯 NAVEGAÇÃO
    // ===================================
    function goToMatch(index) {
        if (currentMatches.length === 0) return;

        if (currentMatches[currentIndex]) {
            const current = currentMatches[currentIndex].element;
            current.classList.remove('dom-scout-highlight-current');
            const badge = current.querySelector('[data-dom-scout-badge]');
            if (badge) {
                badge.classList.remove('dom-scout-badge-current');
            }
            const actionBadge = current.querySelector('[data-dom-scout-action-badge]');
            if (actionBadge) {
                actionBadge.remove();
            }
        }

        currentIndex = index;
        if (currentIndex < 0) currentIndex = currentMatches.length - 1;
        if (currentIndex >= currentMatches.length) currentIndex = 0;

        const match = currentMatches[currentIndex];
        const element = match.element;
        
        if (!searchOptions.highlightAll) {
            clearHighlights();
            highlightElement(element, currentIndex + 1, match.count, true, match.actionElement, match.isStarred);
        } else {
            element.classList.add('dom-scout-highlight-current');
            const badge = element.querySelector('[data-dom-scout-badge]');
            if (badge) {
                badge.classList.add('dom-scout-badge-current');
            }
            if (match.actionElement) {
                const actionBadge = document.createElement('div');
                actionBadge.className = 'dom-scout-action-badge';
                actionBadge.textContent = '⚡ AÇÃO';
                actionBadge.setAttribute('data-dom-scout-action-badge', 'true');
                element.appendChild(actionBadge);
            }
        }

        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
        });

        updateInfo(currentMatches.length, currentIndex + 1);
    }

    function nextMatch() {
        if (currentMatches.length === 0) return;
        goToMatch(currentIndex + 1);
    }

    function prevMatch() {
        if (currentMatches.length === 0) return;
        goToMatch(currentIndex - 1);
    }

    // ===================================
    // 🎬 EXECUTAR AÇÃO
    // ===================================
    function executeAction() {
        if (currentMatches.length === 0) return;

        const match = currentMatches[currentIndex];
        
        if (match.actionElement) {
            match.actionElement.click();
            showSuccess(`✓ Ação executada em ${match.actionElement.tagName.toLowerCase()}`);
        } else {
            const element = match.element;
            const clickables = element.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
            
            if (clickables.length > 0) {
                clickables[0].click();
                showSuccess(`✓ Clicado em ${clickables[0].tagName.toLowerCase()}`);
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                element.click();
                showSuccess(`✓ Clicado em ${element.tagName.toLowerCase()}`);
            } else {
                element.click();
                showSuccess(`✓ Clique executado`);
            }
        }
    }

    // ===================================
    // 📊 INFO
    // ===================================
    function updateInfo(total, current) {
        if (total === 0) {
            searchInfo.textContent = 'Nenhum resultado';
        } else {
            searchInfo.textContent = `${current} de ${total}`;
        }
    }

    // ===================================
    // 👁️ SHOW/HIDE
    // ===================================
    function showSearch() {
        searchContainer.style.display = 'block';
        searchInput.focus();
        searchInput.select();
        isVisible = true;
    }

    function hideSearch() {
        searchContainer.style.display = 'none';
        clearHighlights();
        isVisible = false;
    }

    function updatePlaceholder() {
        if (searchOptions.useTemplate && currentTemplate) {
            searchInput.placeholder = `Digite o valor para: ${currentTemplate.name}`;
        } else if (searchOptions.htmlMode) {
            searchInput.placeholder = '🔭 tag:footer < tag:div > *tag:span > text:valor & tag:button';
        } else {
            searchInput.placeholder = '🔭 Buscar texto na página...';
        }
    }

    // ===================================
    // ⌨️ EVENTOS
    // ===================================

    document.addEventListener('keydown', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            if (target.id !== 'dom-scout-input') {
                return;
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            if (!isVisible) {
                showSearch();
            } else {
                nextMatch();
            }
        }
        
        if (e.shiftKey && e.key === 'F' && isVisible) {
            e.preventDefault();
            prevMatch();
        }
        
        if (e.key === 'Escape' && isVisible) {
            hideSearch();
        }

        if (isVisible && !searchInput.contains(target)) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                executeAction();
            }
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            executeAction();
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchText(e.target.value);
        }, 300);
    });

    [optHtmlMode, optUseTemplate, optRegex, optWholeWords, optCaseSensitive, optAccentSensitive, optHighlightAll].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const optionName = e.target.id.replace('opt-', '').replace(/-./g, x => x[1].toUpperCase());
            searchOptions[optionName] = e.target.checked;
            
            if (optionName === 'htmlMode') {
                updatePlaceholder();
                
                if (e.target.checked) {
                    optWholeWords.disabled = true;
                    optWholeWords.parentElement.classList.add('disabled');
                    templatesSection.classList.add('active');
                } else {
                    optWholeWords.disabled = false;
                    optWholeWords.parentElement.classList.remove('disabled');
                    if (!searchOptions.useTemplate) {
                        templatesSection.classList.remove('active');
                    }
                }
            }
            
            if (optionName === 'useTemplate') {
                if (e.target.checked) {
                    templatesSection.classList.add('active');
                    updatePlaceholder();
                    if (!currentTemplate) {
                        showSuccess('💡 Selecione um template primeiro');
                    }
                } else {
                    currentTemplate = null;
                    updatePlaceholder();
                    templateInfo.innerHTML = '💡 Use <span class="dom-scout-template-placeholder">{text}</span> para placeholders | <span class="dom-scout-template-placeholder">*</span> para definir destaque';
                    if (!searchOptions.htmlMode) {
                        templatesSection.classList.remove('active');
                    }
                }
            }
            
            if (searchInput.value) {
                searchText(searchInput.value);
            }
        });
    });

    templateSaveBtn.addEventListener('click', saveCurrentTemplate);
    templateLoadBtn.addEventListener('click', loadSelectedTemplate);
    templateDeleteBtn.addEventListener('click', deleteSelectedTemplate);

    templateSelect.addEventListener('change', () => {
        if (searchOptions.useTemplate && templateSelect.value !== '') {
            loadSelectedTemplate();
        }
    });

    updateTemplateSelect();

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearHighlights();
        searchError.textContent = '';
        updateInfo(0, 0);
        searchInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        hideSearch();
    });

    // ===================================
    // ✅ CONFIRMAÇÃO
    // ===================================
    console.log('%c🔭 DOM Scout v4.0 instalado!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c🆕 NOVIDADE: Operadores Refatorados!', 'color: #4ecdc4; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n⭐ NOVO OPERADOR * (DESTAQUE EXPLÍCITO)', 'color: #ffd93d; font-weight: bold;');
    console.log('  Define EXATAMENTE qual elemento será destacado na hierarquia');
    console.log('%c\n  tag:footer > tag:ul > *tag:li & tag:a', 'color: #4ecdc4; font-size: 12px;');
    console.log('  ↳ Destaca os <li>, não o footer!');
    console.log('%c\n📍 OPERADORES ATUALIZADOS:', 'color: #feca57; font-weight: bold;');
    console.log('  <  → ESCOPO: Limita onde buscar (opcional, para performance)');
    console.log('  >  → HIERARQUIA: Define relação pai > filho > neto');
    console.log('  *  → DESTAQUE: Marca qual elemento destacar (NOVO!)');
    console.log('  &  → AÇÃO: Define o que clicar');
    console.log('%c\n💡 FALLBACK INTELIGENTE:', 'color: #ff6b6b; font-weight: bold;');
    console.log('  Se não usar *, o ÚLTIMO elemento da hierarquia é destacado');
    console.log('  (mais intuitivo que destacar o primeiro)');
    console.log('%c\n🎯 EXEMPLOS:', 'color: #4ecdc4; font-weight: bold;');
    console.log('%c\n  1. Destaque explícito com *', 'color: #fff; font-weight: bold;');
    console.log('     tag:footer > tag:ul > *tag:li');
    console.log('     ↳ Destaca cada <li>, não o <ul> ou <footer>');
    console.log('%c\n  2. Sem * (fallback)', 'color: #fff; font-weight: bold;');
    console.log('     tag:footer > tag:ul > tag:li');
    console.log('     ↳ Destaca <li> automaticamente (último da hierarquia)');
    console.log('%c\n  3. Escopo + Hierarquia + Destaque + Ação', 'color: #fff; font-weight: bold;');
    console.log('     tag:footer < tag:div > *tag:span > text:Login & tag:button');
    console.log('     ↳ No footer, busca div > span com "Login", destaca span, clica button');
    console.log('%c\n  4. Múltiplos níveis', 'color: #fff; font-weight: bold;');
    console.log('     tag:main > tag:section > tag:article > *tag:div > tag:p');
    console.log('     ↳ Hierarquia profunda, destaca apenas o <div>');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n⌨️  ATALHOS:', 'color: #ffd93d; font-weight: bold;');
    console.log('  Ctrl+F      → Abrir ou Próximo');
    console.log('  Shift+F     → Anterior');
    console.log('  Enter/Espaço → Clicar em ação');
    console.log('  ESC         → Fechar');
    console.log('%c\n🎉 Explore, Encontre, Conquiste o DOM!', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
})();

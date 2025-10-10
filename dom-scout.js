// ===================================
// 🔭 DOM SCOUT - Explorador Avançado de Elementos
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
        }

        #dom-scout-main {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
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

        /* Mensagem de sucesso (ação executada) */
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
        }

        #dom-scout-templates.active {
            display: block;
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
        .dom-scout-highlight-current {
            position: relative !important;
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
                        💡 Use <span class="dom-scout-template-placeholder">{text}</span> para criar placeholders dinâmicos
                    </div>
                </div>
                <div id="dom-scout-error"></div>
                <div style="color: rgba(255,255,255,0.8); font-size: 11px; margin-top: 8px;">
                    💡 Operadores: < (contexto) > (conteúdo) & (ação) | Ctrl+F: próximo | Shift+F: anterior | Enter/Espaço: clicar | ESC: fechar
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

    // Remove acentos de uma string
    function removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Escapa caracteres especiais para regex
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Cria regex de busca baseado nas opções
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

    // Cria regex de busca baseado nas opções
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

    // Mostra mensagem de sucesso temporária
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

    // Carrega templates do localStorage
    function loadTemplates() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Erro ao carregar templates:', e);
            return [];
        }
    }

    // Salva templates no localStorage
    function saveTemplates() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTemplates));
        } catch (e) {
            console.error('Erro ao salvar templates:', e);
            showSuccess('❌ Erro ao salvar template');
        }
    }

    // Atualiza o select de templates
    function updateTemplateSelect() {
        templateSelect.innerHTML = '<option value="">Selecione um template...</option>';
        
        savedTemplates.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = template.name;
            templateSelect.appendChild(option);
        });
    }

    // Salva template atual
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

    // Carrega template selecionado
    function loadSelectedTemplate() {
        const index = templateSelect.value;
        
        if (index === '') {
            showSuccess('❌ Selecione um template');
            return;
        }

        const template = savedTemplates[index];
        
        if (!template) return;

        currentTemplate = template;
        
        // Se não está em modo template, carrega a query diretamente
        if (!searchOptions.useTemplate) {
            searchInput.value = template.query;
            
            // Ativa modo HTML se o template foi criado nesse modo
            if (template.htmlMode && !searchOptions.htmlMode) {
                optHtmlMode.checked = true;
                searchOptions.htmlMode = true;
                updatePlaceholder();
                optWholeWords.disabled = true;
                optWholeWords.parentElement.classList.add('disabled');
            }
            
            showSuccess('✓ Template carregado!');
        } else {
            // Modo template: limpa input para usuário digitar
            searchInput.value = '';
            searchInput.placeholder = `Digite o valor para: ${template.name}`;
            showSuccess('✓ Template ativo! Digite o valor');
        }
    }

    // Exclui template selecionado
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

    // Processa query com template
    function processTemplateQuery(userInput) {
        if (!currentTemplate) {
            return userInput;
        }

        // Substitui {text} pelo input do usuário
        let processedQuery = currentTemplate.query.replace(/\{text\}/g, userInput);
        
        // Atualiza info do template
        templateInfo.innerHTML = `
            💡 Usando template: <span class="dom-scout-template-placeholder">${currentTemplate.name}</span>
            <br>Query: <span style="font-family: 'Courier New', monospace; font-size: 10px;">${processedQuery}</span>
        `;
        
        return processedQuery;
    }

    // ===================================
    // 🔍 FUNÇÃO DE BUSCA HTML AVANÇADA
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

        // Parse da query avançada
        const parsed = parseAdvancedQuery(query);
        
        if (parsed.error) {
            searchError.textContent = `❌ ${parsed.error}`;
            updateInfo(0, 0);
            return;
        }

        // Define o escopo de busca
        let searchScope = [document.body];
        
        // Se tem contexto, busca apenas dentro dos elementos de contexto
        if (parsed.context) {
            const allElements = document.querySelectorAll('*');
            searchScope = [];
            
            allElements.forEach(element => {
                if (element.closest('#dom-scout-container')) return;
                
                if (matchFilters(element, parsed.context)) {
                    searchScope.push(element);
                }
            });

            if (searchScope.length === 0) {
                searchError.textContent = '⚠️ Nenhum contexto encontrado';
                updateInfo(0, 0);
                return;
            }
        }

        // Busca elementos dentro do escopo
        const matchedElements = [];

        searchScope.forEach(scope => {
            const elementsInScope = scope.querySelectorAll('*');
            
            elementsInScope.forEach(element => {
                if (element.closest('#dom-scout-container')) return;
                
                const result = matchElement(element, parsed);
                if (result.matches) {
                    matchedElements.push({
                        element: element,
                        actionElement: result.actionElement
                    });
                }
            });
        });

        // Remove duplicatas e ordena
        currentMatches = matchedElements
            .filter((item, index, self) => 
                self.findIndex(t => t.element === item.element) === index
            )
            .map(item => ({ 
                element: item.element, 
                count: 1,
                actionElement: item.actionElement
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
                highlightElement(match.element, index + 1, match.count, false, match.actionElement);
            });
        }

        updateInfo(currentMatches.length, currentIndex + 1);

        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    // Parse avançado da query com suporte a contexto, hierarquia e ações
    function parseAdvancedQuery(query) {
        // Separa query principal e ação (usando &)
        const parts = query.split('&').map(p => p.trim());
        const mainQuery = parts[0];
        const actionQuery = parts[1] || null;

        // Verifica se tem contexto (usando <)
        let contextQuery = null;
        let targetQuery = mainQuery;
        
        if (mainQuery.includes('<')) {
            const contextParts = mainQuery.split('<').map(p => p.trim());
            contextQuery = contextParts[0];
            targetQuery = contextParts.slice(1).join('<').trim();
        }

        // Parse do contexto (escopo)
        let contextFilters = null;
        if (contextQuery) {
            const parsed = parseFilters(contextQuery);
            if (parsed.error) return parsed;
            contextFilters = parsed.filters;
        }

        // Parse da query alvo (pode ter hierarquia com >)
        const hierarchyParts = targetQuery.split('>').map(p => p.trim());
        
        const targetFilters = parseFilters(hierarchyParts[0]);
        if (targetFilters.error) return targetFilters;

        let childFilters = null;
        if (hierarchyParts.length > 1) {
            childFilters = parseFilters(hierarchyParts[1]);
            if (childFilters.error) return childFilters;
        }

        // Parse da ação (se existir)
        let actionFilters = null;
        if (actionQuery) {
            actionFilters = parseFilters(actionQuery);
            if (actionFilters.error) return actionFilters;
        }

        return {
            context: contextFilters,
            target: targetFilters.filters,
            child: childFilters ? childFilters.filters : null,
            action: actionFilters ? actionFilters.filters : null
        };
    }

    // Parse de filtros individuais
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
                error: 'Sintaxe: [tag:footer <] tag:div > text:Login [& tag:button]'
            };
        }

        return { filters };
    }

    // Verifica se elemento corresponde aos critérios
    function matchElement(element, parsed) {
        // Verifica critérios do elemento alvo (o que será destacado)
        if (!matchFilters(element, parsed.target)) {
            return { matches: false };
        }

        // Se tem critérios filhos, verifica se algum descendente corresponde
        if (parsed.child) {
            const descendants = element.querySelectorAll('*');
            let hasMatchingChild = false;

            // Também verifica o próprio elemento (texto direto)
            if (matchFilters(element, parsed.child, true)) {
                hasMatchingChild = true;
            }

            // Verifica descendentes
            if (!hasMatchingChild) {
                for (const descendant of descendants) {
                    if (matchFilters(descendant, parsed.child, true)) {
                        hasMatchingChild = true;
                        break;
                    }
                }
            }

            if (!hasMatchingChild) {
                return { matches: false };
            }
        }

        // Se tem ação, procura elemento clicável
        let actionElement = null;
        if (parsed.action) {
            const descendants = element.querySelectorAll('*');
            
            for (const descendant of descendants) {
                if (matchFilters(descendant, parsed.action)) {
                    actionElement = descendant;
                    break;
                }
            }
        }

        return { matches: true, actionElement };
    }

    // Verifica se elemento corresponde a um conjunto de filtros
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

    // Funções de match individuais
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
            // Apenas texto direto do elemento
            text = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ');
        } else {
            // Todo o texto do elemento (incluindo descendentes)
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
    // 🔍 FUNÇÃO DE BUSCA DE TEXTO
    // ===================================
    function searchText(term) {
        // Se modo template está ativo e tem template selecionado
        if (searchOptions.useTemplate && currentTemplate) {
            term = processTemplateQuery(term);
            
            // Força modo HTML se o template foi criado assim
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
            .map(([element, count]) => ({ element, count, actionElement: null }))
            .sort((a, b) => {
                const pos = a.element.compareDocumentPosition(b.element);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false, null);
            });
        }

        updateInfo(currentMatches.length, currentIndex + 1);

        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    // ===================================
    // 🎨 HIGHLIGHT DE ELEMENTOS
    // ===================================
    function highlightElement(element, index, matchCount, isCurrent, actionElement) {
        element.classList.add('dom-scout-highlight');
        if (isCurrent) {
            element.classList.add('dom-scout-highlight-current');
        }

        // Badge principal
        const badge = document.createElement('div');
        badge.className = 'dom-scout-badge';
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

        // Badge de ação (se houver elemento clicável)
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
        document.querySelectorAll('.dom-scout-highlight').forEach(el => {
            el.classList.remove('dom-scout-highlight');
            el.classList.remove('dom-scout-highlight-current');
            
            const badges = el.querySelectorAll('[data-dom-scout-badge], [data-dom-scout-action-badge]');
            badges.forEach(badge => badge.remove());
        });

        highlightedElements = [];
    }

    // ===================================
    // 🎯 NAVEGAÇÃO ENTRE RESULTADOS
    // ===================================
    function goToMatch(index) {
        if (currentMatches.length === 0) return;

        // Remove highlight do atual
        if (currentMatches[currentIndex]) {
            const current = currentMatches[currentIndex].element;
            current.classList.remove('dom-scout-highlight-current');
            const badge = current.querySelector('[data-dom-scout-badge]');
            if (badge) {
                badge.classList.remove('dom-scout-badge-current');
            }
            // Remove badge de ação
            const actionBadge = current.querySelector('[data-dom-scout-action-badge]');
            if (actionBadge) {
                actionBadge.remove();
            }
        }

        // Atualiza índice
        currentIndex = index;
        if (currentIndex < 0) currentIndex = currentMatches.length - 1;
        if (currentIndex >= currentMatches.length) currentIndex = 0;

        // Adiciona highlight no novo
        const match = currentMatches[currentIndex];
        const element = match.element;
        
        if (!searchOptions.highlightAll) {
            clearHighlights();
            highlightElement(element, currentIndex + 1, match.count, true, match.actionElement);
        } else {
            element.classList.add('dom-scout-highlight-current');
            const badge = element.querySelector('[data-dom-scout-badge]');
            if (badge) {
                badge.classList.add('dom-scout-badge-current');
            }
            // Adiciona badge de ação se houver
            if (match.actionElement) {
                const actionBadge = document.createElement('div');
                actionBadge.className = 'dom-scout-action-badge';
                actionBadge.textContent = '⚡ AÇÃO';
                actionBadge.setAttribute('data-dom-scout-action-badge', 'true');
                element.appendChild(actionBadge);
            }
        }

        // Scroll suave
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
        });

        // Atualiza info
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
    // 🎬 EXECUTAR AÇÃO (CLICAR)
    // ===================================
    function executeAction() {
        if (currentMatches.length === 0) return;

        const match = currentMatches[currentIndex];
        
        if (match.actionElement) {
            // Tem elemento de ação específico
            match.actionElement.click();
            showSuccess(`✓ Ação executada em ${match.actionElement.tagName.toLowerCase()}`);
        } else {
            // Tenta clicar no próprio elemento ou encontrar botão/link dentro dele
            const element = match.element;
            
            // Procura por elementos clicáveis dentro do elemento
            const clickables = element.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
            
            if (clickables.length > 0) {
                // Clica no primeiro encontrado
                clickables[0].click();
                showSuccess(`✓ Clicado em ${clickables[0].tagName.toLowerCase()}`);
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                // O próprio elemento é clicável
                element.click();
                showSuccess(`✓ Clicado em ${element.tagName.toLowerCase()}`);
            } else {
                // Tenta clicar no elemento mesmo assim
                element.click();
                showSuccess(`✓ Clique executado`);
            }
        }
    }

    // ===================================
    // 📊 ATUALIZAR INFORMAÇÕES
    // ===================================
    function updateInfo(total, current) {
        if (total === 0) {
            searchInfo.textContent = 'Nenhum resultado';
        } else {
            searchInfo.textContent = `${current} de ${total}`;
        }
    }

    // ===================================
    // 👁️ MOSTRAR/OCULTAR BUSCA
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

    // Atualiza o placeholder do input
    function updatePlaceholder() {
        if (searchOptions.useTemplate && currentTemplate) {
            searchInput.placeholder = `Digite o valor para: ${currentTemplate.name}`;
        } else if (searchOptions.htmlMode) {
            searchInput.placeholder = '🔭 tag:footer < tag:div attr:data-id > text:valor & tag:button';
        } else {
            searchInput.placeholder = '🔭 Buscar texto na página...';
        }
    }

    // ===================================
    // ⌨️ EVENTOS
    // ===================================

    // Ctrl+F para abrir/navegar, Shift+F para anterior
    document.addEventListener('keydown', (e) => {
        // Ignora se está em um input/textarea (exceto o nosso)
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            if (target.id !== 'dom-scout-input') {
                return;
            }
        }

        // Ctrl+F - Abre ou navega para próximo
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            
            if (!isVisible) {
                showSearch();
            } else {
                nextMatch();
            }
        }
        
        // Shift+F - Navega para anterior
        if (e.shiftKey && e.key === 'F' && isVisible) {
            e.preventDefault();
            prevMatch();
        }
        
        // ESC para fechar
        if (e.key === 'Escape' && isVisible) {
            hideSearch();
        }

        // Enter ou Espaço para executar ação (apenas quando DOM Scout está visível)
        if (isVisible && !searchInput.contains(target)) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                executeAction();
            }
        }
    });

    // Enter/Espaço dentro do input também executa ação
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            executeAction();
        }
    });

    // Busca em tempo real
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchText(e.target.value);
        }, 300);
    });

    // Opções - atualiza busca quando mudar
    [optHtmlMode, optUseTemplate, optRegex, optWholeWords, optCaseSensitive, optAccentSensitive, optHighlightAll].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const optionName = e.target.id.replace('opt-', '').replace(/-./g, x => x[1].toUpperCase());
            searchOptions[optionName] = e.target.checked;
            
            // Atualiza placeholder quando mudar o modo
            if (optionName === 'htmlMode') {
                updatePlaceholder();
                
                // Desabilita "Palavras Inteiras" em modo HTML
                if (e.target.checked) {
                    optWholeWords.disabled = true;
                    optWholeWords.parentElement.classList.add('disabled');
                    // Mostra seção de templates
                    templatesSection.classList.add('active');
                } else {
                    optWholeWords.disabled = false;
                    optWholeWords.parentElement.classList.remove('disabled');
                    // Esconde seção de templates se não estiver usando
                    if (!searchOptions.useTemplate) {
                        templatesSection.classList.remove('active');
                    }
                }
            }
            
            // Modo template
            if (optionName === 'useTemplate') {
                if (e.target.checked) {
                    templatesSection.classList.add('active');
                    updatePlaceholder();
                    
                    // Se não tem template selecionado, pede para selecionar
                    if (!currentTemplate) {
                        showSuccess('💡 Selecione um template primeiro');
                    }
                } else {
                    // Desativa modo template
                    currentTemplate = null;
                    updatePlaceholder();
                    templateInfo.innerHTML = '💡 Use <span class="dom-scout-template-placeholder">{text}</span> para criar placeholders dinâmicos';
                    
                    // Esconde seção se não estiver em modo HTML
                    if (!searchOptions.htmlMode) {
                        templatesSection.classList.remove('active');
                    }
                }
            }
            
            // Re-busca
            if (searchInput.value) {
                searchText(searchInput.value);
            }
        });
    });

    // Eventos dos botões de template
    templateSaveBtn.addEventListener('click', saveCurrentTemplate);
    templateLoadBtn.addEventListener('click', loadSelectedTemplate);
    templateDeleteBtn.addEventListener('click', deleteSelectedTemplate);

    // Quando seleciona um template no select
    templateSelect.addEventListener('change', () => {
        if (searchOptions.useTemplate && templateSelect.value !== '') {
            loadSelectedTemplate();
        }
    });

    // Inicializa lista de templates
    updateTemplateSelect();

    // Botões
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
    console.log('%c🔭 DOM Scout instalado com sucesso!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c⌨️  ATALHOS DE TECLADO', 'color: #ffd93d; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c  Ctrl+F      ', 'color: #4ecdc4; font-weight: bold;', '→ Abrir ou Próximo resultado');
    console.log('%c  Shift+F     ', 'color: #4ecdc4; font-weight: bold;', '→ Resultado anterior');
    console.log('%c  Enter/Espaço', 'color: #4ecdc4; font-weight: bold;', '→ Clicar em ação (botão/link)');
    console.log('%c  ESC         ', 'color: #4ecdc4; font-weight: bold;', '→ Fechar DOM Scout');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n📋 MODOS DE BUSCA:', 'color: #333; font-weight: bold;');
    console.log('%c  1️⃣ MODO TEXTO (padrão)', 'color: #667eea; font-weight: bold;');
    console.log('     Busca texto puro na página');
    console.log('%c  2️⃣ MODO HTML 🏷️', 'color: #ff6b6b; font-weight: bold;');
    console.log('     Busca elementos com contexto, hierarquia e ações!');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n🎯 SINTAXE COMPLETA (Modo HTML):', 'color: #ff6b6b; font-weight: bold;');
    console.log('%c\n[CONTEXTO] < [DESTAQUE] > [CONTEÚDO] & [AÇÃO]', 'color: #ffd93d; font-weight: bold; font-size: 13px;');
    console.log('%c\n📍 OPERADORES:', 'color: #feca57; font-weight: bold;');
    console.log('  <  → Define CONTEXTO (escopo onde buscar)');
    console.log('  >  → Define CONTEÚDO (o que deve existir dentro)');
    console.log('  &  → Define AÇÃO (o que clicar)');
    console.log('%c\n📍 BUSCA SIMPLES:', 'color: #feca57; font-weight: bold;');
    console.log('  tag:div                    → Busca <div>');
    console.log('  class:btn                  → Busca classe "btn"');
    console.log('  id:header                  → Busca ID "header"');
    console.log('%c\n📍 COM CONTEXTO (< define onde buscar):', 'color: #feca57; font-weight: bold;');
    console.log('  tag:footer < tag:div');
    console.log('  ↳ Busca <div> APENAS dentro de <footer>');
    console.log('\n  class:sidebar < class:item');
    console.log('  ↳ Busca elementos com classe "item" APENAS na sidebar');
    console.log('\n  id:main < tag:button');
    console.log('  ↳ Busca botões APENAS dentro do elemento #main');
    console.log('%c\n📍 COM HIERARQUIA (> define o que está dentro):', 'color: #feca57; font-weight: bold;');
    console.log('  tag:div > text:Login');
    console.log('  ↳ Busca <div> que CONTÉM o texto "Login"');
    console.log('\n  class:card > tag:button');
    console.log('  ↳ Busca elementos .card que CONTÊM botões');
    console.log('%c\n📍 COM AÇÃO (& define o que clicar):', 'color: #feca57; font-weight: bold;');
    console.log('  tag:div > text:08-09 & tag:button class:accept');
    console.log('  ↳ Busca div com "08-09" e CLICA no botão .accept');
    console.log('%c\n📍 COMBINAÇÃO COMPLETA:', 'color: #4ecdc4; font-weight: bold;');
    console.log('%c\n  tag:footer < tag:div attr:ocurrence-item > text:08-09 & tag:button class:ocurrence-aceitar', 'color: #4ecdc4; font-size: 12px;');
    console.log('%c\n  Explicação:', 'color: #fff; font-weight: bold;');
    console.log('  1. tag:footer <              → CONTEXTO: Buscar apenas no footer');
    console.log('  2. tag:div attr:ocurrence-item → DESTAQUE: Divs com atributo ocurrence-item');
    console.log('  3. > text:08-09               → CONTEÚDO: Que contenham "08-09"');
    console.log('  4. & tag:button class:...     → AÇÃO: Clicar no botão ao pressionar Enter');
    console.log('%c\n📍 MAIS EXEMPLOS:', 'color: #4ecdc4; font-weight: bold;');
    console.log('\n  tag:main < class:notification > text:Nova & tag:a class:ver');
    console.log('  ↳ Notificações "Nova" no <main>, clica no link .ver');
    console.log('\n  id:dashboard < class:task > text:Pendente & tag:button attr:data-action=complete');
    console.log('  ↳ Tarefas pendentes no dashboard, clica em completar');
    console.log('\n  class:container < tag:tr > text:Aguardando & tag:button class:aprovar');
    console.log('  ↳ Linhas aguardando no container, clica em aprovar');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n⚡ COMO USAR:', 'color: #4ecdc4; font-weight: bold;');
    console.log('  1. Ctrl+F para abrir DOM Scout');
    console.log('  2. Marque "🏷️ Buscar Elementos HTML"');
    console.log('  3. Digite sua query com < > &');
    console.log('  4. Navegue com Ctrl+F (próximo) ou Shift+F (anterior)');
    console.log('  5. Badge "⚡ AÇÃO" aparece quando há elemento clicável');
    console.log('  6. Enter/Espaço para clicar automaticamente!');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n💡 POR QUE USAR < (CONTEXTO)?', 'color: #ff6b6b; font-weight: bold;');
    console.log('  • Filtra resultados por área específica da página');
    console.log('  • Evita encontrar elementos fora do escopo desejado');
    console.log('  • Torna a busca mais rápida e precisa');
    console.log('  • Útil em páginas complexas com muitos elementos');
    console.log('%c\n🎉 Explore, Encontre, Conquiste o DOM!', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
})();

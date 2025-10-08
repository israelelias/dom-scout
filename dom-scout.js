// ===================================
// 🔍 BUSCA AVANÇADA DE TEXTO NO DOM
// ===================================
// Para usar: Cole este código no Console (F12) e pressione Enter
// Atalho: Ctrl+Shift+F para abrir/fechar

(function() {
    'use strict';
    
    // Previne múltiplas execuções
    if (window.textSearchToolInstalled) {
        console.log('🔍 Busca de Texto já instalada. Pressione Ctrl+Shift+F para usar.');
        return;
    }
    window.textSearchToolInstalled = true;

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
        htmlMode: false  // Nova opção: buscar por elementos HTML
    };

    // ===================================
    // 🎨 ESTILOS
    // ===================================
    const styles = `
        #text-search-container {
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

        #text-search-wrapper {
            max-width: 1000px;
            margin: 0 auto;
        }

        #text-search-main {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
        }

        #text-search-input {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }

        #text-search-input:focus {
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform: scale(1.01);
        }

        #text-search-info {
            color: white;
            font-size: 14px;
            min-width: 100px;
            text-align: center;
            font-weight: 500;
            padding: 8px 16px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
        }

        .text-search-btn {
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

        .text-search-btn:hover {
            background: rgba(255,255,255,0.35);
            transform: translateY(-2px);
        }

        .text-search-btn:active {
            transform: translateY(0);
        }

        .text-search-nav-btn {
            background: rgba(255,255,255,0.25);
            padding: 10px 14px;
            min-width: 40px;
            font-weight: 600;
        }

        #text-search-options {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .text-search-option {
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

        .text-search-option:hover {
            background: rgba(255,255,255,0.1);
        }

        .text-search-option input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }

        /* Highlight nos elementos */
        .text-search-highlight {
            outline: 3px solid #ff6b6b !important;
            outline-offset: 2px;
            background-color: rgba(255, 107, 107, 0.15) !important;
            position: relative !important;
            z-index: 999999 !important;
            animation: highlightPulse 1.5s ease-in-out infinite;
        }

        .text-search-highlight-current {
            outline: 4px solid #ffd93d !important;
            outline-offset: 2px;
            background-color: rgba(255, 217, 61, 0.25) !important;
            animation: highlightPulseCurrent 1s ease-in-out infinite;
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
                transform: scale(1.02);
            }
        }

        /* Badge de contagem */
        .text-search-badge {
            position: absolute;
            top: -12px;
            right: -12px;
            background: #ff6b6b;
            color: white;
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: bold;
            z-index: 1000000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            pointer-events: none;
        }

        .text-search-badge-current {
            background: #ffd93d;
            color: #333;
            font-size: 12px;
            padding: 5px 10px;
        }

        /* Mensagem de erro */
        .text-search-error {
            color: #ffcccc;
            font-size: 12px;
            margin-top: 5px;
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
        container.id = 'text-search-container';
        container.style.display = 'none';
        
        container.innerHTML = `
            <div id="text-search-wrapper">
                <div id="text-search-main">
                    <input 
                        type="text" 
                        id="text-search-input" 
                        placeholder="Buscar texto na página..." 
                        autocomplete="off"
                        spellcheck="false"
                    />
                    <button class="text-search-btn text-search-nav-btn" id="text-search-prev" title="Anterior (Shift+Enter)">◀</button>
                    <button class="text-search-btn text-search-nav-btn" id="text-search-next" title="Próximo (Enter)">▶</button>
                    <span id="text-search-info">0 resultados</span>
                    <button class="text-search-btn" id="text-search-clear">Limpar</button>
                    <button class="text-search-btn" id="text-search-close">Fechar</button>
                </div>
                <div id="text-search-options">
                    <label class="text-search-option" title="Buscar por elementos HTML (tag, class, id, atributo)">
                        <input type="checkbox" id="opt-html-mode">
                        <span>🏷️ Buscar Elementos HTML</span>
                    </label>
                    <label class="text-search-option" title="Usar expressões regulares">
                        <input type="checkbox" id="opt-regex">
                        <span>Regex</span>
                    </label>
                    <label class="text-search-option" title="Buscar apenas palavras completas">
                        <input type="checkbox" id="opt-whole-words">
                        <span>Palavras Inteiras</span>
                    </label>
                    <label class="text-search-option" title="Diferenciar maiúsculas e minúsculas">
                        <input type="checkbox" id="opt-case-sensitive">
                        <span>Aa (Case Sensitive)</span>
                    </label>
                    <label class="text-search-option" title="Considerar acentos (á ≠ a)">
                        <input type="checkbox" id="opt-accent-sensitive">
                        <span>À (Com Acentos)</span>
                    </label>
                    <label class="text-search-option" title="Destacar todos os resultados">
                        <input type="checkbox" id="opt-highlight-all" checked>
                        <span>Destacar Todas</span>
                    </label>
                </div>
                <div id="text-search-error"></div>
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    }

    const searchContainer = createSearchUI();
    const searchInput = document.getElementById('text-search-input');
    const searchInfo = document.getElementById('text-search-info');
    const searchError = document.getElementById('text-search-error');
    const clearBtn = document.getElementById('text-search-clear');
    const closeBtn = document.getElementById('text-search-close');
    const prevBtn = document.getElementById('text-search-prev');
    const nextBtn = document.getElementById('text-search-next');

    // Checkboxes de opções
    const optHtmlMode = document.getElementById('opt-html-mode');
    const optRegex = document.getElementById('opt-regex');
    const optWholeWords = document.getElementById('opt-whole-words');
    const optCaseSensitive = document.getElementById('opt-case-sensitive');
    const optAccentSensitive = document.getElementById('opt-accent-sensitive');
    const optHighlightAll = document.getElementById('opt-highlight-all');

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

            // Se não for regex, escapa caracteres especiais
            if (!searchOptions.regex) {
                pattern = escapeRegex(term);
            }

            // Palavras inteiras
            if (searchOptions.wholeWords && !searchOptions.regex) {
                pattern = `\\b${pattern}\\b`;
            }

            // Flags
            let flags = 'g';
            if (!searchOptions.caseSensitive) {
                flags += 'i';
            }

            return new RegExp(pattern, flags);
        } catch (e) {
            return null;
        }
    }

    // ===================================
    // 🔍 FUNÇÃO DE BUSCA HTML
    // ===================================
    function searchHTML(query) {
        // Limpa highlights anteriores
        clearHighlights();
        searchError.textContent = '';
        currentMatches = [];
        currentIndex = 0;

        if (!query || query.length === 0) {
            updateInfo(0, 0);
            return;
        }

        // Parse da query
        const criteria = parseHTMLQuery(query);
        
        if (criteria.error) {
            searchError.textContent = `❌ ${criteria.error}`;
            updateInfo(0, 0);
            return;
        }

        // Busca elementos que correspondem aos critérios
        const allElements = document.querySelectorAll('*');
        const matchedElements = [];

        allElements.forEach(element => {
            // Ignora o container de busca
            if (element.closest('#text-search-container')) return;
            
            let matches = true;

            // Verifica cada critério
            for (const criterion of criteria.filters) {
                const { type, key, value } = criterion;

                switch (type) {
                    case 'tag':
                        if (!matchTag(element, key)) {
                            matches = false;
                        }
                        break;
                    
                    case 'class':
                        if (!matchClass(element, key)) {
                            matches = false;
                        }
                        break;
                    
                    case 'id':
                        if (!matchId(element, key)) {
                            matches = false;
                        }
                        break;
                    
                    case 'attr':
                        if (!matchAttribute(element, key, value)) {
                            matches = false;
                        }
                        break;
                    
                    case 'text':
                        if (!matchText(element, key)) {
                            matches = false;
                        }
                        break;
                }

                if (!matches) break;
            }

            if (matches) {
                matchedElements.push(element);
            }
        });

        // Remove duplicatas e ordena
        currentMatches = matchedElements
            .filter((el, index, self) => self.indexOf(el) === index)
            .map(element => ({ element, count: 1 }))
            .sort((a, b) => {
                const pos = a.element.compareDocumentPosition(b.element);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

        // Aplica highlights
        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false);
            });
        }

        // Atualiza info
        updateInfo(currentMatches.length, currentIndex + 1);

        // Vai para o primeiro resultado
        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    // Parse da query HTML
    function parseHTMLQuery(query) {
        const filters = [];
        
        // Regex para capturar: type:value ou type:key=value
        const regex = /(tag|class|id|attr|text):([^\s:]+(?:=[^\s:]+)?)/gi;
        let match;
        let hasMatch = false;

        while ((match = regex.exec(query)) !== null) {
            hasMatch = true;
            const type = match[1].toLowerCase();
            let fullValue = match[2];
            let key = fullValue;
            let value = null;

            // Se tem '=', separa key e value (para atributos)
            if (fullValue.includes('=')) {
                const parts = fullValue.split('=');
                key = parts[0];
                value = parts.slice(1).join('='); // Permite '=' no valor
            }

            filters.push({ type, key, value });
        }

        if (!hasMatch) {
            return {
                error: 'Use a sintaxe: tag:div, class:btn, id:header, attr:data-id, attr:data-id=123, text:Login'
            };
        }

        return { filters };
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
        
        // Se não tem valor específico, só verifica se o atributo existe
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

    function matchText(element, textValue) {
        // Pega apenas texto direto do elemento (não dos filhos)
        const directText = Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join(' ');
        
        const elementText = prepareString(directText);
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

    function prepareString(str) {
        if (!searchOptions.accentSensitive) {
            return removeAccents(str);
        }
        return str;
    }

    // ===================================
    // 🔍 FUNÇÃO DE BUSCA
    // ===================================
    function searchText(term) {
        // Se modo HTML está ativo, usa searchHTML
        if (searchOptions.htmlMode) {
            searchHTML(term);
            return;
        }

        // Limpa highlights anteriores
        clearHighlights();
        searchError.textContent = '';
        currentMatches = [];
        currentIndex = 0;

        if (!term || term.length === 0) {
            updateInfo(0, 0);
            return;
        }

        // Prepara o termo de busca
        let searchTerm = term;
        if (!searchOptions.accentSensitive) {
            searchTerm = removeAccents(searchTerm);
        }

        // Cria regex
        const regex = createSearchRegex(searchTerm);
        if (!regex) {
            searchError.textContent = '❌ Expressão regular inválida';
            updateInfo(0, 0);
            return;
        }

        // Busca em todos os nós de texto
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Ignora o container de busca
                    if (node.parentElement && node.parentElement.closest('#text-search-container')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Ignora scripts e styles
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Ignora nós vazios
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const matchedElements = new Map();

        // Percorre todos os nós de texto
        let node;
        while (node = walker.nextNode()) {
            let text = node.textContent;
            
            // Remove acentos se necessário
            if (!searchOptions.accentSensitive) {
                text = removeAccents(text);
            }

            // Testa se há match
            if (regex.test(text)) {
                // Pega o elemento pai do texto
                let element = node.parentElement;
                
                // Se o elemento já foi adicionado, incrementa contador
                if (matchedElements.has(element)) {
                    matchedElements.set(element, matchedElements.get(element) + 1);
                } else {
                    matchedElements.set(element, 1);
                }
            }
            
            // Reseta regex para próxima iteração
            regex.lastIndex = 0;
        }

        // Converte Map para Array e ordena por posição no DOM
        currentMatches = Array.from(matchedElements.entries())
            .map(([element, count]) => ({ element, count }))
            .sort((a, b) => {
                const pos = a.element.compareDocumentPosition(b.element);
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

        // Aplica highlights
        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false);
            });
        }

        // Atualiza info
        updateInfo(currentMatches.length, currentIndex + 1);

        // Vai para o primeiro resultado
        if (currentMatches.length > 0) {
            goToMatch(0);
        }
    }

    // ===================================
    // 🎨 HIGHLIGHT DE ELEMENTOS
    // ===================================
    function highlightElement(element, index, matchCount, isCurrent) {
        // Adiciona classe de highlight
        element.classList.add('text-search-highlight');
        if (isCurrent) {
            element.classList.add('text-search-highlight-current');
        }

        // Cria badge
        const badge = document.createElement('div');
        badge.className = 'text-search-badge';
        if (isCurrent) {
            badge.className += ' text-search-badge-current';
        }
        badge.textContent = matchCount > 1 ? `${index} (${matchCount}×)` : index;
        badge.setAttribute('data-text-search-badge', 'true');

        // Garante position relative
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(badge);
    }

    // ===================================
    // 🧹 LIMPAR HIGHLIGHTS
    // ===================================
    function clearHighlights() {
        // Remove classes e badges
        document.querySelectorAll('.text-search-highlight').forEach(el => {
            el.classList.remove('text-search-highlight');
            el.classList.remove('text-search-highlight-current');
            
            const badges = el.querySelectorAll('[data-text-search-badge]');
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
            current.classList.remove('text-search-highlight-current');
            const badge = current.querySelector('[data-text-search-badge]');
            if (badge) {
                badge.classList.remove('text-search-badge-current');
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
            highlightElement(element, currentIndex + 1, match.count, true);
        } else {
            element.classList.add('text-search-highlight-current');
            const badge = element.querySelector('[data-text-search-badge]');
            if (badge) {
                badge.classList.add('text-search-badge-current');
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

    // ===================================
    // ⌨️ EVENTOS
    // ===================================

    // Ctrl+Shift+F para abrir/fechar
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+F (ou Cmd+Shift+F no Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            if (isVisible) {
                hideSearch();
            } else {
                showSearch();
            }
        }
        
        // ESC para fechar
        if (e.key === 'Escape' && isVisible) {
            hideSearch();
        }
    });

    // Enter para navegar (dentro do input)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                prevMatch();
            } else {
                nextMatch();
            }
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
    [optHtmlMode, optRegex, optWholeWords, optCaseSensitive, optAccentSensitive, optHighlightAll].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const optionName = e.target.id.replace('opt-', '').replace(/-./g, x => x[1].toUpperCase());
            searchOptions[optionName] = e.target.checked;
            
            // Atualiza placeholder quando mudar o modo
            if (optionName === 'htmlMode') {
                updatePlaceholder();
                
                // Desabilita "Palavras Inteiras" em modo HTML (não faz sentido)
                if (e.target.checked) {
                    optWholeWords.disabled = true;
                    optWholeWords.parentElement.style.opacity = '0.5';
                    optWholeWords.parentElement.style.cursor = 'not-allowed';
                } else {
                    optWholeWords.disabled = false;
                    optWholeWords.parentElement.style.opacity = '1';
                    optWholeWords.parentElement.style.cursor = 'pointer';
                }
            }
            
            // Re-busca
            if (searchInput.value) {
                searchText(searchInput.value);
            }
        });
    });

    // Atualiza o placeholder do input
    function updatePlaceholder() {
        if (searchOptions.htmlMode) {
            searchInput.placeholder = '🏷️ tag:div class:btn id:header attr:data-id attr:name=value text:Login';
        } else {
            searchInput.placeholder = 'Buscar texto na página...';
        }
    }

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

    nextBtn.addEventListener('click', () => {
        nextMatch();
    });

    prevBtn.addEventListener('click', () => {
        prevMatch();
    });

    // ===================================
    // ✅ CONFIRMAÇÃO
    // ===================================
    console.log('%c🔍 Busca de Texto instalada com sucesso!', 'color: #667eea; font-size: 18px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c⌨️  Pressione Ctrl+Shift+F para abrir', 'color: #764ba2; font-size: 14px; font-weight: bold;');
    console.log('%c⌨️  Pressione ESC para fechar', 'color: #764ba2; font-size: 14px;');
    console.log('%c⌨️  Enter/Shift+Enter para navegar', 'color: #764ba2; font-size: 14px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #764ba2;');
    console.log('%c\n📋 Modos de busca:', 'color: #333; font-weight: bold;');
    console.log('%c  1️⃣ MODO TEXTO (padrão)', 'color: #667eea; font-weight: bold;');
    console.log('     Busca texto puro na página');
    console.log('%c  2️⃣ MODO HTML 🏷️', 'color: #ff6b6b; font-weight: bold;');
    console.log('     Busca elementos por: tag, class, id, atributo, texto');
    console.log('%c\n🏷️ Sintaxe do Modo HTML:', 'color: #ff6b6b; font-weight: bold;');
    console.log('  • tag:div          → Busca tags <div>');
    console.log('  • class:btn        → Busca classes "btn"');
    console.log('  • id:header        → Busca ID "header"');
    console.log('  • attr:data-id     → Busca atributo (nome)');
    console.log('  • attr:data-id=123 → Busca atributo com valor');
    console.log('  • text:Login       → Busca texto dentro do elemento');
    console.log('%c\n🎯 Buscas Combinadas:', 'color: #feca57; font-weight: bold;');
    console.log('  • tag:button class:btn');
    console.log('  • tag:input attr:type=text');
    console.log('  • tag:a class:link text:Clique');
    console.log('  • class:active id:menu');
    console.log('%c\n⚙️ Opções disponíveis:', 'color: #333; font-weight: bold;');
    console.log('  ✓ 🏷️ Buscar Elementos HTML - Ativa modo de busca HTML');
    console.log('  ✓ Regex - Use expressões regulares');
    console.log('  ✓ Palavras Inteiras - Busca apenas palavras completas (só texto)');
    console.log('  ✓ Case Sensitive - Diferencia maiúsculas/minúsculas');
    console.log('  ✓ Com Acentos - Considera acentuação (á ≠ a)');
    console.log('  ✓ Destacar Todas - Destaca todos os resultados');
    console.log('%c\n💡 Dica: Os elementos que contêm o texto são destacados!', 'color: #ff6b6b; font-weight: bold;');
    
})();
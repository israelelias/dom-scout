// =================================== 
// 🔭 DOM SCOUT v4.2.3
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
    let isTemplatesPanelVisible = false;
    let isAutomaticToggle = false;

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
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            padding: 8px 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            animation: slideDown 0.3s ease-out;
            min-height: 40px;
            height: auto;
            max-height: max-content;
            overflow: visible;
            font-size: 12px;
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
            width: 100%;
        }

        #dom-scout-main {
            display: flex;
            gap: 6px;
            align-items: center;
            margin-bottom: 6px;
            flex-wrap: wrap;
        }

        #dom-scout-input {
            flex: 1;
            padding: 6px 12px;
            border: none;
            border-radius: 16px;
            font-size: 12px;
            outline: none;
            box-shadow: 0 1px 6px rgba(0,0,0,0.2);
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            min-width: 120px;
            height: 28px;
            line-height: 16px;
        }

        #dom-scout-input:focus {
            box-shadow: 0 2px 12px rgba(0,0,0,0.3);
            transform: scale(1.02);
        }

        #dom-scout-input:disabled {
            background: rgba(255,255,255,0.5);
            cursor: not-allowed;
        }

        #dom-scout-info {
            color: white;
            font-size: 11px;
            min-width: 80px;
            text-align: center;
            font-weight: 500;
            padding: 4px 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            height: 20px;
            line-height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dom-scout-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.3s;
            font-weight: 500;
            white-space: nowrap;
            height: 24px;
            line-height: 16px;
        }

        .dom-scout-btn:hover {
            background: rgba(255,255,255,0.35);
            transform: translateY(-1px);
        }

        .dom-scout-btn:active {
            transform: translateY(0);
        }

        #dom-scout-options {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }

        .dom-scout-option {
            display: flex;
            align-items: center;
            gap: 4px;
            color: white;
            font-size: 10px;
            cursor: pointer;
            user-select: none;
            padding: 2px 6px;
            border-radius: 8px;
            transition: background 0.2s;
            height: 18px;
        }

        .dom-scout-option:hover {
            background: rgba(255,255,255,0.1);
        }

        .dom-scout-option input[type="checkbox"] {
            cursor: pointer;
            width: 12px;
            height: 12px;
            margin: 0;
        }

        .dom-scout-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .dom-scout-option.disabled input {
            cursor: not-allowed;
        }

        .dom-scout-template-icon {
            display: none;
            cursor: pointer;
            margin-left: 4px;
            font-size: 11px;
            opacity: 0.8;
            transition: all 0.3s;
            padding: 1px 4px;
            border-radius: 4px;
            background: rgba(78, 205, 196, 0.2);
            border: 1px solid rgba(78, 205, 196, 0.3);
        }

        .dom-scout-template-icon.active {
            display: inline-block;
        }

        .dom-scout-template-icon:hover {
            opacity: 1;
            background: rgba(78, 205, 196, 0.3);
            transform: scale(1.1);
        }

        .dom-scout-template-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 2147483648;
            max-width: 400px;
            width: 90%;
            animation: modalFadeIn 0.3s ease-out;
            font-size: 12px;
        }

        .dom-scout-template-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 2147483647;
            animation: overlayFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .dom-scout-template-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
        }

        .dom-scout-template-modal-title {
            font-weight: bold;
            color: #333;
            font-size: 13px;
        }

        .dom-scout-template-modal-close {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 4px;
            border-radius: 4px;
        }

        .dom-scout-template-modal-close:hover {
            background: #f0f0f0;
            color: #333;
        }

        .dom-scout-template-modal-content {
            color: #555;
            line-height: 1.4;
        }

        .dom-scout-template-modal-query {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 6px;
            margin-top: 8px;
            font-size: 11px;
            word-break: break-all;
            border: 1px solid #e9ecef;
        }

        #dom-scout-container.compact-mode #dom-scout-options,
        #dom-scout-container.compact-mode #dom-scout-templates {
            display: none !important;
        }

        #dom-scout-container.compact-mode {
            min-height: 40px;
            height: 40px;
            overflow: hidden;
        }

        #dom-scout-container.compact-mode #dom-scout-main {
            margin-bottom: 0;
        }

        #dom-scout-options, #dom-scout-templates {
            transition: all 0.3s ease-in-out;
        }

        #dom-scout-container.compact-mode #dom-scout-toggle-options {
            background: rgba(255, 217, 61, 0.3);
            border-color: rgba(255, 217, 61, 0.6);
        }

        .dom-scout-highlight {
            outline: 2px solid #4A90E2 !important;
            outline-offset: 1px;
            background-color: rgba(74, 144, 226, 0.15) !important;
            position: relative !important;
            z-index: 999999 !important;
            animation: highlightPulse 1.5s ease-in-out infinite;
        }

        .dom-scout-highlight-current {
            outline: 3px solid #ffd93d !important;
            outline-offset: 2px;
            background-color: rgba(255, 217, 61, 0.25) !important;
            animation: highlightPulseCurrent 1s ease-in-out infinite;
            box-shadow: 0 0 15px rgba(255, 217, 61, 0.6) !important;
        }

        .dom-scout-highlight-star {
            outline: 2px solid #4ecdc4 !important;
            outline-offset: 1px;
            background-color: rgba(78, 205, 196, 0.2) !important;
            animation: highlightPulseStar 1.5s ease-in-out infinite;
        }

        .dom-scout-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #4A90E2;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 9px;
            font-weight: bold;
            z-index: 10000000;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            pointer-events: none;
        }

        .dom-scout-badge-current {
            background: #ffd93d;
            color: #333;
            font-size: 10px;
            padding: 3px 8px;
            animation: badgePulse 1s ease-in-out infinite;
        }

        .dom-scout-badge-star {
            background: #4ecdc4;
            color: white;
        }

        .dom-scout-action-badge {
            position: absolute;
            top: -8px;
            left: -8px;
            background: #4ecdc4;
            color: white;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 9px;
            font-weight: bold;
            z-index: 10000000;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
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
            min-width: 200px;
            max-width: 500px;
            width: auto;
            min-height: 60px;
            max-height: 150px;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
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

        #dom-scout-templates {
            display: none;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
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
                max-height: 300px;
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

        .dom-scout-template-btn.save {
            background: rgba(78, 205, 196, 0.3);
            border-color: rgba(78, 205, 196, 0.5);
        }

        .dom-scout-template-btn.delete {
            background: rgba(255, 107, 107, 0.3);
            border-color: rgba(255, 107, 107, 0.5);
        }

        @media (max-width: 768px) {
            #dom-scout-container {
                padding: 6px 8px;
                font-size: 11px;
            }
            
            #dom-scout-main {
                gap: 4px;
                margin-bottom: 4px;
            }
            
            #dom-scout-input {
                padding: 4px 8px;
                font-size: 11px;
                height: 24px;
                min-width: 100px;
            }
            
            .dom-scout-btn {
                padding: 3px 8px;
                font-size: 10px;
                height: 22px;
            }
        }
    `;

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
                        placeholder="🔭 Buscar texto..." 
                        autocomplete="off"
                        spellcheck="false"
                    />
                    <span id="dom-scout-info">0 resultados</span>
                    <button class="dom-scout-btn" id="dom-scout-templates-toggle" style="display:none;">📋 Templates</button>
                    <button class="dom-scout-btn" id="dom-scout-toggle-options" title="Ocultar opções">⬆️</button>
                    <button class="dom-scout-btn" id="dom-scout-clear">Limpar</button>
                    <button class="dom-scout-btn" id="dom-scout-close">Fechar</button>
                </div>
                <div id="dom-scout-options">
                    <label class="dom-scout-option" title="Buscar por elementos HTML">
                        <input type="checkbox" id="opt-html-mode">
                        <span>🏷️ HTML</span>
                    </label>
                    <label class="dom-scout-option disabled" title="Usar template salvo">
                        <input type="checkbox" id="opt-use-template" disabled>
                        <span>📋 Template</span>
                        <span class="dom-scout-template-icon" title="Clique para ver detalhes do template">📋</span>
                    </label>
                    <label class="dom-scout-option" title="Usar expressões regulares">
                        <input type="checkbox" id="opt-regex">
                        <span>Regex</span>
                    </label>
                    <label class="dom-scout-option" title="Buscar apenas palavras completas">
                        <input type="checkbox" id="opt-whole-words">
                        <span>Pal. Inteiras</span>
                    </label>
                    <label class="dom-scout-option" title="Diferenciar maiúsculas/minúsculas">
                        <input type="checkbox" id="opt-case-sensitive">
                        <span>Aa</span>
                    </label>
                    <label class="dom-scout-option" title="Considerar acentos">
                        <input type="checkbox" id="opt-accent-sensitive">
                        <span>À</span>
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
                        <button class="dom-scout-template-btn save" id="dom-scout-template-save" title="Salvar template">💾</button>
                        <button class="dom-scout-template-btn" id="dom-scout-template-load" title="Carregar template">📥</button>
                        <button class="dom-scout-template-btn delete" id="dom-scout-template-delete" title="Excluir template">🗑️</button>
                        <button class="dom-scout-template-btn close" id="dom-scout-template-close" title="Fechar">✖️</button>
                    </div>
                </div>
                <div style="color: rgba(255,255,255,0.7); font-size: 9px; margin-top: 4px; line-height: 1.2;">
                    💡 Ctrl+F: próximo | Shift+F: anterior | Ctrl+Enter: ação | ESC: fechar
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    }

    const searchContainer = createSearchUI();
    const searchInput = document.getElementById('dom-scout-input');
    const searchInfo = document.getElementById('dom-scout-info');
    const clearBtn = document.getElementById('dom-scout-clear');
    const closeBtn = document.getElementById('dom-scout-close');
    const templatesToggleBtn = document.getElementById('dom-scout-templates-toggle');

    const optHtmlMode = document.getElementById('opt-html-mode');
    const optUseTemplate = document.getElementById('opt-use-template');
    const optRegex = document.getElementById('opt-regex');
    const optWholeWords = document.getElementById('opt-whole-words');
    const optCaseSensitive = document.getElementById('opt-case-sensitive');
    const optAccentSensitive = document.getElementById('opt-accent-sensitive');
    const optHighlightAll = document.getElementById('opt-highlight-all');

    const templatesSection = document.getElementById('dom-scout-templates');
    const templateSelect = document.getElementById('dom-scout-template-select');
    const templateSaveBtn = document.getElementById('dom-scout-template-save');
    const templateLoadBtn = document.getElementById('dom-scout-template-load');
    const templateDeleteBtn = document.getElementById('dom-scout-template-delete');
    const templateCloseBtn = document.getElementById('dom-scout-template-close');

    const toggleOptionsBtn = document.getElementById('dom-scout-toggle-options');

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

    function toggleTemplatesPanel(show) {
        isTemplatesPanelVisible = show;
        if (show) {
            templatesSection.classList.add('active');
        } else {
            templatesSection.classList.remove('active');
        }
    }

    function updateTemplateStatus() {
        const templateIcon = document.querySelector('.dom-scout-template-icon');
        if (!templateIcon) return;
        
        if (searchOptions.useTemplate && currentTemplate) {
            templateIcon.classList.add('active');
            templateIcon.setAttribute('title', `Template: ${currentTemplate.name}\nQuery: ${currentTemplate.query}\nClique para detalhes`);
        } else {
            templateIcon.classList.remove('active');
            templateIcon.removeAttribute('title');
        }
    }

    function showTemplateModal() {
        if (!currentTemplate) return;

        const existingModal = document.querySelector('.dom-scout-template-modal');
        const existingOverlay = document.querySelector('.dom-scout-template-modal-overlay');
        if (existingModal) existingModal.remove();
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'dom-scout-template-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'dom-scout-template-modal';
        modal.innerHTML = `
            <div class="dom-scout-template-modal-header">
                <div class="dom-scout-template-modal-title">📋 Template Carregado</div>
                <button class="dom-scout-template-modal-close">&times;</button>
            </div>
            <div class="dom-scout-template-modal-content">
                <strong>Nome:</strong> ${currentTemplate.name}<br>
                <strong>Query:</strong>
                <div class="dom-scout-template-modal-query">${currentTemplate.query}</div>
            </div>
        `;

        const closeBtn = modal.querySelector('.dom-scout-template-modal-close');
        const closeModal = () => {
            modal.style.animation = 'modalFadeIn 0.3s ease-out reverse';
            overlay.style.animation = 'overlayFadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                modal.remove();
                overlay.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('dom-scout-template-icon') && 
            e.target.classList.contains('active')) {
            showTemplateModal();
        }
    });

    function updateInputState() {
        if (searchOptions.useTemplate && !currentTemplate) {
            searchInput.disabled = true;
            searchInput.placeholder = '🔒 Carregue um template primeiro...';
        } else {
            searchInput.disabled = false;
            updatePlaceholder();
        }
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
        
        let templatesToShow = savedTemplates;
        
        if (searchOptions.useTemplate) {
            templatesToShow = savedTemplates.filter(t => t.query.includes('{text}'));
        }
        
        templatesToShow.forEach((template, index) => {
            const option = document.createElement('option');
            const originalIndex = savedTemplates.indexOf(template);
            option.value = originalIndex;
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
        showSuccess('✔ Template salvo!');
        
        toggleTemplatesPanel(false);
    }

    function loadSelectedTemplate() {
        const index = templateSelect.value;
        if (index === '') {
            showSuccess('❌ Selecione um template');
            return;
        }

        const template = savedTemplates[index];
        if (!template) return;

        if (!searchOptions.useTemplate) {
            searchInput.value = template.query;
            showSuccess('✔ Template carregado no campo!');
        } 
        else {
            currentTemplate = template;
            searchInput.value = '';
            searchInput.disabled = false;
            updatePlaceholder();
            updateTemplateStatus();
            showSuccess('✔ Template ativo! Digite o valor');
        }
        
        toggleTemplatesPanel(false);
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
            updateTemplateStatus();
            updateInputState();
        }
        
        showSuccess('✔ Template excluído!');
        toggleTemplatesPanel(false);
    }

    function processTemplateQuery(userInput) {
        if (!currentTemplate) {
            return userInput;
        }

        return processQuotedTemplate(userInput);
    }

    function processQuotedTemplate(userInput) {
        if (!currentTemplate) return userInput;

        let processedQuery = currentTemplate.query;
        
        const placeholderRegex = /\{text\}/g;
        const quotedPlaceholderRegex = /"([^"]*)\{text\}([^"]*)"|'([^']*)\{text\}([^']*)'/g;
        
        let result = processedQuery;
        let match;
        
        while ((match = quotedPlaceholderRegex.exec(processedQuery)) !== null) {
            if (match[1] !== undefined) {
                const replacement = `"${match[1]}${userInput}${match[2]}"`;
                result = result.replace(match[0], replacement);
            } else if (match[3] !== undefined) {
                const replacement = `'${match[3]}${userInput}${match[4]}'`;
                result = result.replace(match[0], replacement);
            }
        }
        
        result = result.replace(placeholderRegex, userInput);
        
        return result;
    }

    // ===================================
    // 🔍 PARSE AVANÇADO
    // ===================================

    // 🆕 VALIDAÇÃO ADICIONAL: Preserva asteriscos em contexto regex
    function parseAdvancedQuery(query) {
        const parts = query.split('&').map(p => p.trim());
        const mainQuery = parts[0];
        const actionQuery = parts[1] || null;

        let scopeQuery = null;
        let hierarchyQuery = mainQuery;

        if (mainQuery.includes('<')) {
            const scopeParts = mainQuery.split('<').map(p => p.trim());
            scopeQuery = scopeParts[0];
            hierarchyQuery = scopeParts.slice(1).join('<').trim();
        }

        let scopeFilters = null;
        if (scopeQuery) {
            const parsed = parseFilters(scopeQuery);
            if (parsed.error) return parsed;
            scopeFilters = parsed.filters;
        }

        const hierarchyLevels = hierarchyQuery.split('>').map(p => p.trim());
        const parsedHierarchy = [];
        let highlightIndex = -1;

        hierarchyLevels.forEach((level, index) => {
            // 🆕 CORREÇÃO: Só marca como highlight se NÃO estiver em modo regex
            // ou se estiver explicitamente marcado com * fora de contexto regex
            const hasExplicitHighlight = level.includes('*') && 
                                       !(searchOptions.regex && level.includes('text:'));

            if (hasExplicitHighlight) {
                highlightIndex = index;
                level = removeHighlightAsterisks(level);
            }

            const parsed = parseFilters(level);
            if (parsed.error) {
                parsedHierarchy.push({ error: parsed.error });
                return;
            }

            parsedHierarchy.push({
                filters: parsed.filters,
                highlight: hasExplicitHighlight,
                level: index
            });
        });

        // 🆕 FALLBACK: Se não encontrou highlight explícito, usa o último
        if (highlightIndex === -1 && parsedHierarchy.length > 0) {
            highlightIndex = parsedHierarchy.length - 1;
            parsedHierarchy[highlightIndex].highlight = true;
        }

        let actionFilters = null;
        if (actionQuery) {
            const parsed = parseFilters(actionQuery);
            if (parsed.error) return parsed;
            actionFilters = parsed.filters;
        }

        return {
            scope: scopeFilters,
            hierarchy: parsedHierarchy,
            highlightIndex: highlightIndex,
            action: actionFilters
        };
    }

    // 🆕 FUNÇÃO CORRIGIDA: Remove apenas asteriscos de highlight (preserva regex)
    function removeHighlightAsterisks(str) {
        let result = '';
        let inQuotes = false;
        let quoteChar = null;
        let inRegex = false;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const prevChar = i > 0 ? str[i - 1] : '';

            // Verifica se estamos entrando ou saindo de aspas
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuotes = false;
                    quoteChar = null;
                }
            }

            // 🆕 DETECÇÃO DE MODO REGEX: Se estamos em text: com regex ativo
            const isRegexContext = searchOptions.regex && 
                                  str.substring(Math.max(0, i - 5), i).includes('text:');

            // Se estivermos dentro de aspas OU em contexto de regex, preserva todos os caracteres
            if (inQuotes || isRegexContext) {
                result += char;
            } 
            // Se não estiver em aspas nem em regex, remove apenas * que não sejam precedidos por \
            else if (char === '*' && prevChar !== '\\') {
                // Não adiciona o * (remove apenas asteriscos de highlight)
            } 
            else {
                result += char;
            }
        }

        return result.trim();
    }

    function parseFilters(queryPart) {
        const filters = [];
        // 🆕 CORREÇÃO COMPLETA: Regex totalmente revisada
        const regex = /(tag|class|id|attr|text):(?:"([^"]*)"|'([^']*)'|(\{text\})|([^\s&><]+))/gi;
        let match;
        let hasMatch = false;

        // 🆕 Reset da regex para evitar problemas com estado global
        regex.lastIndex = 0;

        while ((match = regex.exec(queryPart)) !== null) {
            hasMatch = true;
            const type = match[1].toLowerCase();
            let key = null;

            // 🆕 Determinar qual grupo foi capturado
            if (match[2] !== undefined) {
                key = match[2]; // Aspas duplas
            } else if (match[3] !== undefined) {
                key = match[3]; // Aspas simples  
            } else if (match[4] !== undefined) {
                key = match[4]; // {text}
            } else if (match[5] !== undefined) {
                key = match[5]; // Sem aspas
            }

            let value = null;

            // Processar atributos com valores (attr:name=value)
            if (key && key.includes('=') && type === 'attr') {
                const eqIndex = key.indexOf('=');
                value = key.substring(eqIndex + 1);
                key = key.substring(0, eqIndex);
            }

            filters.push({ type, key, value });
        }

        if (!hasMatch && queryPart.trim()) {
            return {
                error: 'Sintaxe: [tag:footer <] tag:div > *tag:span [& tag:button]'
            };
        }

        return { filters };
    }

    // ===================================
    // 🔍 BUSCA HTML
    // ===================================
    function searchHTML(query) {
        if (searchOptions.useTemplate && currentTemplate) {
            query = processTemplateQuery(query);
        }

        clearHighlights();
        currentMatches = [];

        if (!query || query.length === 0) {
            updateInfo(0, 0);
            return;
        }

        const parsed = parseAdvancedQuery(query);
        
        if (parsed.error) {
            updateInfo(0, 0);
            return;
        }

        let searchScope = [document.body];
        
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
                updateInfo(0, 0);
                return;
            }
        }

        const matchedElements = [];

        searchScope.forEach(scope => {
            const candidates = findHierarchyMatches(scope, parsed);
            matchedElements.push(...candidates);
        });

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

        if (searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                highlightElement(match.element, index + 1, match.count, false, match.actionElement, match.isStarred);
            });
        }

        updateInfo(currentMatches.length, currentIndex + 1);

        if (currentMatches.length > 0 && currentIndex === -1) {
            goToMatch(0);
        }
    }

    function findHierarchyMatches(scope, parsed) {
        const results = [];
        const hierarchy = parsed.hierarchy;
        const highlightIndex = parsed.highlightIndex;

        if (hierarchy.length === 0) return results;

        function traverseHierarchy(currentElements, level, pathElements) {
            if (level >= hierarchy.length) {
                const elementToHighlight = pathElements[highlightIndex];

                if (!elementToHighlight) return;

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
                    isStarred: hierarchy[highlightIndex]?.highlight || false
                });
                return;
            }

            const levelData = hierarchy[level];
            const currentLevelFilters = levelData.filters;

            for (const currentElement of currentElements) {
                const candidates = currentElement.querySelectorAll('*');

                for (const candidate of candidates) {
                    if (candidate.closest('#dom-scout-container')) continue;

                    if (matchFilters(candidate, currentLevelFilters)) {
                        const newPath = [...pathElements];
                        newPath[level] = candidate;

                        traverseHierarchy([candidate], level + 1, newPath);
                    }
                }
            }
        }

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
        text = element.textContent;
    }
    
    let elementText = text.trim();
    let searchText = textValue;
    
    // 🆕 CORREÇÃO: Processamento diferenciado para regex
    if (searchOptions.regex) {
        // Para regex, preservamos a string exatamente como foi fornecida
        // apenas removemos as aspas externas se existirem
        const isQuoted = (searchText.startsWith('"') && searchText.endsWith('"')) || 
                        (searchText.startsWith("'") && searchText.endsWith("'"));
        
        if (isQuoted) {
            searchText = searchText.slice(1, -1);
        }
        
        try {
            // 🆕 CORREÇÃO CRÍTICA: Aplicar prepareString consistentemente
            if (!searchOptions.accentSensitive) {
                elementText = prepareString(elementText);
                searchText = prepareString(searchText); // 🆕 AGORA TAMBÉM NO searchText!
            }
            
            const flags = searchOptions.caseSensitive ? '' : 'i';
            const regex = new RegExp(searchText, flags);
            
            return regex.test(elementText);
        } catch (e) {
            console.error('❌ Regex Error:', e);
            return false;
        }
    } else {
        // Processamento normal para texto sem regex
        if ((searchText.startsWith('"') && searchText.endsWith('"')) || 
            (searchText.startsWith("'") && searchText.endsWith("'"))) {
            searchText = searchText.slice(1, -1);
        }
        
        // 🆕 CORREÇÃO: Aplicar prepareString consistentemente
        elementText = prepareString(elementText);
        searchText = prepareString(searchText);
        
        if (!elementText) return false;
        
        if (searchOptions.wholeWords) {
            const regex = new RegExp(`\\b${escapeRegex(searchText)}\\b`, searchOptions.caseSensitive ? '' : 'i');
            return regex.test(elementText);
        }
        
        return searchOptions.caseSensitive
            ? elementText.includes(searchText)
            : elementText.toLowerCase().includes(searchText.toLowerCase());
    }
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
    // 🎨 HIGHLIGHT
    // ===================================
    function highlightElement(element, index, matchCount, isCurrent, actionElement, isStarred) {
        if (isCurrent) {
            element.classList.add('dom-scout-highlight-current');
        } else if (isStarred) {
            element.classList.add('dom-scout-highlight-star');
        } else {
            element.classList.add('dom-scout-highlight');
        }

        const badge = document.createElement('div');
        badge.className = 'dom-scout-badge';
        
        if (isCurrent) {
            badge.classList.add('dom-scout-badge-current');
        } else if (isStarred) {
            badge.classList.add('dom-scout-badge-star');
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
        document.querySelectorAll('.dom-scout-highlight, .dom-scout-highlight-star, .dom-scout-highlight-current').forEach(el => {
            el.classList.remove('dom-scout-highlight');
            el.classList.remove('dom-scout-highlight-current');
            el.classList.remove('dom-scout-highlight-star');
            
            const badges = el.querySelectorAll('[data-dom-scout-badge], [data-dom-scout-action-badge]');
            badges.forEach(badge => badge.remove());
        });

        highlightedElements = [];
    }

    // ===================================
    // 🔄 ATUALIZAÇÃO DE ELEMENTOS DINÂMICOS
    // ===================================

    function updateSearchResults() {
        if (!isVisible || !searchInput.value) return;

        const currentElement = currentMatches[currentIndex]?.element;
        const previousLength = currentMatches.length;

        if (searchOptions.htmlMode) {
            searchHTML(searchInput.value);
        } else {
            searchText(searchInput.value);
        }

        if (currentElement && currentMatches.length > 0) {
            const newIndex = currentMatches.findIndex(match => 
                match.element === currentElement
            );

            if (newIndex !== -1) {
                currentIndex = newIndex;
            } else if (currentIndex < currentMatches.length) {
                // mantém índice
            } else {
                currentIndex = Math.max(0, currentMatches.length - 1);
            }

            if (currentMatches[currentIndex]) {
                goToMatch(currentIndex);
            }

        }
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
            
            const prevMatch = currentMatches[currentIndex];
            if (prevMatch.isStarred) {
                current.classList.add('dom-scout-highlight-star');
                if (badge) {
                    badge.classList.add('dom-scout-badge-star');
                }
            } else {
                current.classList.add('dom-scout-highlight');
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
            element.classList.remove('dom-scout-highlight');
            element.classList.remove('dom-scout-highlight-star');
            element.classList.add('dom-scout-highlight-current');
            
            const badge = element.querySelector('[data-dom-scout-badge]');
            if (badge) {
                badge.classList.remove('dom-scout-badge-star');
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
        if (!isVisible) {
            showSearch();
            return;
        }

        updateSearchResults();

        if (currentMatches.length === 0) {
            searchInfo.textContent = 'Nenhum resultado';
            return;
        }

        goToMatch(currentIndex + 1);
    }

    function prevMatch() {
        if (!isVisible) return;

        updateSearchResults();

        if (currentMatches.length === 0) {
            searchInfo.textContent = 'Nenhum resultado';
            return;
        }

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
            showSuccess(`✔ Ação executada em ${match.actionElement.tagName.toLowerCase()}`);
        } else {
            const element = match.element;
            const clickables = element.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
            
            if (clickables.length > 0) {
                clickables[0].click();
                showSuccess(`✔ Clicado em ${clickables[0].tagName.toLowerCase()}`);
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                element.click();
                showSuccess(`✔ Clicado em ${element.tagName.toLowerCase()}`);
            } else {
                element.click();
                showSuccess(`✔ Clique executado`);
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
        
        if (currentMatches.length > 0 && searchOptions.highlightAll) {
            currentMatches.forEach((match, index) => {
                const isCurrent = (index === currentIndex);
                highlightElement(match.element, index + 1, match.count, isCurrent, match.actionElement, match.isStarred);
            });
        }
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
            searchInput.placeholder = '🔭 tag:footer < tag:div > text:"valor com espaços" & tag:button';
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
                // 🆕 COMPORTAMENTO MELHORADO: Sempre foca e seleciona o campo
                searchInput.focus();
                searchInput.select();
                
                // Executa a navegação normalmente
                nextMatch();
            }
        }

        if (e.shiftKey && e.key === 'F' && isVisible) {
            e.preventDefault();
            // 🆕 Mantém o foco no campo durante navegação anterior
            searchInput.focus();
            prevMatch();
        }

        if (e.key === 'Escape' && isVisible) {
            hideSearch();
        }

        if (isVisible && !searchInput.contains(target)) {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                executeAction();
            }
        }
    });

    searchInput.addEventListener('blur', () => {
        // Se a ferramenta está visível, mantém o foco no campo
        if (isVisible) {
            setTimeout(() => {
                if (isVisible && document.activeElement !== searchInput) {
                    searchInput.focus();
                }
            }, 10);
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            executeAction();
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        // Reset index para forçar navegação ao primeiro resultado na nova busca
        currentIndex = -1;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchOptions.htmlMode) {
                searchHTML(e.target.value);
            } else {
                searchText(e.target.value);
            }
        }, 300);
    });

    [optRegex, optWholeWords, optCaseSensitive, optAccentSensitive, optHighlightAll].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const optionName = e.target.id.replace('opt-', '').replace(/-./g, x => x[1].toUpperCase());
            searchOptions[optionName] = e.target.checked;
            
            if (searchInput.value) {
                searchText(searchInput.value);
            }
        });
    });

    optHtmlMode.addEventListener('change', (e) => {
        searchOptions.htmlMode = e.target.checked;
        updatePlaceholder();
        
        if (e.target.checked) {
            optWholeWords.disabled = true;
            optWholeWords.parentElement.classList.add('disabled');
            
            optUseTemplate.disabled = false;
            optUseTemplate.parentElement.classList.remove('disabled');
            
            templatesToggleBtn.style.display = 'inline-block';
        } else {
            optWholeWords.disabled = false;
            optWholeWords.parentElement.classList.remove('disabled');
            
            if (optUseTemplate.checked) {
                isAutomaticToggle = true;
                optUseTemplate.checked = false;
                searchOptions.useTemplate = false;
                updateTemplateStatus();
            }
            
            optUseTemplate.disabled = true;
            optUseTemplate.parentElement.classList.add('disabled');
            
            templatesToggleBtn.style.display = 'none';
            toggleTemplatesPanel(false);
        }

        updateTemplateStatus();
        
        if (searchInput.value) {
            searchText(searchInput.value);
        }
    });

    optUseTemplate.addEventListener('change', (e) => {
        searchOptions.useTemplate = e.target.checked;
        
        if (e.target.checked) {
            if (!currentTemplate) {
                toggleTemplatesPanel(true);
                showSuccess('💡 Selecione e carregue um template');
            }
            
            updateTemplateStatus(); // ✅ ATUALIZADO
            updateInputState();
            updateTemplateSelect();
        } else {
            if (!isAutomaticToggle) {
                searchInput.value = '';
            }
            
            updateTemplateStatus(); // ✅ ATUALIZADO
            updateInputState();
            updateTemplateSelect();
        }
        
        updatePlaceholder();
        
        if (e.target.checked && searchInput.value && !isAutomaticToggle) {
            searchText(searchInput.value);
        }
        
        isAutomaticToggle = false;
    });

    templatesToggleBtn.addEventListener('click', () => {
        const container = document.getElementById('dom-scout-container');
        const isCompact = container.classList.contains('compact-mode');
        
        // Se estiver no modo compacto, sair automaticamente
        if (isCompact) {
            container.classList.remove('compact-mode');
            toggleOptionsBtn.textContent = '⬆️';
            toggleOptionsBtn.setAttribute('title', 'Ocultar opções');
            showSuccess('Modo normal - Templates disponível');
        }
        
        // Agora alternar a visibilidade do painel de templates
        toggleTemplatesPanel(!isTemplatesPanelVisible);
    });

    templateSaveBtn.addEventListener('click', () => {
        saveCurrentTemplate();
        // Não fechar automaticamente o painel após salvar
    });

    templateLoadBtn.addEventListener('click', () => {
        loadSelectedTemplate();
        // Não fechar automaticamente o painel após carregar
    });

    templateDeleteBtn.addEventListener('click', () => {
        deleteSelectedTemplate();
        // Não fechar automaticamente o painel após excluir
    });

    templateCloseBtn.addEventListener('click', () => {
        toggleTemplatesPanel(false);
    });

    templateSelect.addEventListener('change', () => {
        // Não carrega automaticamente
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

    toggleOptionsBtn.addEventListener('click', () => {
        const container = document.getElementById('dom-scout-container');
        const isCompact = container.classList.contains('compact-mode');
        
        if (isCompact) {
            // Sair do modo compacto - mostrar opções
            container.classList.remove('compact-mode');
            toggleOptionsBtn.textContent = '⬆️';
            toggleOptionsBtn.setAttribute('title', 'Ocultar opções');
            showSuccess('Opções visíveis');
        } else {
            // Entrar no modo compacto - ocultar opções
            // 🆕 Fechar também a seção de templates se estiver aberta
            if (isTemplatesPanelVisible) {
                toggleTemplatesPanel(false);
            }
            container.classList.add('compact-mode');
            toggleOptionsBtn.textContent = '⬇️';
            toggleOptionsBtn.setAttribute('title', 'Mostrar opções');
            showSuccess('Modo compacto ativado');
        }
    });

    // 🖱️ CLIQUE PARA NAVEGAR (NOVA FUNCIONALIDADE)
    document.addEventListener('click', (e) => {
        if (!isVisible) return;
        
        // Verifica se o clique foi em um elemento destacado
        const clickedElement = e.target.closest('.dom-scout-highlight, .dom-scout-highlight-star');
        if (clickedElement && currentMatches.length > 0) {
            // Encontra o índice do elemento clicado na lista de matches
            const clickedIndex = currentMatches.findIndex(match => match.element === clickedElement);
            if (clickedIndex !== -1) {
                goToMatch(clickedIndex);
                
                // Feedback visual adicional
                clickedElement.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    clickedElement.style.transform = '';
                }, 200);
            }
        }
    });

    // ===================================
    // ✅ CONFIRMAÇÃO
    // ===================================
    console.log('%c🔭 DOM Scout v4.2.0 - SUPER ATUALIZADO!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c┌────────────────────────────────────────────┐', 'color: #764ba2;');
    console.log('%c🎉 NOVAS FUNCIONALIDADES IMPLEMENTADAS:', 'color: #4ecdc4; font-size: 16px; font-weight: bold;');
    console.log('%c└────────────────────────────────────────────┘', 'color: #764ba2;');
    console.log('%c\n🎯 Modo Compacto Avançado', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✅ Botão "⬆️" para ocultar/mostrar opções');
    console.log('  ✅ Interface 63% mais compacta quando necessário');
    console.log('  ✅ Estado preservado durante a sessão');
    console.log('%c\n🔤 Suporte a Textos com Espaços', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✅ Aspas duplas: text:"Olá mundo"');
    console.log('  ✅ Aspas simples: text:\'Hello world\'');
    console.log('  ✅ Compatível com templates: text:"Bem-vindo {text}!"');
    console.log('  ✅ Elimina ambiguidades em queries complexas');
    console.log('%c\n🚀 Exemplos que agora funcionam:', 'color: #ffd93d; font-weight: bold;');
    console.log('  tag:div text:"Texto com espaços" attr:data-id');
    console.log('  tag:footer < tag:li > text:"Item menu" & tag:a');
    console.log('  Templates com: text:"Bem-vindo {text}!"');
    console.log('%c\n🎊 DOM Scout mais poderoso que nunca!', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
})();

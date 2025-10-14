// =================================== 
// 🔭 DOM SCOUT v4.1 - Templates Otimizados
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

        /* ✅ NOVO: Ícone do Template Status */
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

        /* ✅ NOVO: Modal do Template */
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

        /* 🔄 ESTILOS RESPONSIVOS */
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
            
            #dom-scout-options {
                gap: 6px;
            }
            
            .dom-scout-option {
                font-size: 9px;
                padding: 1px 4px;
                height: 16px;
            }
        }

        @media (max-width: 480px) {
            #dom-scout-main {
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
            }
            
            #dom-scout-input {
                min-width: auto;
            }
            
            #dom-scout-info {
                min-width: auto;
                align-self: center;
            }
        }

        /* 🎨 MANTÉM OS ESTILOS EXISTENTES DE HIGHLIGHT */
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

        .dom-scout-error {
            color: #ffcccc;
            font-size: 12px;
            margin-top: 5px;
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

        .dom-scout-template-btn.close {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .dom-scout-template-btn.close:hover {
            background: rgba(255, 255, 255, 0.3);
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

    // Substituir o elemento de estilo existente
    const existingStyle = document.querySelector('style');
    if (existingStyle) {
        existingStyle.remove();
    }
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
                <div id="dom-scout-error"></div>
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
    const searchError = document.getElementById('dom-scout-error');
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
    const templateInfo = document.getElementById('dom-scout-template-info');
    const templateStatus = document.getElementById('dom-scout-template-status');
    const templateStatusText = document.getElementById('dom-scout-template-status-text');

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

    // ✅ NOVO: Ícone do Template Status (substitui a função anterior)
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

    // ✅ NOVO: Modal do Template
    function showTemplateModal() {
        if (!currentTemplate) return;

        // Remove modal existente se houver
        const existingModal = document.querySelector('.dom-scout-template-modal');
        const existingOverlay = document.querySelector('.dom-scout-template-modal-overlay');
        if (existingModal) existingModal.remove();
        if (existingOverlay) existingOverlay.remove();

        // Cria overlay
        const overlay = document.createElement('div');
        overlay.className = 'dom-scout-template-modal-overlay';
        
        // Cria modal
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

        // Adiciona eventos
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
        
        // Adiciona ao DOM
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    // ✅ NOVO: Event Listener para o ícone do template
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
        showSuccess('✓ Template salvo!');
        
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
            showSuccess('✓ Template carregado no campo!');
        } 
        else {
            currentTemplate = template;
            searchInput.value = '';
            searchInput.disabled = false;
            updatePlaceholder();
            updateTemplateStatus(); // ✅ ATUALIZADO
            showSuccess('✓ Template ativo! Digite o valor');
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
            updateTemplateStatus(); // ✅ ATUALIZADO
            updateInputState();
        }
        
        showSuccess('✓ Template excluído!');
        toggleTemplatesPanel(false);
    }

    function processTemplateQuery(userInput) {
        if (!currentTemplate) {
            return userInput;
        }

        let processedQuery = currentTemplate.query.replace(/\{text\}/g, userInput);
        
        return processedQuery;
    }

    // ===================================
    // 🔍 PARSE AVANÇADO COM NOVOS OPERADORES
    // ===================================

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
            const hasHighlight = level.includes('*');
            if (hasHighlight) {
                highlightIndex = index;
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

        const errorLevel = parsedHierarchy.find(h => h.error);
        if (errorLevel) {
            return { error: errorLevel.error };
        }

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
        // ✅ CORREÇÃO CRÍTICA: Processa template se necessário
        if (searchOptions.useTemplate && currentTemplate) {
            query = processTemplateQuery(query);
        }

        clearHighlights();
        searchError.textContent = '';
        currentMatches = [];
        currentIndex = 0;

        if (!query || query.length === 0) {
            updateInfo(0, 0);
            return;
        }

        const parsed = parseAdvancedQuery(query);
        
        if (parsed.error) {
            searchError.textContent = `❌ ${parsed.error}`;
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
                searchError.textContent = '⚠️ Nenhum elemento no escopo definido';
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

        if (currentMatches.length > 0) {
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
    // 🎨 HIGHLIGHT COM SUPORTE A * - ✅ CORREÇÃO 2
    // ===================================
    function highlightElement(element, index, matchCount, isCurrent, actionElement, isStarred) {
        // ✅ CORREÇÃO 2: Lógica de cores corrigida
        // Prioridade: Current (amarelo) > Starred (ciano) > Normal (azul)
        
        if (isCurrent) {
            // Elemento ATUAL sempre AMARELO (maior prioridade)
            element.classList.add('dom-scout-highlight-current');
        } else if (isStarred) {
            // Elemento STARRED sempre CIANO (quando não é atual)
            element.classList.add('dom-scout-highlight-star');
        } else {
            // Elementos normais sempre AZUL
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

        // Salva o elemento atualmente destacado e sua posição
        const currentElement = currentMatches[currentIndex]?.element;
        const previousLength = currentMatches.length;

        console.log(`🔭 DOM Scout: Atualizando lista de resultados... (${previousLength} elementos anteriores)`);

        // Refaz a busca com a query atual
        if (searchOptions.htmlMode) {
            searchHTML(searchInput.value);
        } else {
            searchText(searchInput.value);
        }

        // Tenta manter a posição de navegação
        if (currentElement && currentMatches.length > 0) {
            const newIndex = currentMatches.findIndex(match => 
                match.element === currentElement
            );

            if (newIndex !== -1) {
                // Elemento anterior ainda existe, mantém a posição
                currentIndex = newIndex;
                console.log(`🔭 DOM Scout: Posição mantida - índice ${currentIndex}`);
            } else if (currentIndex < currentMatches.length) {
                // Elemento anterior não existe, mas há elementos suficientes
                console.log(`🔭 DOM Scout: Elemento anterior não encontrado, mantendo índice ${currentIndex}`);
            } else {
                // Índice anterior está fora dos limites, vai para o último elemento
                currentIndex = Math.max(0, currentMatches.length - 1);
                console.log(`🔭 DOM Scout: Índice ajustado para ${currentIndex}`);
            }

            // Atualiza o highlight do elemento atual
            if (currentMatches[currentIndex]) {
                goToMatch(currentIndex);
            }
        }

        console.log(`🔭 DOM Scout: Lista atualizada - ${currentMatches.length} elementos (${currentMatches.length - previousLength} novos)`);
    }

    // ===================================
    // 🎯 NAVEGAÇÃO - ✅ CORREÇÃO 3
    // ===================================
    function goToMatch(index) {
        if (currentMatches.length === 0) return;

        // Remove highlight atual do elemento anterior
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
            
            // ✅ CORREÇÃO 3: Restaura a classe correta do elemento anterior
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
            // ✅ CORREÇÃO 3: Modo "um por vez" - limpa e destaca apenas o atual
            clearHighlights();
            highlightElement(element, currentIndex + 1, match.count, true, match.actionElement, match.isStarred);
        } else {
            // ✅ CORREÇÃO 3: Modo "destacar todas" - remove classe antiga e adiciona a atual
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

        // ✅ ATUALIZA: Atualiza lista antes de navegar
        updateSearchResults();

        if (currentMatches.length === 0) {
            searchInfo.textContent = 'Nenhum resultado';
            return;
        }

        goToMatch(currentIndex + 1);
    }

    function prevMatch() {
        if (!isVisible) return;

        // ✅ ATUALIZA: Atualiza lista antes de navegar
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
    // 👁️ SHOW/HIDE - ✅ CORREÇÃO 3
    // ===================================
    function showSearch() {
        searchContainer.style.display = 'block';
        searchInput.focus();
        searchInput.select();
        isVisible = true;
        
        // ✅ CORREÇÃO 3: Reaplica highlights ao reabrir se houver resultados
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
                nextMatch(); // ✅ AGORA ATUALIZA AUTOMATICAMENTE
            }
        }

        if (e.shiftKey && e.key === 'F' && isVisible) {
            e.preventDefault();
            prevMatch(); // ✅ AGORA ATUALIZA AUTOMATICAMENTE
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

    // ✅ CORREÇÃO: Ctrl+Enter/Ctrl+Espaço para executar ação
    searchInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            executeAction();
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // ✅ GARANTE: Sempre usa a busca apropriada para o modo atual
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
        toggleTemplatesPanel(!isTemplatesPanelVisible);
    });

    templateSaveBtn.addEventListener('click', () => {
        saveCurrentTemplate();
    });

    templateLoadBtn.addEventListener('click', () => {
        loadSelectedTemplate();
    });

    templateDeleteBtn.addEventListener('click', () => {
        deleteSelectedTemplate();
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

    // ===================================
    // ✅ CONFIRMAÇÃO
    // ===================================
    console.log('%c🔭 DOM Scout v4.1.1 - CORRIGIDO!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c┌────────────────────────────────────────────┐', 'color: #764ba2;');
    console.log('%c✅ CORREÇÕES APLICADAS:', 'color: #4ecdc4; font-size: 16px; font-weight: bold;');
    console.log('%c└────────────────────────────────────────────┘', 'color: #764ba2;');
    console.log('%c\n🎯 Correção 1: Status do Template', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✓ Aparece SOMENTE quando "Usar Template" está marcado E há template carregado');
    console.log('%c\n🎨 Correção 2: Cores dos Highlights', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✓ Elemento FOCADO: sempre AMARELO (#ffd93d)');
    console.log('  ✓ Elementos NORMAIS: sempre AZUL (#4A90E2)');
    console.log('  ✓ Elementos STARRED (*): sempre CIANO (#4ecdc4)');
    console.log('%c\n🔄 Correção 3: Reabertura com Highlights', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✓ Ao reabrir (Ctrl+F), todos os resultados aparecem destacados');
    console.log('  ✓ Elemento atual sempre em amarelo');
    console.log('  ✓ Navegação entre elementos mantém cores corretas');
    console.log('%c\n⌨️ Correção 4: Atalhos de Ação', 'color: #ffd93d; font-weight: bold;');
    console.log('  ✓ Ctrl+Enter ou Ctrl+Espaço: executar ação');
    console.log('  ✓ Enter e Espaço: funcionam normalmente no campo de busca');
    console.log('  ✓ Não bloqueia mais digitação após navegação');
    console.log('%c\n🎉 Todas as correções foram aplicadas com sucesso!', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
})();

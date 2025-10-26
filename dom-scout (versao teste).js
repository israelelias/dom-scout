!function(){"use strict";if(window.domScoutInstalled)console.log("🔭 DOM Scout já instalado. Pressione Ctrl+F para usar.");else{let s=!(window.domScoutInstalled=!0),t=[],i=[],r=-1;const H={regex:!1,wholeWords:!1,caseSensitive:!1,accentSensitive:!1,highlightAll:!0,htmlMode:!1,useTemplate:!1},P="domScoutTemplates";let n=function(){try{var e=localStorage.getItem(P);return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar templates:",e),[]}}(),l=null,o=!1,a=!1;const _={SPAN_HIGHLIGHT:"dom-scout-text-highlight",SPAN_CURRENT:"dom-scout-text-highlight-current",SPAN_STAR:"dom-scout-text-highlight-star",ELEMENT_HIGHLIGHT:"dom-scout-highlight",ELEMENT_CURRENT:"dom-scout-highlight-current",ELEMENT_STAR:"dom-scout-highlight-star"};(e=document.createElement("style")).textContent=`
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

        /* Estilos para spans de destaque (modo texto) */
        .dom-scout-text-highlight {
            background-color: rgba(74, 144, 226, 0.35) !important;
            color: inherit !important;
            border-radius: 2px;
            padding: 1px 2px;
            box-shadow: 0 0 0 1px rgba(74, 144, 226, 0.5);
            position: relative;
            z-index: 999998;
        }

        .dom-scout-text-highlight-current {
            background-color: rgba(255, 217, 61, 0.6) !important;
            color: #000 !important;
            font-weight: 500;
            box-shadow: 0 0 0 2px rgba(255, 217, 61, 0.8), 0 2px 8px rgba(255, 217, 61, 0.4);
            animation: highlightPulseCurrent 1s ease-in-out infinite;
        }

        .dom-scout-text-highlight-star {
            background-color: rgba(78, 205, 196, 0.4) !important;
            color: inherit !important;
            box-shadow: 0 0 0 1px rgba(78, 205, 196, 0.6);
        }

        /* Mantém estilo para elementos HTML (modo HTML) */
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

        @keyframes highlightPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        @keyframes highlightPulseCurrent {
            0%, 100% { 
                transform: scale(1);
                opacity: 1;
            }
            50% { 
                transform: scale(1.02);
                opacity: 0.9;
            }
        }

        @keyframes highlightPulseStar {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
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

        @keyframes badgePulse {
            0%, 100% {
                background: #ffd93d;
                transform: scale(1);
            }
            50% {
                background: #ffed4e;
                transform: scale(1.1);
            }
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
    `,document.head.appendChild(e),(e=document.createElement("div")).id="dom-scout-container",e.style.display="none",e.innerHTML=`
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
                        <button class="dom-scout-template-btn" id="dom-scout-template-load" title="Carregar template">🔥</button>
                        <button class="dom-scout-template-btn delete" id="dom-scout-template-delete" title="Excluir template">🗑️</button>
                        <button class="dom-scout-template-btn close" id="dom-scout-template-close" title="Fechar">✖️</button>
                    </div>
                </div>
                <div style="color: rgba(255,255,255,0.7); font-size: 9px; margin-top: 4px; line-height: 1.2;">
                    💡 Ctrl+F: próximo | Ctrl+G: anterior | Ctrl+Enter: ação | ESC: fechar
                </div>
            </div>
        `,document.body.appendChild(e);const z=e,O=document.getElementById("dom-scout-input"),B=document.getElementById("dom-scout-info");var e=document.getElementById("dom-scout-clear"),W=document.getElementById("dom-scout-close");const q=document.getElementById("dom-scout-templates-toggle");var Y=document.getElementById("opt-html-mode");const D=document.getElementById("opt-use-template");var j=document.getElementById("opt-regex");const F=document.getElementById("opt-whole-words");var K=document.getElementById("opt-case-sensitive"),V=document.getElementById("opt-accent-sensitive"),J=document.getElementById("opt-highlight-all");const G=document.getElementById("dom-scout-templates"),U=document.getElementById("dom-scout-template-select");var Q=document.getElementById("dom-scout-template-save"),X=document.getElementById("dom-scout-template-load"),Z=document.getElementById("dom-scout-template-delete"),ee=document.getElementById("dom-scout-template-close");const $=document.getElementById("dom-scout-toggle-options");document.addEventListener("click",e=>{if(e.target.classList.contains("dom-scout-template-icon")&&e.target.classList.contains("active")&&(e.preventDefault(),e.stopPropagation(),l)){var e=document.querySelector(".dom-scout-template-modal"),t=document.querySelector(".dom-scout-template-modal-overlay");e&&e.remove(),t&&t.remove();const o=document.createElement("div"),a=(o.className="dom-scout-template-modal-overlay",document.createElement("div"));a.className="dom-scout-template-modal",a.innerHTML=`
            <div class="dom-scout-template-modal-header">
                <div class="dom-scout-template-modal-title">📋 Template Carregado</div>
                <button class="dom-scout-template-modal-close">&times;</button>
            </div>
            <div class="dom-scout-template-modal-content">
                <strong>Nome:</strong> ${l.name}<br>
                <strong>Query:</strong>
                <div class="dom-scout-template-modal-query">${l.query}</div>
            </div>
        `,e=()=>{a.style.animation="modalFadeIn 0.3s ease-out reverse",o.style.animation="overlayFadeIn 0.3s ease-out reverse",setTimeout(()=>{a.remove(),o.remove()},300)},a.querySelector(".dom-scout-template-modal-close").addEventListener("click",e),o.addEventListener("click",e),document.body.appendChild(o),document.body.appendChild(a)}}),document.addEventListener("keydown",e=>{var t=e.target,o="checkbox"===t.type,a=t.closest("#dom-scout-container");if((e.ctrlKey||e.metaKey)&&("f"===e.key.toLowerCase()||"g"===e.key.toLowerCase())){if(o&&a)return e.preventDefault(),e.stopPropagation(),O.focus(),O.select(),void("f"===e.key.toLowerCase()?s?document.activeElement===O&&ae():R():"g"===e.key.toLowerCase()&&s&&document.activeElement===O&&ne());if(("INPUT"===t.tagName||"TEXTAREA"===t.tagName)&&"dom-scout-input"!==t.id)return;if("f"===e.key.toLowerCase()){if(e.preventDefault(),!s)return void R();o=document.activeElement===O,O.focus(),O.select(),o&&ae()}"g"===e.key.toLowerCase()&&s&&(e.preventDefault(),a=document.activeElement===O,O.focus(),O.select(),a)&&ne()}"Escape"===e.key&&s&&ie(),!s||O.contains(t)||!e.ctrlKey&&!e.metaKey||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),se())}),document.querySelectorAll('#dom-scout-options input[type="checkbox"]').forEach(e=>{e.addEventListener("change",e=>{setTimeout(()=>{s&&(O.focus(),O.select())},10)}),e.addEventListener("click",e=>{e.stopPropagation()})}),z.addEventListener("click",e=>{}),O.addEventListener("keydown",e=>{!e.ctrlKey&&!e.metaKey||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),se())});let c;function d(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function m(e){return H.accentSensitive?e:e.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function u(t){try{let e=H.regex?t:d(t);H.wholeWords&&!H.regex&&(e=`\\b${e}\\b`);var o="g"+(H.caseSensitive?"":"i");return new RegExp(e,o)}catch(e){return null}}function p(e){const t=document.createElement("div");t.className="dom-scout-success",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.style.animation="successPopup 0.3s ease-out reverse",setTimeout(()=>t.remove(),300)},1500)}function g(e){(o=e)?G.classList.add("active"):G.classList.remove("active")}function h(){var e=document.querySelector(".dom-scout-template-icon");e&&(H.useTemplate&&l?(e.classList.add("active"),e.setAttribute("title",`Template: ${l.name}
Query: ${l.query}
Clique para detalhes`)):(e.classList.remove("active"),e.removeAttribute("title")))}function f(){H.useTemplate&&!l?(O.disabled=!0,O.placeholder="🔒 Carregue um template primeiro..."):(O.disabled=!1,x())}function x(){H.useTemplate&&l?O.placeholder="Digite o valor para: "+l.name:H.htmlMode?O.placeholder='🔭 tag:footer < tag:div > text:"valor com espaços" & tag:button':O.placeholder="🔭 Buscar texto na página..."}function b(t,e){if(t){switch(t.classList.remove(_.SPAN_HIGHLIGHT,_.SPAN_CURRENT,_.SPAN_STAR),e){case"current":t.classList.add(_.SPAN_CURRENT);break;case"normal":t.classList.add(_.SPAN_HIGHLIGHT);break;case"star":t.classList.add(_.SPAN_STAR);break;case"none":["backgroundColor","boxShadow","color","fontWeight","borderRadius","padding","position","zIndex"].forEach(e=>t.style.removeProperty(e))}"none"!==e&&(t.style.display="inline")}}function v(e,t){var o,a,n,s;H.htmlMode?(a=t,(n=(o=e).element)&&(n.classList.remove(_.ELEMENT_HIGHLIGHT,_.ELEMENT_CURRENT,_.ELEMENT_STAR),a?n.classList.add(_.ELEMENT_CURRENT):o.isStarred?n.classList.add(_.ELEMENT_STAR):n.classList.add(_.ELEMENT_HIGHLIGHT),n=a,(s=(o=(a=o).element).querySelector("[data-dom-scout-badge]"))&&(s.classList.toggle("dom-scout-badge-current",n),s.classList.toggle("dom-scout-badge-star",!n&&a.isStarred)),(s=o.querySelector("[data-dom-scout-action-badge]"))&&s.remove(),n)&&a.actionElement&&((s=document.createElement("div")).className="dom-scout-action-badge",s.textContent="⚡ AÇÃO",s.setAttribute("data-dom-scout-action-badge","true"),o.appendChild(s))):(n=t,(a=e).span&&(n?b(a.span,"current"):H.highlightAll?b(a.span,a.isStarred?"star":"normal"):b(a.span,"none")))}function E(){try{localStorage.setItem(P,JSON.stringify(n))}catch(e){console.error("Erro ao salvar templates:",e),p("❌ Erro ao salvar template")}}function y(){U.innerHTML='<option value="">Selecione um template...</option>';let e=n;(e=H.useTemplate?n.filter(e=>e.query.includes("{text}")):e).forEach((e,t)=>{var o=document.createElement("option"),a=n.indexOf(e);o.value=a,o.textContent=e.name,U.appendChild(o)})}function k(o){if(!o||0===o.trim().length)return null;if(l){var a=o;if(!l)return a;var n,s=l.query,i=/"([^"]*)\{text\}([^"]*)"|'([^']*)\{text\}([^']*)'/g;let e=s,t;for(;null!==(t=i.exec(s));)void 0!==t[1]?(n=`"${t[1]}${a}${t[2]}"`,e=e.replace(t[0],n)):void 0!==t[3]&&(n=`'${t[3]}${a}${t[4]}'`,e=e.replace(t[0],n));return e=e.replace(/\{text\}/g,a)}return o}function T(e){var o=[],t=/(tag|class|id|attr|text):(?:"([^"]*)"|'([^']*)'|(\{text\})|([^\s&><]*))/gi;let a=!1;for(t.lastIndex=0;null!==(n=t.exec(e));){a=!0;var n,s=n[1].toLowerCase();let e=null,t=(void 0!==n[2]?e=n[2]:void 0!==n[3]?e=n[3]:void 0!==n[4]?e=n[4]:void 0!==n[5]&&(e=n[5]),null);e&&e.includes("=")&&"attr"===s&&(n=e.indexOf("="),t=e.substring(n+1),e=e.substring(0,n)),"text"!==s||void 0!==e&&null!==e&&""!==e||(e=""),o.push({type:s,key:e,value:t})}return!a&&e.trim()?{error:"Sintaxe: [tag:footer <] tag:div > *tag:span [& tag:button]"}:{filters:o}}function w(e){if(e&&0!==e.trim().length){if(H.useTemplate&&l){var o=k(e);if(null===o)return I(),i=[],void M(0,0);e=o}I(),i=[];const a=function(e){var t=(e=e.split("&").map(e=>e.trim()))[0],e=e[1]||null;let o=null,a=t,n=(t.includes("<")&&(t=t.split("<").map(e=>e.trim()),o=t[0],a=t.slice(1).join("<").trim()),null);if(o){if((t=T(o)).error)return t;n=t.filters}t=a.split(">").map(e=>e.trim());const s=[];let i=-1,r=(t.forEach((e,t)=>{var o=e.includes("*")&&!(H.regex&&e.includes("text:"));o&&(i=t,e=function(t){let o="",a=!1,n=null;for(let e=0;e<t.length;e++){var s=t[e],i=0<e?t[e-1]:"",r=('"'!==s&&"'"!==s||"\\"===i||(a?s===n&&(a=!1,n=null):(a=!0,n=s)),H.regex&&t.substring(Math.max(0,e-5),e).includes("text:"));(a||r||"*"!==s||"\\"===i)&&(o+=s)}return o.trim()}(e)),(e=T(e)).error?s.push({error:e.error}):s.push({filters:e.filters,highlight:o,level:t})}),-1===i&&0<s.length&&(i=s.length-1,s[i].highlight=!0),null);if(e){if((t=T(e)).error)return t;r=t.filters}return{scope:n,hierarchy:s,highlightIndex:i,action:r}}(e);if(a.error)M(0,0);else if(L(a))M(0,0);else{let t=[document.body];if(a.scope&&(o=document.querySelectorAll("*"),t=[],o.forEach(e=>{e.closest("#dom-scout-container")||C(e,a.scope)&&t.push(e)}),0===t.length))M(0,0);else{const n=[];t.forEach(e=>{e=function(e,d){const m=[],u=d.hierarchy,p=d.highlightIndex;return 0===u.length||L(d)||function e(t,o,a){if(o>=u.length){var n=a[p];if(!n)return;let e=null;if(d.action)for(const r of n.querySelectorAll("*"))if(C(r,d.action)){e=r;break}return m.push({element:n,actionElement:e,isStarred:u[p]?.highlight||!1})}var s,i=u[o].filters;for(const l of t)for(const c of l.querySelectorAll("*"))!c.closest("#dom-scout-container")&&C(c,i)&&e([(s=[...a])[o]=c],o+1,s)}([e],0,[]),m}(e,a),n.push(...e)}),i=n.filter((t,e,o)=>o.findIndex(e=>e.element===t.element)===e).map(e=>({element:e.element,count:1,actionElement:e.actionElement,isStarred:e.isStarred})).sort((e,t)=>(e=e.element.compareDocumentPosition(t.element))&Node.DOCUMENT_POSITION_FOLLOWING?-1:e&Node.DOCUMENT_POSITION_PRECEDING?1:0),H.highlightAll&&i.forEach((e,t)=>{te(e.element,t+1,e.count,!1,e.actionElement,e.isStarred)}),M(i.length,r+1),0<i.length&&-1===r&&A(0)}}}else I(),i=[],r=-1,M(0,0)}function L(e){if(e.scope)for(const t of e.scope)if("text"===t.type&&(!t.key||""===t.key.trim()))return 1;if(e.hierarchy)for(const o of e.hierarchy)if(o.filters)for(const a of o.filters)if("text"===a.type&&(!a.key||""===a.key.trim()))return 1;if(e.action)for(const n of e.action)if("text"===n.type&&(!n.key||""===n.key.trim()))return 1}function C(e,t,o=!1){for(const i of t){var{type:a,key:n,value:s}=i;switch(a){case"tag":if(function(e,t){if(t&&0!==t.trim().length){if(e=e.tagName.toLowerCase(),t=m(t),H.regex)try{return new RegExp(t,H.caseSensitive?"":"i").test(e)}catch(e){return}return H.caseSensitive?e===t:e===t.toLowerCase()}}(e,n))break;return;case"class":if(function(e,t){if(e.className&&"string"==typeof e.className&&t&&0!==t.trim().length){const o=e.className.split(/\s+/).filter(e=>e),a=m(t);if(H.regex)try{const n=new RegExp(a,H.caseSensitive?"":"i");return o.some(e=>n.test(m(e)))}catch(e){return}return o.some(e=>(e=m(e),H.caseSensitive?e.includes(a):e.toLowerCase().includes(a.toLowerCase())))}}(e,n))break;return;case"id":if(function(e,t){if(e.id&&t&&0!==t.trim().length){if(e=m(e.id),t=m(t),H.regex)try{return new RegExp(t,H.caseSensitive?"":"i").test(e)}catch(e){return}return H.caseSensitive?e.includes(t):e.toLowerCase().includes(t.toLowerCase())}}(e,n))break;return;case"attr":if(function(e,t,o){if(t&&0!==t.trim().length&&(e=e.attributes[t])){if(null===o)return 1;if(0!==o.trim().length){if(t=m(e.value),e=m(o),H.regex)try{return new RegExp(e,H.caseSensitive?"":"i").test(t)}catch(e){return}return H.caseSensitive?t.includes(e):t.toLowerCase().includes(e.toLowerCase())}}}(e,n,s))break;return;case"text":if(function(o,a,n=!1){if(a&&0!==a.trim().length){let e=(n?Array.from(o.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent.trim()).join(" "):o.textContent).trim(),t=a;if(!H.regex)return(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1)),e=m(e),t=m(t),e&&(H.wholeWords?(n="g"+(H.caseSensitive?"":"i"),new RegExp(`\\b${d(t)}\\b`,n).test(e)):H.caseSensitive?e.includes(t):e.toLowerCase().includes(t.toLowerCase()));(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1));try{H.accentSensitive||(e=m(e),t=m(t));var s=H.caseSensitive?"":"i";return new RegExp(t,s).test(e)}catch(o){console.error("❌ Regex Error:",o)}}}(e,n,o))break;return}}return 1}function N(e){if(e&&0!==e.trim().length){if(H.useTemplate&&l){var t=k(e);if(null===t)return I(),i=[],M(0,0);if(e=t,l.htmlMode)return w(e)}if(H.htmlMode)w(e);else{I(),i=[];const o=m(e);if(t=u(o)){e=function(e){for(var t,o=new Map,a=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:e=>{var t;return e.parentElement?.closest("#dom-scout-container")||(t=e.parentElement)&&["SCRIPT","STYLE"].includes(t.tagName)||!e.textContent.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});t=a.nextNode();){var n=m(t.textContent);e.test(n)&&(n=t.parentElement,o.set(n,(o.get(n)||0)+1)),e.lastIndex=0}return o}(t);const a=[];e.forEach((e,n)=>{!function(i){const r=[],e=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:e=>{var t;return e.parentElement?.closest("#dom-scout-container")||(t=e.parentElement)&&["SCRIPT","STYLE"].includes(t.tagName)||!e.textContent.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}}),t=[];for(var o;o=e.nextNode();){var a=m(o.textContent);i.lastIndex=0,i.test(a)&&t.push(o)}return t.forEach(e=>{const a=e.textContent;for(var t,o=m(a),n=(i.lastIndex=0,[]);null!==(t=i.exec(o));)n.push({index:t.index,length:t[0].length,text:a.substr(t.index,t[0].length)}),t.index===i.lastIndex&&i.lastIndex++;if(0<n.length){const s=document.createDocumentFragment();let o=0;n.forEach(e=>{e.index>o&&s.appendChild(document.createTextNode(a.substring(o,e.index)));var t=document.createElement("span");t.textContent=e.text,t.setAttribute("data-dom-scout-highlight","true"),s.appendChild(t),r.push(t),o=e.index+e.length}),o<a.length&&s.appendChild(document.createTextNode(a.substring(o))),e.parentNode.replaceChild(s,e)}}),r}(u(o)).forEach(e=>{a.push({span:e,parentElement:n,count:1,actionElement:null,isStarred:!1})})}),i=a,S(),M(i.length,r+1),0<i.length&&-1===r&&A(0)}else M(0,0)}}else I(),i=[],r=-1,M(0,0)}function S(){i.forEach((e,t)=>{v(e,t===r)})}function te(e,t,o,a,n,s){a?e.classList.add(_.ELEMENT_CURRENT):s?e.classList.add(_.ELEMENT_STAR):e.classList.add(_.ELEMENT_HIGHLIGHT);var i=document.createElement("div");i.className="dom-scout-badge",a?i.classList.add("dom-scout-badge-current"):s&&i.classList.add("dom-scout-badge-star"),i.textContent=1<o?t+` (${o}×)`:t,i.setAttribute("data-dom-scout-badge","true"),"static"===(s=window.getComputedStyle(e)).position&&(e.style.position="relative"),e.appendChild(i),n&&a&&((o=document.createElement("div")).className="dom-scout-action-badge",o.textContent="⚡ AÇÃO",o.setAttribute("data-dom-scout-action-badge","true"),e.appendChild(o))}function I(){var e=`.${_.ELEMENT_HIGHLIGHT}, .${_.ELEMENT_CURRENT}, .`+_.ELEMENT_STAR;document.querySelectorAll(e).forEach(e=>{e.classList.remove(_.ELEMENT_HIGHLIGHT,_.ELEMENT_CURRENT,_.ELEMENT_STAR)}),document.querySelectorAll('[data-dom-scout-highlight="true"]').forEach(e=>{var t=document.createTextNode(e.textContent);e.parentNode.replaceChild(t,e)}),document.querySelectorAll("*").forEach(e=>{e.closest("#dom-scout-container")||e.normalize()}),document.querySelectorAll("[data-dom-scout-badge], [data-dom-scout-action-badge]").forEach(e=>e.remove()),t=[]}function oe(){if(s&&O.value){const t=H.htmlMode?i[r]?.element:i[r]?.span;var e;(H.htmlMode?w:N)(O.value),0<i.length&&t&&(-1!==(e=i.findIndex(e=>H.htmlMode?e.element===t:e.span===t))?r=e:r>=i.length&&(r=Math.max(0,i.length-1)),i[r])&&A(r)}}function A(e){0!==i.length&&(i[r]&&v(i[r],!1),(r=(r=e)<0?i.length-1:r)>=i.length&&(r=0),e=i[r],H.htmlMode?(H.highlightAll?v(e,!0):(I(),te(e.element,r+1,e.count,!0,e.actionElement,e.isStarred)),e.element.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})):(v(e,!0),e.span&&e.span.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})),M(i.length,r+1))}function ae(){s?(oe(),0===i.length?B.textContent="Nenhum resultado":A(r+1)):R()}function ne(){s&&(oe(),0===i.length?B.textContent="Nenhum resultado":A(r-1))}function se(){var e,t;0!==i.length&&((e=i[r]).actionElement?(e.actionElement.click(),p("✔ Ação executada em "+e.actionElement.tagName.toLowerCase())):0<(t=(e=e.element).querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')).length?(t[0].click(),p("✔ Clicado em "+t[0].tagName.toLowerCase())):"BUTTON"===e.tagName||"A"===e.tagName?(e.click(),p("✔ Clicado em "+e.tagName.toLowerCase())):(e.click(),p("✔ Clique executado")))}function M(e,t){B.textContent=0===e?"Nenhum resultado":t+" de "+e}function R(){z.style.display="block",O.focus(),O.select(),s=!0,0<i.length&&S()}function ie(){z.style.display="none",I(),s=!1}O.addEventListener("input",e=>{r=-1,clearTimeout(c),c=setTimeout(()=>{(H.htmlMode?w:N)(e.target.value)},300)}),[j,F,K,V].forEach(e=>{e.addEventListener("change",e=>{var t=e.target.id.replace("opt-","").replace(/-./g,e=>e[1].toUpperCase());H[t]=e.target.checked,O.value&&(H.htmlMode?w:N)(O.value)})}),J.addEventListener("change",e=>{H.highlightAll=e.target.checked,O.value&&0<i.length&&(S(),i[r])&&A(r)}),Y.addEventListener("change",e=>{H.htmlMode=e.target.checked,x(),e.target.checked?(D.disabled=!1,D.parentElement.classList.remove("disabled"),q.style.display="inline-block"):(F.disabled=!1,F.parentElement.classList.remove("disabled"),D.checked&&(a=!0,D.checked=!1,H.useTemplate=!1,h()),D.disabled=!0,D.parentElement.classList.add("disabled"),g(!(q.style.display="none"))),h(),O.value&&N(O.value)}),D.addEventListener("change",e=>{H.useTemplate=e.target.checked,e.target.checked?l||(g(!0),p("💡 Selecione e carregue um template")):a||(O.value=""),h(),f(),y(),x(),e.target.checked&&O.value&&!a&&N(O.value),a=!1}),q.addEventListener("click",()=>{var e=document.getElementById("dom-scout-container");e.classList.contains("compact-mode")&&(e.classList.remove("compact-mode"),$.textContent="⬆️",$.setAttribute("title","Ocultar opções"),p("Modo normal - Templates disponível")),g(!o)}),Q.addEventListener("click",()=>{var e,t;(t=O.value.trim())?(e=prompt("Nome do template:",""))&&(e={name:e.trim(),query:t,htmlMode:H.htmlMode,timestamp:Date.now()},n.push(e),E(),y(),p("✔ Template salvo!"),g(!1)):p("❌ Digite uma query primeiro")}),X.addEventListener("click",()=>{var e;""===(e=U.value)?p("❌ Selecione um template"):(e=n[e])&&(H.useTemplate?(l=e,O.value="",O.disabled=!1,x(),h(),p("✔ Template ativo! Digite o valor")):(O.value=e.query,p("✔ Template carregado no campo!")),g(!1))}),Z.addEventListener("click",()=>{var e,t;""===(t=U.value)?p("❌ Selecione um template"):(e=n[t],confirm(`Excluir template "${e.name}"?`)&&(n.splice(t,1),E(),y(),l===e&&(l=null,h(),f()),p("✔ Template excluído!"),g(!1)))}),ee.addEventListener("click",()=>{g(!1)}),y(),e.addEventListener("click",()=>{O.value="",i=[],r=-1,I(),M(0,0),O.focus()}),W.addEventListener("click",()=>{ie()}),$.addEventListener("click",()=>{var e=document.getElementById("dom-scout-container");e.classList.contains("compact-mode")?(e.classList.remove("compact-mode"),$.textContent="⬆️",$.setAttribute("title","Ocultar opções"),p("Opções visíveis")):(o&&g(!1),e.classList.add("compact-mode"),$.textContent="⬇️",$.setAttribute("title","Mostrar opções"),p("Modo compacto ativado"))}),document.addEventListener("click",t=>{if(s){let e=null;if(!(e=t.target.hasAttribute("data-dom-scout-highlight")?i.find(e=>e.span===t.target):e)){const a=t.target.closest(`.${_.ELEMENT_HIGHLIGHT}, .`+_.ELEMENT_STAR);a&&(e=i.find(e=>e.element===a))}if(e){var o=i.indexOf(e);if(-1!==o){A(o);const n=H.htmlMode?e.element:e.span;n&&(n.style.transform="scale(1.05)",setTimeout(()=>{n.style.transform=""},200))}}}}),console.log("%c🔭 DOM Scout v4.3.2 - CORRIGIDO! ⚡","color: #667eea; font-size: 20px; font-weight: bold;"),console.log("%c┌────────────────────────────────────────────┐","color: #764ba2;"),console.log("%c🐛 CORREÇÃO IMPLEMENTADA:","color: #4ecdc4; font-size: 16px; font-weight: bold;"),console.log("%c└────────────────────────────────────────────┘","color: #764ba2;"),console.log("%c\n✅ Campo Vazio com Template Ativo","color: #ffd93d; font-weight: bold;"),console.log("  ✔ Busca NÃO é executada com campo vazio"),console.log("  ✔ processTemplateQuery() valida entrada"),console.log("  ✔ searchHTML() valida antes de processar"),console.log("  ✔ searchText() valida antes de processar"),console.log("%c\n🎯 Cenários Corrigidos","color: #ffd93d; font-weight: bold;"),console.log("  ✔ Exemplo 01: class:block text:#\\d*\\d* → NÃO BUSCA"),console.log("  ✔ Exemplo 02: class:block text:# → NÃO BUSCA"),console.log("  ✔ Exemplo 03: class:block text: → NÃO BUSCA (mantido)"),console.log("%c\n🔒 Validações Adicionadas","color: #ffd93d; font-weight: bold;"),console.log("  ✔ if (!query || query.trim().length === 0) return"),console.log("  ✔ processTemplateQuery() retorna null se vazio"),console.log("  ✔ hasEmptyTextFilters() detecta filtros vazios"),console.log("  ✔ matchText() valida textValue antes de buscar"),console.log("%c\n💡 Compatibilidade Total","color: #ffd93d; font-weight: bold;"),console.log("  ✔ Funcionalidades existentes: 100% preservadas"),console.log("  ✔ Templates, Regex, Opções: funcionando"),console.log("  ✔ Navegação, Highlights: sem regressões"),console.log("%c\n🎊 Problema RESOLVIDO com sucesso!","color: #667eea; font-size: 14px; font-weight: bold;")}}();

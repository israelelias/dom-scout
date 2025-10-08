# 🔭 DOM Scout

**O explorador definitivo de elementos web**

*Encontre qualquer coisa na sua página - texto, elementos, atributos - tudo em um lugar.*

[![Licença MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 O que é DOM Scout?

**DOM Scout** é uma ferramenta JavaScript poderosa que permite buscar e explorar elementos em qualquer página web de forma visual e intuitiva. Pense nele como um "Ctrl+F turbinado" que vai muito além de buscar apenas texto.

### ✨ Por que usar?

- 🔍 **Busca de Texto**: Encontre qualquer texto na página
- 🏷️ **Busca de Elementos HTML**: Procure por tags, classes, IDs, atributos
- 🎨 **Destaque Visual**: Veja onde os elementos estão com bordas animadas
- ⚡ **Super Rápido**: Resultados em tempo real enquanto você digita
- 🎯 **Navegação**: Pule entre resultados com Enter/Shift+Enter
- 🔧 **Altamente Configurável**: Regex, case-sensitive, acentos e mais

---

## 🚀 Instalação Rápida

### Método 1: Console do Navegador (Mais Rápido)

1. Abra qualquer site
2. Pressione **F12** para abrir DevTools
3. Vá na aba **Console**
4. Cole o código do `dom_scout.js`
5. Pressione **Enter**
6. Pronto! Use **Ctrl+Shift+F**

### Método 2: Bookmarklet (Permanente)

1. Crie um novo favorito na barra de favoritos
2. Edite o favorito
3. No campo URL, cole:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='URL_DO_SCRIPT_AQUI';document.body.appendChild(s);})();
```

4. Clique no favorito para ativar em qualquer página

### Método 3: Snippet (Reutilizável)

1. **F12** → Aba **Sources** (Fontes)
2. Painel **Snippets**
3. **+ New snippet**
4. Nomeie: `dom-scout`
5. Cole o código
6. **Ctrl+S** para salvar
7. Botão direito → **Run** (ou Ctrl+Enter)

### Método 4: Extensão de Navegador (Avançado)

1. Crie uma extensão com manifest.json
2. Injete o script via content_scripts
3. Sempre disponível em todas as páginas

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
| --- | --- |
| `Ctrl+Shift+F` | Abrir/Fechar DOM Scout |
| `Enter` | Próximo resultado |
| `Shift+Enter` | Resultado anterior |
| `ESC` | Fechar ferramenta |
| ◀ ▶ | Botões de navegação |

---

## 🎮 Como Usar

### 🔤 Modo Texto (Padrão)

Busca texto puro na página.

```
Digite: "Login"
Resultado: Destaca todos os elementos que contêm "Login"
```

**Opções disponíveis:**

- ✅ Regex
- ✅ Palavras Inteiras
- ✅ Case Sensitive (Aa)
- ✅ Com Acentos (À)
- ✅ Destacar Todas

### 🏷️ Modo HTML (Avançado)

Busca elementos por estrutura HTML.

Marque a opção **"🏷️ Buscar Elementos HTML"** e use a sintaxe:

#### Sintaxe Básica

```javascript
tag:div              // Busca <div> tags
class:btn            // Busca classes "btn"
id:header            // Busca ID "header"
attr:data-id         // Busca atributo "data-id"
attr:type=text       // Busca atributo com valor
text:Login           // Busca texto no elemento
```

#### Sintaxe Combinada

```javascript
// Botões com classe "primary"
tag:button class:primary

// Inputs de texto com classe "user-input"
tag:input attr:type=text class:user-input

// Links com texto específico
tag:a text:Clique class:link

// Elementos com múltiplos atributos
tag:div class:container class:active id:main
```

**Opções disponíveis:**

- ✅ Regex
- ❌ Palavras Inteiras (desabilitada)
- ✅ Case Sensitive (Aa)
- ✅ Com Acentos (À)
- ✅ Destacar Todas

---

## 💡 Exemplos Práticos

### 🔍 Testing & QA

```javascript
// Encontrar todos os botões de submit
🏷️ tag:button attr:type=submit

// Verificar inputs obrigatórios
🏷️ attr:required

// Encontrar links sem href
🏷️ tag:a attr:href=^$

// Botões desabilitados
🏷️ attr:disabled
```

### 🎨 Design & CSS

```javascript
// Elementos com classe específica
🏷️ class:btn-primary

// Divs com ID
🏷️ tag:div id:content

// Classes múltiplas
🏷️ class:flex class:justify-center class:items-center
```

### 🐛 Debugging

```javascript
// Elementos com data-attributes
🏷️ attr:data-component=modal

// Event handlers inline
🏷️ attr:onclick

// Elementos ocultos
🏷️ attr:hidden
```

### ♿ Acessibilidade

```javascript
// Imagens sem alt
🏷️ tag:img attr:alt=^$

// Inputs sem label (buscar depois verificar)
🏷️ tag:input

// Botões sem aria-label
🏷️ tag:button
```

### 🔥 Com Regex

```javascript
// Headers de qualquer nível (h1-h6)
🏷️ ✅ Regex: tag:h[1-6]

// Inputs de texto ou email
🏷️ ✅ Regex: tag:input attr:type=(text|email)

// Classes que começam com "btn-"
🏷️ ✅ Regex: class:^btn-

// Data-attributes com números
🏷️ ✅ Regex: attr:data-id=\d+

// Links externos
🏷️ ✅ Regex: tag:a attr:href=^https?://

// Links internos (relativos)
🏷️ ✅ Regex: tag:a attr:href=^/
```

### 📧 Buscar Emails na Página

```
✅ Regex (Modo Texto)
Digite: [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}
```

### 📞 Buscar Telefones

```
✅ Regex (Modo Texto)
Digite: \(\d{2}\)\s?\d{4,5}-?\d{4}
```

### 💰 Buscar Preços

```
✅ Regex (Modo Texto)
Digite: R\$\s?\d+[,.]?\d*
```

---

## 🎨 Visual & Interface

### Destaques Visuais

- **🔴 Borda Vermelha Pulsante**: Resultados encontrados
- **🟡 Borda Amarela Pulsante**: Resultado atual (onde você está)
- **🔢 Badge Numerado**: Número de cada resultado
- **✖️ Badge com Multiplicador**: Quantas vezes aparece

### Barra Superior

```
┌───────────────────────────────────────────────────────┐
│  [Campo de Busca]  ◀ ▶  [1 de 5]  [Limpar]  [Fechar]  │
│  🏷️ HTML  Regex  Palavras  Aa  À  Destacar Todas      │
└───────────────────────────────────────────────────────┘
```

---

## 🔧 Configuração Avançada

### Opções Detalhadas

#### 1. 🏷️ Buscar Elementos HTML

- **O que faz**: Muda de busca de texto para busca de elementos
- **Quando usar**: Quando precisa encontrar elementos específicos
- **Desabilita**: "Palavras Inteiras" (não faz sentido para HTML)

#### 2. Regex

- **Modo Texto**: Usa regex no texto da página
- **Modo HTML**: Usa regex nos valores (tags, classes, IDs, atributos)
- **Exemplo**: `h[1-6]` para headers, `\d+` para números

#### 3. Palavras Inteiras

- **Modo Texto**: Busca apenas palavras completas
- **Modo HTML**: Desabilitado
- **Exemplo**: "casa" NÃO encontra "casaco"

#### 4. Case Sensitive (Aa)

- **Modo Texto**: "Login" ≠ "login"
- **Modo HTML**: "UserProfile" ≠ "userprofile"
- **Útil para**: Classes camelCase, IDs específicos

#### 5. Com Acentos (À)

- **Modo Texto**: "café" ≠ "cafe"
- **Modo HTML**: "usuário" ≠ "usuario"
- **Desmarcado**: Ignora acentos na busca

#### 6. Destacar Todas

- **Marcado**: Mostra todos os resultados de uma vez
- **Desmarcado**: Mostra apenas o resultado atual
- **Performance**: Desmarque em páginas com muitos resultados

---

## 📊 Comparação com Outras Ferramentas

| Recurso | Ctrl+F Nativo | DevTools Search | **DOM Scout** |
| --- | --- | --- | --- |
| Busca de texto | ✅   | ✅   | ✅   |
| Busca de elementos | ❌   | ⚠️ Limitado | ✅   |
| Destaque visual | ✅   | ❌   | ✅ Animado |
| Navegação | ✅   | ⚠️ Básica | ✅ Avançada |
| Regex | ❌   | ✅   | ✅   |
| Case sensitive | ⚠️ Manual | ✅   | ✅   |
| Busca por atributos | ❌   | ⚠️ Complexo | ✅ Simples |
| Busca combinada | ❌   | ❌   | ✅   |
| Interface amigável | ✅   | ❌   | ✅   |
| Contador de resultados | ✅   | ❌   | ✅   |
| Atalhos de teclado | ✅   | ⚠️ Poucos | ✅ Completos |

---

## 🌐 Compatibilidade

### Navegadores Suportados

| Navegador | Versão Mínima | Status |
| --- | --- | --- |
| Chrome | 80+ | ✅ Completo |
| Firefox | 75+ | ✅ Completo |
| Edge | 80+ | ✅ Completo |
| Safari | 13+ | ✅ Completo |
| Opera | 67+ | ✅ Completo |
| Brave | Todas | ✅ Completo |

### APIs Utilizadas

- ✅ `TreeWalker` - Percorrer DOM
- ✅ `document.querySelectorAll()` - Buscar elementos
- ✅ `Element.classList` - Manipular classes
- ✅ `scrollIntoView()` - Navegação suave
- ✅ `compareDocumentPosition()` - Ordenar elementos
- ✅ `String.normalize()` - Remover acentos

---

## 🎯 Casos de Uso por Profissão

### 👨‍💻 Desenvolvedor Front-end

```javascript
// Verificar estrutura de componentes
🏷️ class:component class:active

// Debugar data-attributes
🏷️ attr:data-component

// Encontrar event handlers
🏷️ attr:onclick
```

### 🧪 QA / Tester

```javascript
// Verificar botões de submit
🏷️ tag:button attr:type=submit

// Encontrar campos obrigatórios
🏷️ attr:required

// Validar IDs únicos
🏷️ id:user-profile
```

### 🎨 Designer

```javascript
// Elementos com classes específicas
🏷️ class:btn-primary

// Verificar uso de cores
🏷️ attr:style (depois filtrar manualmente)

// Encontrar ícones
🏷️ class:icon
```

### ♿ Especialista em Acessibilidade

```javascript
// Imagens sem alt
🏷️ tag:img attr:alt=^$

// Botões sem aria-label
🏷️ tag:button (verificar depois)

// Links sem texto
🏷️ tag:a text:
```

### 📊 Analista de SEO

```javascript
// Encontrar headers
🏷️ tag:h1

// Links externos
🏷️ ✅ Regex: tag:a attr:href=^https?://

// Meta tags
🏷️ tag:meta
```

---

## 🔒 Segurança & Privacidade

✅ **100% Local**: Roda apenas no navegador, sem servidor  
✅ **Sem Coleta de Dados**: Não envia nada para lugar nenhum  
✅ **Sem Modificação**: Não altera o conteúdo da página  
✅ **Sem Interferência**: Não quebra funcionalidades do site  
✅ **Código Aberto**: Audite o código você mesmo  
✅ **Desativação Fácil**: ESC ou recarregar página

---

## 🐛 Solução de Problemas

### ❌ "Ctrl+Shift+F não funciona"

**Soluções:**

1. Verifique se o script foi carregado (veja mensagem no Console)
2. Alguns sites bloqueiam scripts externos
3. Tente usar um Snippet em vez do Console
4. Verifique se não há conflito com extensões

### ❌ "Não encontra nada"

**Soluções:**

1. Verifique se digitou pelo menos 2 caracteres
2. No Modo HTML, use a sintaxe correta: `tag:div`, `class:btn`
3. Desmarque "Case Sensitive" e "Com Acentos" para busca mais ampla
4. O elemento pode estar dentro de iframe (não funciona)

### ❌ "Regex não funciona"

**Soluções:**

1. Marque a opção "Regex"
2. Teste sua regex em sites como regex101.com
3. Escapa caracteres especiais: `\.` para ponto literal
4. Verifique mensagem de erro embaixo do campo

### ❌ "Muito lento"

**Soluções:**

1. Desmarque "Destacar Todas" para melhor performance
2. Seja mais específico na busca
3. Use busca combinada no Modo HTML
4. Páginas muito grandes podem demorar mais

### ❌ "Não funciona em iframe"

**Limitação conhecida:**

- DOM Scout não pode acessar conteúdo dentro de iframes por questões de segurança
- Abra o iframe em uma nova aba e use lá

---

## 💻 Desenvolvimento

### Estrutura do Código

```javascript
// Estado
let isVisible = false;
let highlightedElements = [];
let currentMatches = [];
let currentIndex = 0;
let searchOptions = { ... };

// Funções principais
createSearchUI()      // Cria interface
searchText()          // Busca texto
searchHTML()          // Busca elementos
parseHTMLQuery()      // Parse da sintaxe HTML
highlightElement()    // Destaca elementos
goToMatch()           // Navegação
```

### Personalizando

#### Mudar cores do highlight:

```javascript
// Linha ~95
outline: 3px solid #ff6b6b !important;    // Vermelho
outline: 3px solid #00ff00 !important;    // Verde

// Linha ~103
outline: 4px solid #ffd93d !important;    // Amarelo atual
outline: 4px solid #00bfff !important;    // Azul atual
```

#### Mudar gradiente da barra:

```javascript
// Linha ~33
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// Trocar para:
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

#### Mudar atalho de teclado:

```javascript
// Linha ~374
if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
// Trocar para Ctrl+K:
if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Aqui estão algumas ideias:

- [ ] Exportar resultados para CSV/JSON
- [ ] Histórico de buscas
- [ ] Salvar buscas favoritas
- [ ] Copiar seletor CSS do elemento
- [ ] Preview do HTML do elemento
- [ ] Modo dark/light
- [ ] Internacionalização (i18n)
- [ ] Suporte para Shadow DOM
- [ ] Busca em iframes (se possível)
- [ ] Estatísticas de uso

---

## 📝 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir!

---

## 📞 Suporte

- 🐛 **Bugs**: Abra uma issue no GitHub
- 💡 **Ideias**: Compartilhe suas sugestões
- 📖 **Documentação**: Leia este README completo
- 💬 **Dúvidas**: Use as Discussions do GitHub

---

## 🏆 Créditos

Criado com ❤️ para tornar a exploração do DOM mais fácil e visual.

**DOM Scout** - *Explore, Encontre, Conquiste o DOM*

---

## 🎓 Recursos Adicionais

### Tutoriais em Vídeo

- [ ] Como usar DOM Scout (Básico)
- [ ] Busca avançada com Regex
- [ ] Testing com DOM Scout
- [ ] Debugging de Acessibilidade

### Artigos

- [ ] 10 truques com DOM Scout
- [ ] Regex úteis para web
- [ ] Automação de testes
- [ ] Auditoria de SEO

---

**⭐ Se gostou, dê uma estrela no GitHub! ⭐**

[🔭 GitHub](https://github.com) • [📖 Docs](https://github.com) • [🐛 Issues](https://github.com) • [💡 Discussions](https://github.com)

---

## 📊 Estatísticas

```
📦 Tamanho: ~15KB minificado
⚡ Performance: <100ms em páginas médias
🌍 Idioma: Português (BR) com suporte para outros idiomas
🔧 Dependências: 0 (zero!)
✅ Testes: Compatível com 5+ navegadores
```

---

## 🎉 Changelog

### v2.0.0 (Atual)

- ✨ Modo HTML com busca de elementos
- ✨ Sintaxe combinada (múltiplos critérios)
- ✨ Suporte completo a Regex em ambos modos
- ✨ Navegação entre resultados
- ✨ Badges numerados e multiplicadores
- 🎨 Interface gradiente moderna
- ⚡ Performance otimizada

### v1.0.0

- 🔍 Busca de texto básica
- ✨ Highlight visual
- ⌨️ Atalhos de teclado
- 🎨 Interface inicial

---

**Feito com ☕ café e 💻 código**

*"Um bom scout sempre encontra o caminho"* 🔭

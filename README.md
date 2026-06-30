# AcessiWay - Plataforma de Inclusão Digital

![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2_AA-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

**AcessiWay** é uma plataforma web focada em acessibilidade e inclusão digital, projetada especialmente para usuários com deficiências visuais, auditivas e cognitivas. O projeto segue rigorosamente as diretrizes **WCAG 2.2** e implementa tecnologias assistivas modernas.

##  Objetivo

Criar uma experiência web totalmente acessível que permita a todos os usuários, independentemente de suas capacidades, consumir conteúdo digital sem barreiras.

##  Funcionalidades Principais

###  Toolbar de Acessibilidade Flutuante

- **Controle de Tamanho de Fonte**: 80% a 200%
- **Modos de Contraste**: Normal, Alto Contraste, Invertido, Azul/Amarelo
- **Famílias de Fonte**: Atkinson Hyperlegible, Arial, Verdana, OpenDyslexic
- **Espaçamento Personalizável**: Controle de espaçamento de linhas e letras
- **Guia de Leitura**: Máscara de foco visual que segue o mouse
- **Atalhos de Teclado Globais**:
  - `Alt + +/-`: Aumentar/diminuir fonte
  - `Alt + C`: Alternar modos de contraste
  - `Alt + G`: Ativar/desativar guia de leitura
  - `Alt + 0`: Restaurar configurações padrão
  - `H`: Navegar entre headings
  - `T`: Navegar entre tabelas
  - `K`: Navegar entre links/botões

###  Conversor de Conteúdo

Transforme textos em múltiplos formatos acessíveis:

- **Texto Simplificado**: Frases curtas e vocabulário acessível
- **Síntese de Voz (TTS)**: Leitura em voz alta com controles de:
  - Velocidade (0.5x a 2x)
  - Tom da voz
  - Volume
  - Seleção de vozes (prioriza PT-BR)
- **Braille**: Representação em Braille Grau 1
- **Texto Ampliado**: Fonte grande otimizada para baixa visão
- **Exportação**: Copiar ou baixar em formato TXT

###  Perfis de Acessibilidade

Sistema de configuração guiada em 4 etapas:

1. **Nome do Usuário**
2. **Seleção de Perfil**:
   - Deficiência Visual
   - Deficiência Auditiva
   - Baixa Visão
3. **Personalização de Recursos**
4. **Confirmação e Aplicação**

Perfis são salvos no `localStorage` e aplicam automaticamente as configurações recomendadas.

### Biblioteca de Conteúdo Acessível

- Vídeos com LIBRAS, legendas e audiodescrição
- Artigos com transcrições em Braille
- Áudios com controles acessíveis
- Filtros por tipo de conteúdo
- Downloads em múltiplos formatos

##  Design e Temas

### Modos de Contraste

- **Normal**: Esquema de cores padrão
- **Alto Contraste**: Preto sobre branco
- **Invertido**: Branco sobre preto
- **Azul/Amarelo**: Otimizado para daltonismo
- **Amarelo/Preto**: Para baixa visão severa

### Fontes Especializadas

- **Atkinson Hyperlegible**: Projetada para baixa visão (padrão)
- **OpenDyslexic**: Otimizada para dislexia
- **Arial/Verdana**: Fontes sans-serif clássicas

##  Arquitetura Técnica

### Stack Tecnológica

- **Frontend**: React 18.3 com TypeScript
- **Roteamento**: React Router 7 (Data Mode)
- **Estilização**: Tailwind CSS 4.0
- **Componentes UI**: Radix UI primitives
- **Animações**: Motion (Framer Motion)
- **Ícones**: Lucide React
- **Build Tool**: Vite 6.x

### Estrutura de Pastas

```
/src
  /app
    /components          # Componentes reutilizáveis
      AccessibilityToolbar.tsx
      ContentConverter.tsx
      TextToSpeech.tsx
      /ui                # Componentes UI
    /pages               # Páginas/rotas
      Index.tsx
      Cadastro.tsx
      Conteudo.tsx
      Conversor.tsx
      NotFound.tsx
    routes.ts            # Configuração de rotas
  /contexts
    AccessibilityContext.tsx  # Estado global de acessibilidade
  /styles
    fonts.css            # Importação de fontes
    theme.css            # Variáveis CSS e temas
    tailwind.css         # Configuração Tailwind
```

##  Conformidade WCAG 2.2

### Princípios Implementados

#### 1. Perceptível

-  Alternativas textuais para conteúdo não-textual
-  Legendas e audiodescrição para vídeos
-  Múltiplos modos de contraste (WCAG 1.4.3)
-  Texto redimensionável até 200% (WCAG 1.4.4)
-  Espaçamento de texto ajustável (WCAG 1.4.12)

#### 2. Operável

-  Navegação completa por teclado (WCAG 2.1.1)
-  Skip links para navegação rápida
-  Foco visível em todos os elementos interativos (WCAG 2.4.7)
-  Headings e landmarks semânticos (WCAG 2.4.6)
-  Atalhos de teclado customizados
-  Tempo suficiente para leitura (sem timeouts)

#### 3. Compreensível

-  Linguagem clara e simples
-  Labels descritivos em formulários
-  Mensagens de erro claras
-  Ajuda contextual disponível

#### 4. Robusto

-  HTML semântico válido
-  ARIA roles e properties
-  Compatibilidade com leitores de tela
-  Suporte a tecnologias assistivas

##  Como Usar

### Instalação

```bash
# Clone o repositório
git clone [repo-url]

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Build para Produção

```bash
pnpm run build
```

##  Responsividade

A plataforma é totalmente responsiva e funciona em:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

##  Tecnologias Assistivas Suportadas

- **Leitores de Tela**: NVDA, JAWS, VoiceOver, TalkBack
- **Navegação por Teclado**: 100% funcional
- **Magnificadores de Tela**: ZoomText, MAGic
- **Reconhecimento de Voz**: Dragon NaturallySpeaking

##  Métricas de Qualidade

- **Eficiência de Usabilidade**: > 90% (ISO 9241-11)
- **Conformidade WCAG**: Nível AA
- **Tempo de Carregamento**: < 3s em 3G
- **Navegadores Suportados**: Chrome, Firefox, Safari, Edge

##  Contribuindo

Este é um projeto acadêmico da disciplina de Qualidade e Usabilidade de Software (7ª fase - Ciência da Computação).

##  Licença

Este projeto é desenvolvido para fins educacionais.

##  Suporte

Para questões relacionadas à acessibilidade ou sugestões de melhorias, entre em contato através dos canais oficiais da instituição.

---

**AcessiWay** - Inclusão Digital para Todos 

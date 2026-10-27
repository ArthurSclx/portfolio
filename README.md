# Portfólio profissional + Cybersecurity

Site estático com duas páginas e duas identidades visuais, preparado para publicação no GitHub Pages.

## Estrutura

```text
portfolio-duplo/
├── index.html                 # Portfólio geral
├── cybersecurity/
│   └── index.html             # Página dedicada a Cybersecurity
├── assets/
│   ├── css/
│   │   ├── style.css          # Estilos do portfólio geral
│   │   └── cyber.css          # Estilos adicionais da página Cybersecurity
│   ├── js/
│   │   ├── app.js             # Menu mobile, animações suaves e ano automático
│   │   └── cyber.js           # Interações da área técnica
│   └── img/                   # Adicione imagens e avatar aqui
├── 404.html
└── .nojekyll
```

## Antes de publicar

1. Pesquise nos arquivos por `Seu Nome`, `SN`, `seu-usuario`, `seu.email@exemplo.com` e substitua pelos seus dados.
2. Troque os projetos demonstrativos por projetos que você realmente desenvolveu. Inclua objetivo, problema, tecnologias, seu papel, resultado e link para código ou documentação.
3. Adicione cursos e certificações somente com o status correto (concluído, em andamento, etc.). Se existir credencial pública, acrescente o link de validação.
4. Atualize os links do LinkedIn, GitHub e e-mail.
5. Revise todo o conteúdo antes de torná-lo público. Não publique senhas, tokens, chaves, dados pessoais, IPs internos, nomes de clientes, topologia de rede da empresa, logs reais ou capturas de tela com informações confidenciais. Para write-ups técnicos, use ambientes de laboratório próprios ou autorizados e sanitize as evidências.

## Testar localmente

Abra a pasta no VS Code e use uma extensão de servidor local (por exemplo, Live Server). Acesse a página principal e navegue até `cybersecurity/`. Também é possível abrir os arquivos HTML diretamente, mas um servidor local é mais próximo do ambiente publicado.

## Publicar pelo GitHub Pages

### Opção A — URL pessoal recomendada

1. Crie um repositório público chamado exatamente `SEU-USUARIO.github.io`.
2. Envie o conteúdo desta pasta para a raiz do repositório (o `index.html` precisa ficar na raiz).
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch principal (`main`) e a pasta `/(root)`, depois salve.
5. Após o deploy, a página geral ficará em `https://SEU-USUARIO.github.io/` e a página Cybersecurity em `https://SEU-USUARIO.github.io/cybersecurity/`.

### Opção B — repositório com outro nome

Se o repositório se chamar, por exemplo, `portfolio`, as URLs padrão serão `https://SEU-USUARIO.github.io/portfolio/` e `https://SEU-USUARIO.github.io/portfolio/cybersecurity/`. Os links internos deste template são relativos para facilitar essa estrutura.

O primeiro deploy pode levar alguns minutos. Consulte a guia **Actions** e a área **Settings → Pages** se a publicação não aparecer.

## Personalização visual

- Paleta principal: variáveis CSS no início de `assets/css/style.css`.
- Paleta Cybersecurity: variáveis no início de `assets/css/cyber.css`.
- O site usa HTML, CSS e JavaScript puro, sem build, backend ou dependências de npm.
- Os efeitos de entrada respeitam a preferência de movimento reduzido do sistema.

## Aviso sobre conteúdo demonstrativo

Os cartões de projeto, laboratórios e formação deste repositório são modelos para personalização. Eles não afirmam que os projetos ou cursos já foram concluídos.

export const languages = ["pt", "en", "zh"] as const;

export type Language = (typeof languages)[number];

export function getLanguage(value?: string): Language {
  return languages.includes(value as Language) ? (value as Language) : "pt";
}

export function localizedHref(lang: Language, anchor = "") {
  return `/?lang=${lang}${anchor}`;
}

export function localizedPath(lang: Language, path: string) {
  return `${path}?lang=${lang}`;
}

export const copy = {
  pt: {
    languageName: "Português",
    languageMenuLabel: "Idioma",
    whatsappAriaLabel: "Falar no WhatsApp",
    header: {
      brandLabel: "China Brasil",
      menuLabel: "Menu",
      nav: [
        { href: "/news", label: "Notícias" },
        { href: "#como-funciona", label: "Como funciona" },
        { href: "#servicos", label: "Serviços" },
        { href: "/catalogo", label: "Catálogo" },
        { href: "#diferenciais", label: "Diferenciais" },
        { href: "#casos", label: "Casos" },
      ],
      ctaLabel: "Falar com nosso time",
      ctaMessage: "Olá, quero solicitar uma cotação internacional.",
    },
    showcase: {
      title: "Consultoria\nInternacional",
      description:
        "Soluções estruturadas para empresas que desejam importar, exportar e operar no mercado global com segurança, estratégia e escala.",
    },
    hero: {
      title: "Trading, Sourcing & Comércio Internacional",
      description:
        "Soluções estruturadas para empresas que desejam importar, exportar e operar no mercado global com segurança, estratégia e escala.",
      primaryCtaLabel: "Catálogos",
      primaryCtaMessage: "Olá, quero falar com o time da ATC.",
      secondaryCtaLabel: "Notícias",
      stats: [
        { value: "+R$1 BILHÃO", label: "em operações e valores negociados" },
        {
          value: "+1 MILHÃO",
          label: "em toneladas de commodities negociadas internacionalmente",
        },
        { value: "+3.000", label: "empresas e clientes atendidos" },
      ],
    },
    howItWorks: {
      eyebrow: "Como funciona",
      title: "Inteligência operacional aplicada ao comércio internacional",
      description:
        "Estruturamos cada operação para reduzir risco, aumentar previsibilidade e garantir mais controle em todas as etapas do processo internacional.",
      steps: [
        {
          title: "Diagnóstico Estratégico & Viabilidade",
          desc: "Analisamos produto, demanda, margem, mercado, tributação, logística e viabilidade comercial da operação.",
        },
        {
          title: "Sourcing Internacional, Validação & Negociação",
          desc: "Localizamos fabricantes homologados, realizamos validações estratégicas e negociamos diretamente na origem.",
        },
        {
          title: "Gestão Logística, Desembaraço & Entrega Final",
          desc: "Coordenamos documentação, frete internacional, desembaraço aduaneiro e acompanhamento operacional até a entrega final da carga.",
        },
      ],
      highlightTitle: "Governança, controle e execução em cada decisão",
      highlight:
        "Cada etapa é planejada para oferecer clareza operacional, proteção comercial e acompanhamento estratégico antes, durante e após a negociação internacional.",
      highlightMetrics: [
        {
          title: "Visibilidade",
          desc: "Acompanhamento claro da operação, custos, fornecedores e etapas do processo.",
        },
        {
          title: "Controle",
          desc: "Gestão estruturada da negociação, documentação, validações e execução operacional.",
        },
        {
          title: "Segurança",
          desc: "Atuação preventiva para reduzir riscos comerciais, logísticos e operacionais.",
        },
      ],
    },
    services: {
      eyebrow: "Serviços",
      title: "Soluções estratégicas para operações internacionais",
      description:
        "Atuamos de forma consultiva, comercial e operacional para empresas que precisam importar, exportar ou estruturar operações globais com mais segurança, margem e previsibilidade.",
      items: [
        {
          title: "Importação Eficaz End-to-End",
          desc: "Estruturamos toda a operação internacional, desde o planejamento até a entrega final da carga.",
        },
        {
          title: "Sourcing Internacional & Desenvolvimento na China",
          desc: "Localizamos fabricantes homologados e desenvolvemos fornecedores alinhados ao perfil técnico, comercial e estratégico da operação.",
        },
        {
          title: "Intermediação Internacional de Negócios",
          desc: "Conectamos empresas, compradores, fornecedores e parceiros estratégicos em operações internacionais estruturadas.",
        },
        {
          title: "Exportação & Commodities",
          desc: "Estruturamos operações internacionais para commodities e produtos brasileiros com foco em escala, previsibilidade e conexão global.",
        },
      ],
    },
    operationModels: {
      eyebrow: "Modelos de operação",
      title:
        "Estrutura comercial adaptada ao nível de suporte que sua operação exige",
      description:
        "Atuamos tanto como parceiro estratégico na intermediação quanto na execução integral da importação, conforme a maturidade e o objetivo do seu negócio.",
      items: [
        {
          title: "Consultoria + intermediação",
          desc: "Estruturamos a operação, validamos fornecedores e conduzimos a negociação para empresas que já possuem time interno e precisam de inteligência local para executar com segurança.",
          highlight:
            "Ideal para quem quer manter controle interno com suporte estratégico.",
        },
        {
          title: "Importação completa (chave na mão)",
          desc: "Assumimos o fluxo completo da operação internacional, do planejamento ao destino final, com gestão integrada de sourcing, produção, qualidade, logística e documentação.",
          highlight:
            "Modelo indicado para empresas que buscam escala com previsibilidade operacional.",
        },
      ],
    },
    differentials: {
      eyebrow: "Diferenciais",
      title: "Estrutura global + inteligência operacional",
      description:
        "A operação combina presença internacional, execução local e governança comercial para reduzir risco em negociações globais.",
      imageAlt: "Navio cargueiro com containers",
      items: [
        {
          title: "Presença internacional real",
          desc: "Equipe e operações entre China, Brasil e hubs estratégicos internacionais.",
        },
        {
          title: "Acesso direto à origem",
          desc: "Relacionamento com fábricas e negociação sem intermediários.",
        },
        {
          title: "Segurança jurídica internacional",
          desc: "Contratos estruturados no país de origem com proteção operacional.",
        },
        {
          title: "Capacidade de operações complexas",
          desc: "Experiência com projetos industriais, commodities e contratos de grande escala.",
        },
      ],
    },
    cases: {
      eyebrow: "Casos e projetos",
      title: "Experiência aplicada em operações que exigem lastro real",
      description:
        "Atuação em projetos industriais, exportações estruturadas e operações internacionais que demandam execução precisa.",
      items: [
        {
          title: "Projeto com indústria automotiva",
          desc: "Coordenação internacional para atendimento de demanda industrial com critérios técnicos, validação de fornecedor e controle de risco operacional.",
        },
        {
          title: "Exportação de commodities",
          desc: "Estruturação de operações internacionais para produtos brasileiros, com alinhamento comercial, documentação e execução logística ponta a ponta.",
        },
        {
          title: "Operações industriais complexas",
          desc: "Gestão de projetos com múltiplas etapas, fornecedores homologados e acompanhamento rigoroso de produção, conformidade e entrega.",
        },
      ],
    },
    audience: {
      eyebrow: "Para quem é",
      title:
        "A ATC opera para empresas e projetos que tratam comércio internacional como estratégia",
      profileLabel: "Perfil",
      items: [
        {
          title: "Indústrias",
          desc: "Para empresas que precisam de fornecimento internacional confiável, padronização técnica e escala operacional.",
        },
        {
          title: "Distribuidores",
          desc: "Para operações que buscam margem, previsibilidade de abastecimento e acesso direto à origem.",
        },
        {
          title: "Importadores",
          desc: "Para negócios que querem reduzir risco, validar fornecedores e profissionalizar a cadeia internacional.",
        },
      ],
    },
    authorityMedia: {
      eyebrow: "Em campo",
      title: "Operação real, presença internacional e execução comprovada",
      description:
        "Registros de operações, visitas técnicas e acompanhamento direto em ambientes industriais e logísticos.",
      imageAlt: "Registro de operação internacional da ATC",
    },
    news: {
      eyebrow: "Notícias",
      title: "Mercado e economia em tempo real",
      description:
        "Acompanhe as principais notícias sobre mercados, empresas, commodities e indicadores que impactam decisões internacionais.",
      sourceLabel: "Ver no InfoMoney",
      readMoreLabel: "Ler notícia",
      emptyLabel: "Notícias indisponíveis no momento.",
      feedTabs: {
        latest: "Últimas notícias",
        imports: "Importações",
        exports: "Exportações",
        commodities: "Commodities",
      },
    },
    stats: {
      eyebrow: "Autoridade",
      title: "Números que sustentam nossa operação",
      description:
        "Resultados construídos em operações internacionais reais, com capacidade de execução em diferentes mercados e níveis de complexidade.",
      items: [
        { value: "+1M", label: "toneladas exportadas" },
        { value: "+3.000", label: "clientes atendidos" },
        { value: "+R$1bi", label: "em valor negociado" },
      ],
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Respostas objetivas para decisões internacionais mais seguras",
      items: [
        {
          question: "A ATC atua apenas com importação da China?",
          answer:
            "Não. A operação tem forte presença na China, mas também estruturamos exportações brasileiras e intermediações internacionais em diferentes mercados.",
        },
        {
          question:
            "Vocês podem operar desde a busca do fornecedor até a entrega final?",
          answer:
            "Sim. No modelo chave na mão, conduzimos planejamento, sourcing, validação, negociação, produção, qualidade, logística, desembaraço e entrega.",
        },
        {
          question:
            "A empresa atende projetos industriais e operações complexas?",
          answer:
            "Sim. A atuação inclui operações industriais, commodities e projetos com exigência técnica, documental e contratual mais elevada.",
        },
        {
          question: "É possível contratar apenas consultoria ou intermediação?",
          answer:
            "Sim. Também atuamos em formato consultivo e de intermediação para empresas que já possuem equipe interna e precisam de suporte estratégico na origem.",
        },
        {
          question: "Como iniciar uma análise da minha operação?",
          answer:
            "O primeiro passo é falar com a equipe pelo WhatsApp para apresentar produto, volume, objetivo e estágio atual da operação. A partir disso, definimos o melhor modelo de atuação.",
        },
      ],
    },
    cta: {
      title: "Pronto para importar com segurança e escala?",
      description:
        "Fale com nosso time da ATC China Brasil e receba um diagnóstico gratuito do seu projeto.",
      quoteLabel: "Solicitar cotação internacional",
      quoteMessage: "Olá, quero solicitar uma cotação internacional.",
      specialistLabel: "Falar com nosso time",
      specialistMessage: "Olá, quero falar com o time da ATC.",
    },
    leadForm: {
      eyebrow: "Primeiro passo",
      title: "Conte para a gente o que sua empresa busca.",
      description:
        "Responda algumas perguntas rápidas e envie direto para o nosso time pelo WhatsApp. Com essas informações, chegamos à conversa já preparados para o seu caso.",
      whatsappLabel: "WhatsApp",
      emailLabel: "E-mail",
      formTitle: "Fale com nosso time",
      formDescription:
        "Preencha os campos abaixo. Ao enviar, abrimos o WhatsApp com a mensagem pronta para você revisar.",
      fields: {
        company: { label: "Nome da empresa", placeholder: "Nome da sua empresa" },
        name: { label: "Seu nome", placeholder: "Como podemos te chamar?" },
        phone: { label: "WhatsApp", placeholder: "(00) 00000-0000" },
        email: { label: "E-mail", placeholder: "voce@suaempresa.com" },
      },
      importStatus: {
        label:
          "Sua empresa já realiza operações internacionais ou compra apenas de fornecedores no Brasil?",
        options: [
          "Já importamos",
          "Já importamos anteriormente",
          "Compramos apenas no Brasil",
          "Não importamos",
        ],
      },
      operationType: {
        label: "O seu foco atual é voltado para importação ou exportação?",
        options: [
          "Importação (trazer produtos/insumos de fora para o Brasil)",
          "Exportação (levar produtos nacionais para o mercado externo)",
          "Ambos / Preciso de suporte nas duas pontas",
        ],
      },
      segments: {
        label: "Quais produtos ou segmentos têm maior giro na sua empresa?",
        hint: "Selecione as principais opções abaixo ou especifique no campo “Outro”.",
        options: [
          "Componentes e Maquinário Industrial (automação, peças e ferramentas)",
          "Matéria-prima e Insumos Químicos / Plásticos",
          "Têxtil, Tecidos e Aviamentos",
          "Eletrônicos, Componentes de TI e Tecnologia",
          "Embalagens (Papelão, Plástico, Biodegradáveis)",
          "Ferragens, Aço, Alumínio e Perfis Metálicos",
          "Artigos de Iluminação (Luminárias LED, Refletores e Painéis)",
          "Casa, Decoração e Utilidades Domésticas",
          "Brinquedos, Utilidades e Produtos de Varejo Geral",
          "Alimentos, Bebidas e Insumos do Agronegócio",
        ],
        otherLabel: "Outro produto ou segmento",
        otherPlaceholder: "Especifique o produto ou segmento",
        otherMessageLabel: "Outro",
      },
      questions: {
        frequentPurchases: {
          label:
            "Quais produtos vocês compram ou precisam repor com mais frequência?",
          placeholder: "Ex.: cabos, embalagens, matéria-prima...",
        },
        competitiveProduct: {
          label:
            "Qual produto ou insumo você gostaria de comprar com condições mais competitivas?",
          placeholder: "Ex.: fones bluetooth, ferramentas, máquinas...",
        },
      },
      requiredError: "Preencha este campo.",
      selectError: "Selecione uma opção.",
      segmentsError: "Selecione ao menos uma opção ou especifique em “Outro”.",
      phoneError: "Informe um WhatsApp válido com DDD.",
      emailError: "Informe um e-mail válido.",
      optionalLabel: "opcional",
      privacyNote:
        "Nada fica salvo no site: suas respostas vão direto em mensagem que você envia ao WhatsApp.",
      submitLabel: "Enviar para nosso time e falar no WhatsApp",
      messageIntro: "Olá, equipe ATC! Preenchi o formulário do site:",
    },
    diagnosis: {
      title: {
        start: "Descubra o perfil de importador da sua empresa e ",
        highlight: "ganhe uma sessão de viabilidade",
        end: ".",
      },
      description:
        "Conte sua principal dúvida sobre importação e um pouco do que sua empresa precisa. No final, você descobre seu perfil de importador e desbloqueia acesso direto à China com o time da ATC.",
      tagline: "Sem custo e sem compromisso.",
      startLabel: "Fazer meu diagnóstico",
      steps: {
        eyebrow: "Leva poucos minutos",
        title: "Veja como funciona",
        items: [
          {
            title: "Responda às perguntas",
            description: "Sobre suas dúvidas, o momento e os objetivos da sua empresa.",
          },
          {
            title: "Descubra seu perfil",
            description: "Mostramos qual dos 4 perfis de importador é o seu.",
          },
          {
            title: "Resgate seu prêmio",
            description: "Uma sessão de viabilidade com o nosso time, sem custo.",
          },
        ],
      },
      rewardSection: {
        title: "O seu prêmio",
        description:
          "Ao concluir o diagnóstico, sua empresa desbloqueia uma sessão de viabilidade com o time da ATC.",
        items: [
          {
            title: "Análise preliminar da operação",
            description: "Custos, prazos e riscos de importar o que você precisa.",
          },
          {
            title: "Mapeamento de fornecedores",
            description: "Fábricas na China alinhadas ao que sua empresa busca.",
          },
          {
            title: "Acesso direto à China",
            description: "Negociação na origem, com presença local da ATC.",
          },
        ],
      },
      profilesLabel: "Os 4 perfis de importador",
      profilesDescription:
        "Seu resultado mostra em qual deles a sua empresa está hoje.",
      trustTitle: "Com a confiança de mais de 3.000 empresas",
      progressLabel: "Pergunta {current} de {total}",
      backLabel: "Voltar",
      pathQuestion: {
        question: "O que você quer entender melhor?",
        options: [
          {
            title: "Importação",
            description: "Comprar produtos de outros países e trazê-los para o Brasil.",
          },
          {
            title: "Exportação",
            description: "Vender produtos do Brasil para outros países.",
          },
        ],
        soonLabel: "Em breve",
      },
      questions: [
        {
          question: "Antes de importar, qual destas perguntas você mais gostaria de ver respondida?",
          options: [
            "Quanto o produto realmente vai custar até chegar à minha empresa?",
            "Como encontrar um fornecedor confiável e conferir a qualidade do produto?",
            "Como funciona uma importação na prática e por onde começar?",
            "Será que importar vale a pena para o meu negócio?",
          ],
        },
        {
          question: "O que mais preocupa você ao importar da China?",
          options: [
            "Os custos ficarem maiores que o esperado.",
            "O fornecedor não entregar o combinado.",
            "A mercadoria atrasar.",
            "Não saber como funciona o processo.",
          ],
        },
        {
          question: "Nos próximos 12 meses, sua empresa pretende:",
          options: [
            "Fazer a primeira importação.",
            "Reduzir custos das importações atuais.",
            "Desenvolver produtos personalizados ou com marca própria.",
            "Entender o processo antes de decidir.",
          ],
        },
        {
          question: "Qual destas opções descreve o que sua empresa pretende importar?",
          options: [
            "Uma pequena quantidade para testar o mercado.",
            "Pedidos frequentes para repor o estoque.",
            "Um grande volume, como um contêiner completo.",
            "Ainda não defini a quantidade nem o investimento.",
          ],
        },
      ],
      resultEyebrow: "Seu perfil",
      profiles: [
        {
          name: "Importador Explorador",
          focus: "Iniciante estratégico",
          meaning:
            "Empresa com alto potencial de crescimento que ainda compra no mercado interno ou está dando os primeiros passos.",
          summary:
            "Você busca validar a viabilidade financeira e começar com segurança total, sem correr riscos com burocracia ou fornecedores desconhecidos. O seu maior ganho imediato é sair da dependência de distribuidores locais.",
        },
        {
          name: "Importador Otimizador",
          focus: "Foco em margem e eficiência",
          meaning:
            "Empresa que já conhece o mercado ou já importa, mas sente que está deixando dinheiro na mesa com custos altos ou intermediários.",
          summary:
            "O seu foco é cortar atravessadores, negociar direto na fonte (China) e transformar a operação atual para capturar margens de 2x a 3x com previsibilidade logística.",
        },
        {
          name: "Importador Construtor de Marca",
          focus: "OEM / exclusividade",
          meaning:
            "Empresa visionária que quer diferenciar seu portfólio com produtos exclusivos, personalização ou marca própria.",
          summary:
            "Você precisa de homologação rigorosa de fábricas, controle de qualidade na origem e desenvolvimento técnico para lançar produtos únicos no mercado brasileiro.",
        },
        {
          name: "Importador de Alta Escala",
          focus: "Volume e contêiner",
          meaning:
            "Operação robusta (indústria, atacado ou grande distribuidor) focada em volume, reposição contínua e poder de compra.",
          summary:
            "O seu objetivo é eficiência máxima de ponta a ponta: auditoria fabril, consolidação de cargas, redução tributária/logística e fornecimento ininterrupto direto das maiores fábricas chinesas.",
        },
      ],
      reward: {
        badge: "Benefício desbloqueado",
        title:
          "Parabéns! Você desbloqueou uma sessão de viabilidade e acesso direto à China",
        description:
          "Com base no seu perfil, nossa equipe liberou uma Análise Preliminar de Operação + Mapeamento de Fornecedores sem custo para a sua empresa.",
        submitLabel: "Enviar respostas e resgatar no WhatsApp",
        sentTitle: "Falta só enviar!",
        sentDescription:
          "Abrimos o WhatsApp com tudo preenchido. É só enviar a mensagem para o nosso time.",
        reopenLabel: "Abrir o WhatsApp novamente",
        prizeLine: "Você também está concorrendo a R$ 10 mil para sua importação.",
      },
      restartLabel: "Refazer diagnóstico",
      analyzingTitle: "Calculando seu perfil…",
      completedEyebrow: "Seu resultado",
      openResultLabel: "Ver resultado e resgatar benefício",
      closeLabel: "Fechar",
      requiredError: "Preencha este campo.",
      messageIntro:
        "Olá, equipe ATC! Fiz o Diagnóstico de Importação e quero resgatar minha Sessão de Viabilidade.",
      profileMessageLabel: "Perfil",
      answersMessageLabel: "Respostas",
      contactMessageLabel: "Contato",
      prizeMessageLabel: "Concorrer aos R$ 10 mil",
      yesLabel: "Sim",
      noLabel: "Não",
      intake: {
        continueLabel: "Continuar",
        numberLocale: "pt-BR",
        optionalLabel: "Opcional",
        singleHint: "Selecione uma opção.",
        multiHint: "Pode selecionar mais de uma opção.",
        textPlaceholder: "Escreva sua resposta",
        otherPlaceholder: "Conte qual é",
        submitLabel: "Finalizar e ver meu perfil",
        selectError: "Selecione uma opção.",
        textError: "Escreva sua resposta ou marque a opção abaixo.",
        otherError: "Conte qual é.",
        maxError: "Selecione no máximo {max} opções.",
        phoneError: "Informe um WhatsApp com DDD.",
        emailError: "Informe um e-mail válido.",
        questions: [
          {
            kind: "multi",
            question: "Quais outros assuntos você quer entender sobre importação?",
            options: [
              "Por onde começar.",
              "Impostos e custo total.",
              "Como pagar o fornecedor com segurança.",
              "Como solicitar amostras e conferir a qualidade.",
              "Transporte, prazos e entrega no Brasil.",
              "Quais produtos podem ser importados.",
              "Como importar com marca própria.",
              "Como melhorar as importações atuais.",
              "Outro assunto.",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "Sua empresa já importa?",
            options: [
              "Ainda não, quero entender como funciona.",
              "Ainda não, mas já pesquiso produtos e fornecedores.",
              "Sim, quero melhorar ou ampliar as importações.",
              "Já tentei, mas não concluí a importação.",
            ],
          },
          {
            kind: "multi",
            question: "O que falta esclarecer para sua empresa dar o próximo passo?",
            options: [
              "Investimento necessário.",
              "Custo total da operação.",
              "Segurança e confiança no fornecedor.",
              "Qualidade do produto.",
              "Quantidade mínima de compra.",
              "Documentação e exigências do produto.",
              "Prazo de entrega.",
              "Como funciona o processo completo.",
              "Outro ponto.",
            ],
            other: true,
          },
          {
            kind: "text",
            question:
              "Qual produto ou insumo você gostaria de importar ou conhecer melhor?",
            unknownLabel: "Ainda não defini.",
          },
          {
            kind: "text",
            question: "Você já tem alguma referência desse produto?",
            hint: "Pode enviar uma descrição, link, modelo ou especificação. Fotos você pode mandar depois pelo WhatsApp.",
            optional: true,
          },
          {
            kind: "single",
            question: "Qual é a finalidade desse produto?",
            options: [
              "Revenda.",
              "Uso na própria empresa.",
              "Fabricação ou transformação de outros produtos.",
              "Ainda estou avaliando.",
              "Outra finalidade.",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "Hoje, sua empresa já compra esse produto?",
            options: [
              "Sim, de fornecedores no Brasil.",
              "Sim, por meio de importação.",
              "Ainda não compra, mas pretende começar.",
              "Ainda não defini o produto.",
            ],
          },
          {
            kind: "single",
            question: "Se já compra, com qual frequência costuma repor?",
            options: [
              "Semanalmente.",
              "Mensalmente.",
              "A cada dois ou três meses.",
              "Em intervalos maiores.",
              "Conforme a demanda.",
              "Ainda não compra.",
            ],
          },
          {
            kind: "quantity",
            question: "Qual é a quantidade aproximada por compra?",
            hint: "Informe a quantidade e a unidade utilizada.",
            quantityPlaceholder: "Ex.: 500",
            units: ["Peças", "Caixas", "Quilos", "Toneladas", "Litros", "Outra"],
            unitLabel: "Unidade",
            unknownLabel: "Ainda não sei.",
          },
          {
            kind: "multi",
            question: "Qual é a principal melhoria que você busca nessa compra?",
            hint: "Pode selecionar até duas opções.",
            options: [
              "Reduzir o custo total.",
              "Melhorar a qualidade.",
              "Ter mais regularidade no fornecimento.",
              "Aumentar a variedade de produtos.",
              "Desenvolver uma marca própria.",
              "Comprar produtos que não encontra no Brasil.",
              "Ampliar a margem de revenda.",
              "Outra melhoria.",
            ],
            other: true,
            max: 2,
          },
          {
            kind: "text",
            question: "Existe alguma característica indispensável no produto?",
            hint: "Por exemplo: material, resistência, tamanho, desempenho, embalagem ou marca própria.",
            optional: true,
          },
          {
            kind: "single",
            question: "Você já definiu uma faixa de investimento para essa compra?",
            options: [
              "Ainda não; quero entender os custos primeiro.",
              "Tenho uma estimativa, mas preciso avaliar a viabilidade.",
              "Sim, já tenho um valor previsto.",
            ],
            amountLabel: "Valor aproximado (opcional)",
            amountPlaceholder: "0,00",
            amountFor: [1, 2],
          },
          {
            kind: "single",
            question: "Quando você gostaria de realizar essa compra?",
            options: [
              "Assim que entender os custos e a viabilidade.",
              "Nos próximos três meses.",
              "Entre três e seis meses.",
              "Depois de seis meses.",
              "Estou apenas pesquisando, sem prazo definido.",
            ],
          },
          {
            kind: "single",
            question: "Qual é o seu papel nas compras da empresa?",
            options: [
              "Sou proprietário(a), sócio(a) ou responsável pela decisão.",
              "Sou responsável pelas compras.",
              "Participo da avaliação junto com outras pessoas.",
              "Estou pesquisando para apresentar ao responsável.",
              "Outro.",
            ],
            other: true,
          },
          {
            kind: "contact",
            question: "Inscreva-se e concorra a R$ 10 mil para sua importação!",
            hint: "Preencha seus dados para participar.",
            optInLabel: "Quero concorrer aos R$ 10 mil para minha importação.",
            submitLabel: "Quero participar",
            fields: {
              name: { label: "Nome", placeholder: "Seu nome" },
              company: { label: "Empresa", placeholder: "Nome da empresa" },
              city: { label: "Cidade/UF", placeholder: "Ex.: Itajaí/SC" },
              phone: { label: "WhatsApp com DDD", placeholder: "(00) 00000-0000" },
              email: { label: "E-mail", placeholder: "voce@suaempresa.com" },
            },
          },
          {
            kind: "single",
            question: "Como você prefere receber o primeiro retorno?",
            options: [
              "Mensagem pelo WhatsApp.",
              "Áudio pelo WhatsApp.",
              "Ligação.",
              "E-mail.",
            ],
          },
        ],
      },
    },
    footer: {
      description:
        "Soluções em importação, exportação e sourcing internacional.",
      rights: "Todos os direitos reservados.",
    },
  },
  en: {
    languageName: "English",
    languageMenuLabel: "Language",
    whatsappAriaLabel: "Chat on WhatsApp",
    header: {
      brandLabel: "China Brazil",
      menuLabel: "Menu",
      nav: [
        { href: "/news", label: "News" },
        { href: "#como-funciona", label: "How it works" },
        { href: "#servicos", label: "Services" },
        { href: "/catalogo", label: "Catalog" },
        { href: "#diferenciais", label: "Differentials" },
        { href: "#casos", label: "Cases" },
      ],
      ctaLabel: "Talk to our team",
      ctaMessage: "Hello, I would like to request an international quotation.",
    },
    showcase: {
      title: "International\nConsulting",
      description:
        "Structured solutions for companies looking to import, export and operate in the global market with confidence, strategy and scale.",
    },
    hero: {
      title: "International import, export and sourcing solutions",
      description:
        "We connect your company directly with the world's best factories, combining security, strategy and local presence in China.",
      primaryCtaLabel: "Catalogs",
      primaryCtaMessage: "Hello, I would like to talk to the ATC team.",
      secondaryCtaLabel: "News",
      stats: [
        { value: "+R$1 BILLION", label: "in negotiated operations and values" },
        {
          value: "+1 MILLION",
          label: "tons of commodities traded internationally",
        },
        { value: "+3,000", label: "companies and clients served" },
      ],
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Operational intelligence applied to international trade",
      description:
        "We structure each operation to reduce risk, increase predictability, and ensure greater control across every stage of the international process.",
      steps: [
        {
          title: "Strategic Diagnosis & Feasibility",
          desc: "We analyze the product, demand, margin, market, taxation, logistics, and commercial feasibility of the operation.",
        },
        {
          title: "International Sourcing, Validation & Negotiation",
          desc: "We locate approved manufacturers, carry out strategic validations, and negotiate directly at origin.",
        },
        {
          title: "Logistics Management, Customs Clearance & Final Delivery",
          desc: "We coordinate documentation, international freight, customs clearance, and operational follow-up through to final cargo delivery.",
        },
      ],
      highlightTitle: "Governance, control, and execution in every decision",
      highlight:
        "Each stage is planned to provide operational clarity, commercial protection, and strategic follow-up before, during, and after the international negotiation.",
      highlightMetrics: [
        {
          title: "Visibility",
          desc: "Clear monitoring of the operation, costs, suppliers, and process stages.",
        },
        {
          title: "Control",
          desc: "Structured management of negotiation, documentation, validations, and operational execution.",
        },
        {
          title: "Security",
          desc: "Preventive action to reduce commercial, logistics, and operational risks.",
        },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Strategic solutions for international operations",
      description:
        "We provide consulting, commercial, and operational support for companies that need to import, export, or structure global operations with greater security, margin, and predictability.",
      items: [
        {
          title: "Effective End-to-End Importing",
          desc: "We structure the entire international operation, from planning through to final cargo delivery.",
        },
        {
          title: "International Sourcing & Development in China",
          desc: "We locate approved manufacturers and develop suppliers aligned with the technical, commercial, and strategic profile of the operation.",
        },
        {
          title: "International Business Intermediation",
          desc: "We connect companies, buyers, suppliers, and strategic partners in structured international operations.",
        },
        {
          title: "Exports & Commodities",
          desc: "We structure international operations for commodities and Brazilian products with a focus on scale, predictability, and global connection.",
        },
      ],
    },
    operationModels: {
      eyebrow: "Operating models",
      title:
        "Commercial structure adapted to the level of support your operation requires",
      description:
        "We act both as a strategic intermediation partner and as the operator for full import execution, according to your company's maturity and goals.",
      items: [
        {
          title: "Consulting + intermediation",
          desc: "We structure the operation, validate suppliers and lead negotiations for companies that already have an internal team and need local intelligence to execute safely.",
          highlight:
            "Ideal for companies that want to keep internal control with strategic support.",
        },
        {
          title: "Full importing (turnkey)",
          desc: "We take responsibility for the entire international flow, from planning to final destination, with integrated management of sourcing, production, quality, logistics and documentation.",
          highlight:
            "Recommended for companies seeking scale with operational predictability.",
        },
      ],
    },
    differentials: {
      eyebrow: "Differentials",
      title: "Global structure + operational intelligence",
      description:
        "Our operation combines international presence, local execution and commercial governance to reduce risk in global negotiations.",
      imageAlt: "Container ship at port",
      items: [
        {
          title: "Real international presence",
          desc: "Teams and operations across China, Brazil and strategic international hubs.",
        },
        {
          title: "Direct access to origin",
          desc: "Relationships with factories and direct negotiation without intermediaries.",
        },
        {
          title: "International legal security",
          desc: "Contracts structured in the country of origin with operational protection.",
        },
        {
          title: "Capacity for complex operations",
          desc: "Experience with industrial projects, commodities and large-scale contracts.",
        },
      ],
    },
    cases: {
      eyebrow: "Cases and projects",
      title: "Practical experience in operations that demand real backing",
      description:
        "Work across industrial projects, structured exports and international operations that require precise execution.",
      items: [
        {
          title: "Automotive industry project",
          desc: "International coordination to serve industrial demand with technical criteria, supplier validation and operational risk control.",
        },
        {
          title: "Commodity Export",
          desc: "Structuring international operations for Brazilian products, including commercial alignment, documentation, and end-to-end logistics execution.",
        },
        {
          title: "Complex industrial operations",
          desc: "Project management with multiple stages, qualified suppliers and strict monitoring of production, compliance and delivery.",
        },
      ],
    },
    audience: {
      eyebrow: "Who it's for",
      title:
        "ATC operates for companies and projects that treat international trade as strategy",
      profileLabel: "Profile",
      items: [
        {
          title: "Industries",
          desc: "For companies that need reliable international supply, technical standardization and operational scale.",
        },
        {
          title: "Distributors",
          desc: "For operations seeking margin, supply predictability and direct access to origin.",
        },
        {
          title: "Importers",
          desc: "For businesses that want to reduce risk, validate suppliers and professionalize their international chain.",
        },
      ],
    },
    authorityMedia: {
      eyebrow: "In the field",
      title: "Real operations, international presence and proven execution",
      description:
        "Records from operations, technical visits and direct follow-up in industrial and logistics environments.",
      imageAlt: "ATC international operation record",
    },
    news: {
      eyebrow: "News",
      title: "Markets and economy in real time",
      description:
        "Follow the latest news on markets, companies, commodities and indicators that affect international decisions.",
      sourceLabel: "View on InfoMoney",
      readMoreLabel: "Read article",
      emptyLabel: "News unavailable right now.",
      feedTabs: {
        latest: "Latest news",
        imports: "Imports",
        exports: "Exports",
        commodities: "Commodities",
      },
    },
    stats: {
      eyebrow: "Authority",
      title: "Numbers that support our operation",
      description:
        "Results built on real international operations, with execution capacity across different markets and levels of complexity.",
      items: [
        { value: "1M+", label: "tons exported" },
        { value: "3,000+", label: "clients served" },
        { value: "R$1B+", label: "in transaction value" },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Objective answers for safer international decisions",
      items: [
        {
          question: "Does ATC work only with imports from China?",
          answer:
            "No. We have a strong presence in China, but we also structure Brazilian exports and international intermediation in different markets.",
        },
        {
          question:
            "Can you handle everything from supplier search to final delivery?",
          answer:
            "Yes. In the turnkey model, we lead planning, sourcing, validation, negotiation, production, quality, logistics, customs clearance and delivery.",
        },
        {
          question:
            "Does the company handle industrial and complex operations?",
          answer:
            "Yes. Our work includes industrial operations, commodities and projects with higher technical, documentary and contractual requirements.",
        },
        {
          question: "Is it possible to hire only consulting or intermediation?",
          answer:
            "Yes. We also operate in consulting and intermediation formats for companies that already have an internal team and need strategic support at origin.",
        },
        {
          question: "How do I start an analysis of my operation?",
          answer:
            "The first step is to contact the team on WhatsApp to present the product, volume, goals and current stage of the operation. From there, we define the best operating model.",
        },
      ],
    },
    cta: {
      title: "Ready to import with security and scale?",
      description:
        "Talk to our ATC China Brazil team and receive a free diagnosis for your project.",
      quoteLabel: "Request international quote",
      quoteMessage:
        "Hello, I would like to request an international quotation.",
      specialistLabel: "Talk to our team",
      specialistMessage: "Hello, I would like to talk to the ATC team.",
    },
    leadForm: {
      eyebrow: "First step",
      title: "Tell us what your company is looking for.",
      description:
        "Answer a few quick questions and send them straight to our team on WhatsApp. With this information, we come to the conversation already prepared for your case.",
      whatsappLabel: "WhatsApp",
      emailLabel: "Email",
      formTitle: "Talk to our team",
      formDescription:
        "Fill in the fields below. When you submit, WhatsApp opens with a ready-to-send message for you to review.",
      fields: {
        company: { label: "Company name", placeholder: "Your company name" },
        name: { label: "Your name", placeholder: "What should we call you?" },
        phone: { label: "WhatsApp", placeholder: "+55 00 00000-0000" },
        email: { label: "Email", placeholder: "you@yourcompany.com" },
      },
      importStatus: {
        label:
          "Does your company already carry out international operations, or does it only buy from suppliers in Brazil?",
        options: [
          "We currently import",
          "We have imported before",
          "We only buy in Brazil",
          "We do not import",
        ],
      },
      operationType: {
        label: "Is your current focus on importing or exporting?",
        options: [
          "Import (bringing products/inputs into Brazil)",
          "Export (taking Brazilian products to foreign markets)",
          "Both / I need support on both ends",
        ],
      },
      segments: {
        label:
          "Which products or segments have the highest turnover at your company?",
        hint: "Select the main options below or specify under “Other”.",
        options: [
          "Industrial Components and Machinery (automation, parts and tools)",
          "Raw Materials and Chemical / Plastic Inputs",
          "Textiles, Fabrics and Trims",
          "Electronics, IT Components and Technology",
          "Packaging (Cardboard, Plastic, Biodegradable)",
          "Hardware, Steel, Aluminum and Metal Profiles",
          "Lighting (LED Fixtures, Floodlights and Panels)",
          "Home, Décor and Household Goods",
          "Toys, Utilities and General Retail Products",
          "Food, Beverages and Agribusiness Inputs",
        ],
        otherLabel: "Other product or segment",
        otherPlaceholder: "Specify the product or segment",
        otherMessageLabel: "Other",
      },
      questions: {
        frequentPurchases: {
          label: "Which products do you buy or restock most often?",
          placeholder: "E.g.: cables, packaging, raw materials...",
        },
        competitiveProduct: {
          label:
            "Which product or input would you like to buy on more competitive terms?",
          placeholder: "E.g.: bluetooth headphones, tools, machinery...",
        },
      },
      requiredError: "Please fill in this field.",
      selectError: "Please select an option.",
      segmentsError: "Select at least one option or specify under “Other”.",
      phoneError: "Enter a valid WhatsApp number with area code.",
      emailError: "Enter a valid email address.",
      optionalLabel: "optional",
      privacyNote:
        "Nothing is stored on the website: your answers go straight into a message you send on WhatsApp.",
      submitLabel: "Send to our team and chat on WhatsApp",
      messageIntro: "Hello, ATC team! I filled in the form on your website:",
    },
    diagnosis: {
      title: {
        start: "Discover your company's importer profile and ",
        highlight: "earn a feasibility session",
        end: ".",
      },
      description:
        "Tell us your main question about importing and a little about what your company needs. At the end, you discover your importer profile and unlock direct access to China with the ATC team.",
      tagline: "Free and with no commitment.",
      startLabel: "Take my diagnosis",
      steps: {
        eyebrow: "Takes just a few minutes",
        title: "How it works",
        items: [
          {
            title: "Answer the questions",
            description: "About your questions, your company's moment and goals.",
          },
          {
            title: "Discover your profile",
            description: "We show which of the 4 importer profiles is yours.",
          },
          {
            title: "Claim your reward",
            description: "A feasibility session with our team, free of charge.",
          },
        ],
      },
      rewardSection: {
        title: "Your reward",
        description:
          "When you finish the diagnosis, your company unlocks a feasibility session with the ATC team.",
        items: [
          {
            title: "Preliminary operation analysis",
            description: "Costs, lead times and risks of importing what you need.",
          },
          {
            title: "Supplier mapping",
            description: "Factories in China aligned with what your company needs.",
          },
          {
            title: "Direct access to China",
            description: "Negotiation at the source, with ATC's local presence.",
          },
        ],
      },
      profilesLabel: "The 4 importer profiles",
      profilesDescription: "Your result shows which one fits your company today.",
      trustTitle: "Trusted by more than 3,000 companies",
      progressLabel: "Question {current} of {total}",
      backLabel: "Back",
      pathQuestion: {
        question: "What would you like to understand better?",
        options: [
          {
            title: "Importing",
            description: "Buying products from other countries and bringing them to Brazil.",
          },
          {
            title: "Exporting",
            description: "Selling Brazilian products to other countries.",
          },
        ],
        soonLabel: "Coming soon",
      },
      questions: [
        {
          question: "Before importing, which of these questions would you most like answered?",
          options: [
            "How much will the product really cost by the time it reaches my company?",
            "How do I find a reliable supplier and check product quality?",
            "How does importing work in practice, and where do I start?",
            "Is importing worth it for my business?",
          ],
        },
        {
          question: "What worries you most about importing from China?",
          options: [
            "Costs ending up higher than expected.",
            "The supplier not delivering what was agreed.",
            "The goods arriving late.",
            "Not knowing how the process works.",
          ],
        },
        {
          question: "In the next 12 months, your company plans to:",
          options: [
            "Make its first import.",
            "Reduce the cost of current imports.",
            "Develop custom or private-label products.",
            "Understand the process before deciding.",
          ],
        },
        {
          question: "Which of these best describes what your company plans to import?",
          options: [
            "A small quantity to test the market.",
            "Frequent orders to restock inventory.",
            "A large volume, such as a full container.",
            "I haven't defined the quantity or investment yet.",
          ],
        },
      ],
      resultEyebrow: "Your profile",
      profiles: [
        {
          name: "Explorer Importer",
          focus: "Strategic beginner",
          meaning:
            "A company with high growth potential that still buys in the domestic market or is taking its first steps.",
          summary:
            "You want to validate financial viability and start with complete security, without risks from bureaucracy or unknown suppliers. Your biggest immediate gain is breaking free from dependence on local distributors.",
        },
        {
          name: "Optimizer Importer",
          focus: "Margin and efficiency focus",
          meaning:
            "A company that already knows the market or already imports, but feels it is leaving money on the table due to high costs or intermediaries.",
          summary:
            "Your focus is cutting out middlemen, negotiating directly at the source (China) and transforming your current operation to capture 2x to 3x margins with predictable logistics.",
        },
        {
          name: "Brand Builder Importer",
          focus: "OEM / exclusivity",
          meaning:
            "A visionary company that wants to differentiate its portfolio with exclusive products, customization or a private label.",
          summary:
            "You need rigorous factory qualification, quality control at origin and technical development to launch unique products in the Brazilian market.",
        },
        {
          name: "High-Volume Importer",
          focus: "Volume and containers",
          meaning:
            "A robust operation (manufacturer, wholesaler or large distributor) focused on volume, continuous replenishment and purchasing power.",
          summary:
            "Your goal is maximum end-to-end efficiency: factory audits, cargo consolidation, tax and logistics savings, and uninterrupted supply directly from China's largest factories.",
        },
      ],
      reward: {
        badge: "Benefit unlocked",
        title:
          "Congratulations! You've unlocked a feasibility session and direct access to China",
        description:
          "Based on your profile, our team has unlocked a free Preliminary Operation Analysis + Supplier Mapping for your company.",
        submitLabel: "Send answers and claim on WhatsApp",
        sentTitle: "Just hit send!",
        sentDescription:
          "We opened WhatsApp with everything filled in. Just send the message to our team.",
        reopenLabel: "Open WhatsApp again",
        prizeLine: "You're also entered to win R$ 10,000 for your import.",
      },
      restartLabel: "Retake diagnosis",
      analyzingTitle: "Calculating your profile…",
      completedEyebrow: "Your result",
      openResultLabel: "See result and claim benefit",
      closeLabel: "Close",
      requiredError: "Please fill in this field.",
      messageIntro:
        "Hello, ATC team! I took the Import Diagnosis and would like to claim my Feasibility Session.",
      profileMessageLabel: "Profile",
      answersMessageLabel: "Answers",
      contactMessageLabel: "Contact",
      prizeMessageLabel: "Enter the R$ 10,000 draw",
      yesLabel: "Yes",
      noLabel: "No",
      intake: {
        continueLabel: "Continue",
        numberLocale: "en-US",
        optionalLabel: "Optional",
        singleHint: "Select one option.",
        multiHint: "You can select more than one option.",
        textPlaceholder: "Type your answer",
        otherPlaceholder: "Tell us what it is",
        submitLabel: "Finish and see my profile",
        selectError: "Select an option.",
        textError: "Type your answer or check the option below.",
        otherError: "Tell us what it is.",
        maxError: "Select up to {max} options.",
        phoneError: "Enter a WhatsApp number with area code.",
        emailError: "Enter a valid email.",
        questions: [
          {
            kind: "multi",
            question: "What other topics would you like to understand about importing?",
            options: [
              "Where to start.",
              "Taxes and total cost.",
              "How to pay the supplier safely.",
              "How to request samples and check quality.",
              "Shipping, lead times and delivery in Brazil.",
              "Which products can be imported.",
              "How to import under your own brand.",
              "How to improve current imports.",
              "Another topic.",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "Does your company already import?",
            options: [
              "Not yet, I want to understand how it works.",
              "Not yet, but I'm already researching products and suppliers.",
              "Yes, I want to improve or expand our imports.",
              "I've tried, but didn't complete the import.",
            ],
          },
          {
            kind: "multi",
            question: "What still needs to be clarified for your company to take the next step?",
            options: [
              "Required investment.",
              "Total cost of the operation.",
              "Supplier security and trust.",
              "Product quality.",
              "Minimum order quantity.",
              "Product documentation and requirements.",
              "Delivery time.",
              "How the full process works.",
              "Another point.",
            ],
            other: true,
          },
          {
            kind: "text",
            question:
              "Which product or input would you like to import or learn more about?",
            unknownLabel: "I haven't decided yet.",
          },
          {
            kind: "text",
            question: "Do you already have a reference for this product?",
            hint: "You can send a description, link, model or specification. Photos can be sent later on WhatsApp.",
            optional: true,
          },
          {
            kind: "single",
            question: "What is this product for?",
            options: [
              "Resale.",
              "Use within the company.",
              "Manufacturing or processing other products.",
              "Still evaluating.",
              "Another purpose.",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "Does your company already buy this product today?",
            options: [
              "Yes, from suppliers in Brazil.",
              "Yes, through imports.",
              "Not yet, but plans to start.",
              "I haven't defined the product yet.",
            ],
          },
          {
            kind: "single",
            question: "If you already buy it, how often do you restock?",
            options: [
              "Weekly.",
              "Monthly.",
              "Every two or three months.",
              "At longer intervals.",
              "On demand.",
              "Doesn't buy it yet.",
            ],
          },
          {
            kind: "quantity",
            question: "What is the approximate quantity per purchase?",
            hint: "Enter the quantity and the unit you use.",
            quantityPlaceholder: "E.g. 500",
            units: ["Pieces", "Boxes", "Kilograms", "Tons", "Liters", "Other"],
            unitLabel: "Unit",
            unknownLabel: "I don't know yet.",
          },
          {
            kind: "multi",
            question: "What is the main improvement you are looking for in this purchase?",
            hint: "You can select up to two options.",
            options: [
              "Reduce total cost.",
              "Improve quality.",
              "More consistent supply.",
              "Wider product variety.",
              "Develop my own brand.",
              "Buy products not available in Brazil.",
              "Increase resale margin.",
              "Another improvement.",
            ],
            other: true,
            max: 2,
          },
          {
            kind: "text",
            question: "Is there any must-have characteristic for the product?",
            hint: "For example: material, strength, size, performance, packaging or own brand.",
            optional: true,
          },
          {
            kind: "single",
            question: "Have you set an investment range for this purchase?",
            options: [
              "Not yet; I want to understand the costs first.",
              "I have an estimate but need to assess feasibility.",
              "Yes, I already have a planned amount.",
            ],
            amountLabel: "Approximate amount (optional)",
            amountPlaceholder: "0.00",
            amountFor: [1, 2],
          },
          {
            kind: "single",
            question: "When would you like to make this purchase?",
            options: [
              "As soon as I understand the costs and feasibility.",
              "In the next three months.",
              "In three to six months.",
              "After six months.",
              "Just researching, no set timeline.",
            ],
          },
          {
            kind: "single",
            question: "What is your role in the company's purchasing?",
            options: [
              "I'm the owner, a partner or the decision maker.",
              "I'm responsible for purchasing.",
              "I take part in the evaluation with other people.",
              "I'm researching to present to the decision maker.",
              "Other.",
            ],
            other: true,
          },
          {
            kind: "contact",
            question: "Sign up and enter to win R$ 10,000 for your import!",
            hint: "Fill in your details to take part.",
            optInLabel: "I want to enter to win R$ 10,000 for my import.",
            submitLabel: "I want to take part",
            fields: {
              name: { label: "Name", placeholder: "Your name" },
              company: { label: "Company", placeholder: "Company name" },
              city: { label: "City/State", placeholder: "E.g. Itajaí/SC" },
              phone: { label: "WhatsApp with area code", placeholder: "+55 00 00000-0000" },
              email: { label: "Email", placeholder: "you@yourcompany.com" },
            },
          },
          {
            kind: "single",
            question: "How would you prefer to receive our first reply?",
            options: [
              "WhatsApp message.",
              "WhatsApp voice note.",
              "Phone call.",
              "Email.",
            ],
          },
        ],
      },
    },
    footer: {
      description: "International import, export and sourcing solutions.",
      rights: "All rights reserved.",
    },
  },
  zh: {
    languageName: "中文",
    languageMenuLabel: "语言",
    whatsappAriaLabel: "通过 WhatsApp 联系",
    header: {
      brandLabel: "中巴贸易",
      menuLabel: "菜单",
      nav: [
        { href: "/news", label: "新闻" },
        { href: "#como-funciona", label: "运作方式" },
        { href: "#servicos", label: "服务" },
        { href: "/catalogo", label: "目录" },
        { href: "#diferenciais", label: "优势" },
        { href: "#casos", label: "案例" },
      ],
      ctaLabel: "联系我们的团队",
      ctaMessage: "您好，我想申请一份国际报价。",
    },
    showcase: {
      title: "国际咨询",
      description:
        "为希望开展进出口业务并拓展全球市场的企业提供系统化解决方案，助力企业安全运营、战略布局与规模化发展。",
    },
    hero: {
      title: "国际进口、出口与采购解决方案",
      description:
        "我们将您的企业直接连接到全球优质工厂，以安全、策略和中国本地执行能力推动业务发展。",
      primaryCtaLabel: "产品目录",
      primaryCtaMessage: "您好，我想与 ATC 团队沟通。",
      secondaryCtaLabel: "新闻",
      stats: [
        { value: "+10亿+雷亚尔", label: "成交金额与运营价值" },
        {
          value: "+100万",
          label: "国际贸易大宗商品吨数",
        },
        { value: "+3,000", label: "服务企业与客户" },
      ],
    },
    howItWorks: {
      eyebrow: "运作方式",
      title: "面向国际贸易的运营智能",
      description:
        "我们为每一项业务进行结构化设计，以降低风险、提升可预测性，并在国际流程的各个环节实现更强控制。",
      steps: [
        {
          title: "战略诊断与可行性评估",
          desc: "我们分析产品、需求、利润空间、市场、税务、物流以及该业务的商业可行性。",
        },
        {
          title: "国际寻源、验证与谈判",
          desc: "我们寻找经认证的制造商，开展战略性验证，并直接在源头进行谈判。",
        },
        {
          title: "物流管理、清关与最终交付",
          desc: "我们协调文件、国际运输、海关清关，并持续跟进运营直至货物最终交付。",
        },
      ],
      highlightTitle: "每一次决策中的治理、控制与执行",
      highlight:
        "每个阶段都经过规划，以在国际谈判前、中、后提供清晰的运营视角、商业保护和战略跟进。",
      highlightMetrics: [
        {
          title: "可视性",
          desc: "清晰跟进业务、成本、供应商以及流程各阶段。",
        },
        {
          title: "控制力",
          desc: "对谈判、文件、验证和运营执行进行结构化管理。",
        },
        {
          title: "安全性",
          desc: "通过预防性行动降低商业、物流和运营风险。",
        },
      ],
    },
    services: {
      eyebrow: "服务",
      title: "国际业务的战略解决方案",
      description:
        "我们为需要进口、出口或搭建全球业务的企业提供咨询、商务和运营支持，帮助其实现更高安全性、利润空间和可预测性。",
      items: [
        {
          title: "高效端到端进口",
          desc: "我们搭建完整的国际业务流程，从规划一直到货物最终交付。",
        },
        {
          title: "国际寻源与中国供应商开发",
          desc: "我们寻找经认证的制造商，并开发符合业务技术、商业和战略需求的供应商。",
        },
        {
          title: "国际商务撮合",
          desc: "我们在结构化国际业务中连接企业、买家、供应商和战略合作伙伴。",
        },
        {
          title: "出口与大宗商品",
          desc: "我们为大宗商品和巴西产品搭建国际业务，聚焦规模、可预测性和全球连接。",
        },
      ],
    },
    operationModels: {
      eyebrow: "合作模式",
      title: "根据您的业务支持需求配置商业结构",
      description:
        "我们既可以作为战略中介合作伙伴，也可以承担完整进口执行工作，具体取决于企业成熟度和业务目标。",
      items: [
        {
          title: "咨询 + 中介",
          desc: "我们帮助企业搭建业务结构、验证供应商并主导谈判，适合已有内部团队但需要本地情报与安全执行支持的公司。",
          highlight: "适合希望保留内部控制并获得战略支持的企业。",
        },
        {
          title: "全流程进口（一站式）",
          desc: "我们负责从规划到最终交付的全部国际流程，整合采购、生产、质量、物流和文件管理。",
          highlight: "适合追求规模化与运营可预测性的企业。",
        },
      ],
    },
    differentials: {
      eyebrow: "优势",
      title: "全球布局 + 运营智能",
      description:
        "我们的业务将国际布局、本地执行与商业治理结合起来，以降低全球谈判风险。",
      imageAlt: "港口中的集装箱货轮",
      items: [
        {
          title: "真实的国际布局",
          desc: "团队和业务覆盖中国、巴西及多个战略枢纽。",
        },
        {
          title: "直接触达源头",
          desc: "与工厂直接建立关系并开展谈判，无需中间商。",
        },
        {
          title: "国际法律安全",
          desc: "在原产国完成合同结构设计，保障运营安全。",
        },
        {
          title: "复杂项目执行能力",
          desc: "拥有工业项目、大宗商品与大型合同经验。",
        },
      ],
    },
    cases: {
      eyebrow: "案例与项目",
      title: "具备真实背书的国际业务实战经验",
      description: "覆盖工业项目、结构化出口以及需要精确执行的国际业务。",
      items: [
        {
          title: "汽车工业项目",
          desc: "以技术标准、供应商验证和运营风险控制为基础协调国际工业需求。",
        },
        {
          title: "蛋白产品出口",
          desc: "为巴西产品设计国际出口方案，协调商务、单证与端到端物流执行。",
        },
        {
          title: "复杂工业业务",
          desc: "管理多阶段项目、合格供应商以及对生产、合规和交付的严格跟踪。",
        },
      ],
    },
    audience: {
      eyebrow: "适用对象",
      title: "ATC 服务于将国际贸易视为战略的企业和项目",
      profileLabel: "类型",
      items: [
        {
          title: "工业企业",
          desc: "适合需要可靠国际供应、技术标准化和运营规模的企业。",
        },
        {
          title: "大宗商品出口",
          desc: "为巴西产品搭建国际业务运营架构，涵盖商务对接、文件准备以及端到端物流执行。",
        },
        {
          title: "进口商",
          desc: "适合希望降低风险、验证供应商并提升国际供应链专业度的企业。",
        },
      ],
    },
    authorityMedia: {
      eyebrow: "现场实力",
      title: "真实业务、国际布局与经过验证的执行能力",
      description: "来自业务现场、技术拜访以及工业和物流环境直接跟进的记录。",
      imageAlt: "ATC 国际业务记录",
    },
    news: {
      eyebrow: "新闻",
      title: "实时市场与经济动态",
      description: "关注市场、企业、大宗商品和影响国际决策的指标的最新报道。",
      sourceLabel: "在 InfoMoney 查看",
      readMoreLabel: "阅读新闻",
      emptyLabel: "当前新闻不可用。",
      feedTabs: {
        latest: "最新新闻",
        imports: "进口",
        exports: "出口",
        commodities: "大宗商品",
      },
    },
    stats: {
      eyebrow: "实力",
      title: "支撑我们业务的关键数字",
      description:
        "成果来自真实国际业务执行，覆盖不同市场和不同复杂程度的项目。",
      items: [
        { value: "100万+吨", label: "出口量" },
        { value: "3,000+", label: "服务客户" },
        { value: "10亿+雷亚尔", label: "交易金额" },
      ],
    },
    faq: {
      eyebrow: "常见问题",
      title: "为更安全的国际决策提供直接答案",
      items: [
        {
          question: "ATC 只做中国进口业务吗？",
          answer:
            "不是。我们在中国有很强的本地布局，同时也为巴西出口和其他国际市场的商务撮合提供服务。",
        },
        {
          question: "你们能从找供应商一直做到最终交付吗？",
          answer:
            "可以。在一站式模式下，我们负责规划、采购、验证、谈判、生产、质量、物流、清关和交付。",
        },
        {
          question: "公司是否承接工业和复杂业务项目？",
          answer:
            "可以。我们的业务包括工业项目、大宗商品，以及对技术、单证和合同要求更高的项目。",
        },
        {
          question: "是否可以只聘请咨询或中介服务？",
          answer:
            "可以。对于已有内部团队、但在原产地仍需要战略支持的企业，我们也提供咨询和中介服务。",
        },
        {
          question: "如何开始评估我的业务？",
          answer:
            "第一步是在 WhatsApp 上联系团队，说明产品、数量、目标以及业务当前阶段。随后我们会定义最合适的合作模式。",
        },
      ],
    },
    cta: {
      title: "准备好更安全、更高效地开展进口了吗？",
      description: "与 ATC China Brazil 团队沟通，免费获得您的项目诊断。",
      quoteLabel: "申请国际报价",
      quoteMessage: "您好，我想申请一份国际报价。",
      specialistLabel: "联系我们的团队",
      specialistMessage: "您好，我想与 ATC 团队沟通。",
    },
    leadForm: {
      eyebrow: "第一步",
      title: "告诉我们贵公司在寻找什么。",
      description:
        "回答几个简单问题，并通过 WhatsApp 直接发送给我们的团队。有了这些信息，我们可以针对您的情况做好沟通准备。",
      whatsappLabel: "WhatsApp",
      emailLabel: "电子邮件",
      formTitle: "联系我们的团队",
      formDescription:
        "请填写以下信息。提交后将打开 WhatsApp，并生成可供您确认的消息。",
      fields: {
        company: { label: "公司名称", placeholder: "贵公司名称" },
        name: { label: "您的姓名", placeholder: "我们该如何称呼您？" },
        phone: { label: "WhatsApp", placeholder: "+55 00 00000-0000" },
        email: { label: "电子邮件", placeholder: "you@yourcompany.com" },
      },
      importStatus: {
        label: "贵公司是否已开展国际业务，还是仅向巴西供应商采购？",
        options: ["目前在进口", "以前进口过", "仅在巴西采购", "不进口"],
      },
      operationType: {
        label: "贵公司目前的重点是进口还是出口？",
        options: [
          "进口（将产品/原料引入巴西）",
          "出口（将巴西产品推向海外市场）",
          "两者皆有／需要双向支持",
        ],
      },
      segments: {
        label: "贵公司哪些产品或行业的周转量最高？",
        hint: "请选择以下主要选项，或在“其他”中注明。",
        options: [
          "工业零部件与机械（自动化、配件与工具）",
          "原材料与化工／塑料原料",
          "纺织品、面料与辅料",
          "电子产品、IT 组件与科技产品",
          "包装（纸板、塑料、可降解材料）",
          "五金、钢材、铝材与金属型材",
          "照明产品（LED 灯具、投光灯与面板）",
          "家居、装饰与日用品",
          "玩具、实用品与综合零售商品",
          "食品、饮料与农业投入品",
        ],
        otherLabel: "其他产品或行业",
        otherPlaceholder: "请注明产品或行业",
        otherMessageLabel: "其他",
      },
      questions: {
        frequentPurchases: {
          label: "贵公司最常采购或补货的产品有哪些？",
          placeholder: "例如：数据线、包装、原材料……",
        },
        competitiveProduct: {
          label: "您希望以更有竞争力的条件采购哪种产品或原料？",
          placeholder: "例如：蓝牙耳机、工具、机械……",
        },
      },
      requiredError: "请填写此项。",
      selectError: "请选择一个选项。",
      segmentsError: "请至少选择一个选项，或在“其他”中注明。",
      phoneError: "请输入有效的 WhatsApp 号码（含区号）。",
      emailError: "请输入有效的电子邮件地址。",
      optionalLabel: "选填",
      privacyNote:
        "网站不会保存任何数据：您的回答将直接生成一条由您通过 WhatsApp 发送的消息。",
      submitLabel: "发送给我们的团队并在 WhatsApp 沟通",
      messageIntro: "您好，ATC 团队！我在网站上填写了表单：",
    },
    diagnosis: {
      title: {
        start: "了解贵公司的进口商画像，",
        highlight: "赢取一次可行性评估",
        end: "。",
      },
      description:
        "告诉我们您关于进口的主要疑问，以及贵公司的一些需求。最后，您将了解自己的进口商画像，并解锁与 ATC 团队直连中国的机会。",
      tagline: "免费，无任何义务。",
      startLabel: "开始诊断",
      steps: {
        eyebrow: "只需几分钟",
        title: "如何进行",
        items: [
          {
            title: "回答问题",
            description: "关于您的疑问、贵公司的现状与目标。",
          },
          {
            title: "了解您的画像",
            description: "告诉您属于 4 种进口商画像中的哪一种。",
          },
          {
            title: "领取奖励",
            description: "与我们团队进行一次免费的可行性评估。",
          },
        ],
      },
      rewardSection: {
        title: "您的奖励",
        description: "完成诊断后，贵公司将获得一次与 ATC 团队的可行性评估。",
        items: [
          {
            title: "初步运营分析",
            description: "进口所需产品的成本、周期与风险。",
          },
          {
            title: "供应商匹配",
            description: "与贵公司需求相符的中国工厂。",
          },
          {
            title: "直连中国",
            description: "依托 ATC 本地团队，在源头谈判。",
          },
        ],
      },
      profilesLabel: "4 种进口商画像",
      profilesDescription: "诊断结果会显示贵公司目前属于哪一种。",
      trustTitle: "超过 3,000 家企业的信赖",
      progressLabel: "第 {current} 题，共 {total} 题",
      backLabel: "返回",
      pathQuestion: {
        question: "您想进一步了解哪方面？",
        options: [
          {
            title: "进口",
            description: "从其他国家采购产品并运到巴西。",
          },
          {
            title: "出口",
            description: "将巴西产品销往其他国家。",
          },
        ],
        soonLabel: "即将推出",
      },
      questions: [
        {
          question: "在进口之前，您最希望得到解答的是哪个问题？",
          options: [
            "产品运到我公司时，实际成本是多少？",
            "如何找到可靠的供应商并检查产品质量？",
            "进口实际如何运作，应从哪里开始？",
            "进口对我的业务是否值得？",
          ],
        },
        {
          question: "从中国进口，您最担心什么？",
          options: [
            "成本高于预期。",
            "供应商未按约定交付。",
            "货物延误。",
            "不了解流程如何运作。",
          ],
        },
        {
          question: "未来 12 个月，贵公司计划：",
          options: [
            "进行首次进口。",
            "降低现有进口成本。",
            "开发定制或自有品牌产品。",
            "先了解流程再做决定。",
          ],
        },
        {
          question: "以下哪项最能描述贵公司计划进口的规模？",
          options: [
            "少量采购，用于测试市场。",
            "定期下单，补充库存。",
            "大批量，例如整柜。",
            "尚未确定数量和投资。",
          ],
        },
      ],
      resultEyebrow: "您的画像",
      profiles: [
        {
          name: "探索型进口商",
          focus: "战略起步者",
          meaning:
            "具有高增长潜力的企业，目前仍在国内市场采购或刚刚起步。",
          summary:
            "您希望验证财务可行性，并在充分保障下起步，避免繁琐手续或陌生供应商带来的风险。您最直接的收益是摆脱对本地分销商的依赖。",
        },
        {
          name: "优化型进口商",
          focus: "聚焦利润与效率",
          meaning:
            "已经了解市场或已在进口的企业，但感到因成本过高或中间商过多而错失利润。",
          summary:
            "您的重点是减少中间环节、直接在源头（中国）谈判，并改造现有业务，在物流可预期的前提下获得 2 至 3 倍的利润空间。",
        },
        {
          name: "品牌建设型进口商",
          focus: "OEM／独家产品",
          meaning:
            "富有远见的企业，希望通过独家产品、定制或自有品牌实现产品组合差异化。",
          summary:
            "您需要严格的工厂资质审核、源头质量控制和技术开发，以便在巴西市场推出独特产品。",
        },
        {
          name: "规模型进口商",
          focus: "大批量与整柜",
          meaning:
            "以批量、持续补货和采购议价能力为核心的成熟业务（工业、批发或大型分销商）。",
          summary:
            "您的目标是实现端到端的最高效率：工厂审核、货物拼装、降低税务与物流成本，并由中国大型工厂直接持续供货。",
        },
      ],
      reward: {
        badge: "权益已解锁",
        title:
          "恭喜！您已解锁可行性评估会议及中国直连通道",
        description:
          "根据您的画像，我们的团队为贵公司免费提供初步业务分析及供应商匹配。",
        submitLabel: "发送回答并在 WhatsApp 领取",
        sentTitle: "只差发送一步！",
        sentDescription:
          "我们已在 WhatsApp 中为您填好全部内容，只需发送给我们的团队即可。",
        reopenLabel: "再次打开 WhatsApp",
        prizeLine: "您还将参与赢取 1 万雷亚尔进口资金。",
      },
      restartLabel: "重新诊断",
      analyzingTitle: "正在计算您的画像…",
      completedEyebrow: "您的结果",
      openResultLabel: "查看结果并领取权益",
      closeLabel: "关闭",
      requiredError: "请填写此项。",
      messageIntro: "您好，ATC 团队！我完成了进口诊断，想领取可行性评估会议。",
      profileMessageLabel: "画像",
      answersMessageLabel: "回答",
      contactMessageLabel: "联系方式",
      prizeMessageLabel: "参与 1 万雷亚尔进口资金抽奖",
      yesLabel: "是",
      noLabel: "否",
      intake: {
        continueLabel: "继续",
        numberLocale: "zh-CN",
        optionalLabel: "选填",
        singleHint: "请选择一项。",
        multiHint: "可多选。",
        textPlaceholder: "请输入您的回答",
        otherPlaceholder: "请具体说明",
        submitLabel: "完成并查看我的画像",
        selectError: "请选择一项。",
        textError: "请输入回答或勾选下方选项。",
        otherError: "请具体说明。",
        maxError: "最多可选择 {max} 项。",
        phoneError: "请输入含区号的 WhatsApp 号码。",
        emailError: "请输入有效的电子邮件。",
        questions: [
          {
            kind: "multi",
            question: "关于进口，您还想了解哪些主题？",
            options: [
              "从哪里开始。",
              "税费与总成本。",
              "如何安全地向供应商付款。",
              "如何索取样品并检查质量。",
              "运输、时效及巴西境内交付。",
              "哪些产品可以进口。",
              "如何以自有品牌进口。",
              "如何优化现有进口。",
              "其他主题。",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "贵公司目前是否已在进口？",
            options: [
              "还没有，想了解如何运作。",
              "还没有，但已在调研产品和供应商。",
              "是的，希望优化或扩大进口。",
              "尝试过，但没有完成进口。",
            ],
          },
          {
            kind: "multi",
            question: "贵公司迈出下一步还需要弄清哪些方面？",
            options: [
              "所需投资。",
              "业务总成本。",
              "供应商的安全与可信度。",
              "产品质量。",
              "最低采购量。",
              "产品文件与要求。",
              "交货时间。",
              "完整流程如何运作。",
              "其他方面。",
            ],
            other: true,
          },
          {
            kind: "text",
            question: "您想进口或进一步了解哪种产品或原材料？",
            unknownLabel: "尚未确定。",
          },
          {
            kind: "text",
            question: "您是否已有该产品的参考？",
            hint: "可提供描述、链接、型号或规格。照片可稍后通过 WhatsApp 发送。",
            optional: true,
          },
          {
            kind: "single",
            question: "该产品的用途是什么？",
            options: [
              "转售。",
              "公司自用。",
              "用于生产或加工其他产品。",
              "仍在评估。",
              "其他用途。",
            ],
            other: true,
          },
          {
            kind: "single",
            question: "贵公司目前是否已在采购该产品？",
            options: [
              "是，从巴西供应商采购。",
              "是，通过进口采购。",
              "尚未采购，但计划开始。",
              "尚未确定产品。",
            ],
          },
          {
            kind: "single",
            question: "如已采购，通常多久补货一次？",
            options: [
              "每周。",
              "每月。",
              "每两到三个月。",
              "间隔更长。",
              "按需补货。",
              "尚未采购。",
            ],
          },
          {
            kind: "quantity",
            question: "每次采购的大致数量是多少？",
            hint: "请填写数量及使用的单位。",
            quantityPlaceholder: "例如：500",
            units: ["件", "箱", "千克", "吨", "升", "其他"],
            unitLabel: "单位",
            unknownLabel: "暂不清楚。",
          },
          {
            kind: "multi",
            question: "您希望这次采购带来的主要改善是什么？",
            hint: "最多可选择两项。",
            options: [
              "降低总成本。",
              "提升质量。",
              "供货更稳定。",
              "增加产品种类。",
              "发展自有品牌。",
              "采购巴西买不到的产品。",
              "提高转售利润。",
              "其他改善。",
            ],
            other: true,
            max: 2,
          },
          {
            kind: "text",
            question: "产品是否有必须具备的特性？",
            hint: "例如：材质、强度、尺寸、性能、包装或自有品牌。",
            optional: true,
          },
          {
            kind: "single",
            question: "您是否已为这次采购确定投资范围？",
            options: [
              "尚未确定；想先了解成本。",
              "有初步估算，但需要评估可行性。",
              "是，已有预算金额。",
            ],
            amountLabel: "大致金额（选填）",
            amountPlaceholder: "0.00",
            amountFor: [1, 2],
          },
          {
            kind: "single",
            question: "您希望何时进行这次采购？",
            options: [
              "了解成本和可行性后立即进行。",
              "未来三个月内。",
              "三到六个月内。",
              "六个月以后。",
              "仅在调研，暂无时间计划。",
            ],
          },
          {
            kind: "single",
            question: "您在公司采购中担任什么角色？",
            options: [
              "我是所有者、合伙人或决策人。",
              "我负责采购。",
              "我与其他人共同参与评估。",
              "我在调研，准备向决策人汇报。",
              "其他。",
            ],
            other: true,
          },
          {
            kind: "contact",
            question: "报名参加，有机会赢取 1 万雷亚尔进口资金！",
            hint: "填写您的信息即可参与。",
            optInLabel: "我想参与赢取 1 万雷亚尔进口资金。",
            submitLabel: "我要参与",
            fields: {
              name: { label: "姓名", placeholder: "您的姓名" },
              company: { label: "公司", placeholder: "公司名称" },
              city: { label: "城市/州", placeholder: "例如：Itajaí/SC" },
              phone: { label: "WhatsApp（含区号）", placeholder: "+55 00 00000-0000" },
              email: { label: "电子邮件", placeholder: "you@yourcompany.com" },
            },
          },
          {
            kind: "single",
            question: "您希望以何种方式接收首次回复？",
            options: [
              "WhatsApp 文字消息。",
              "WhatsApp 语音消息。",
              "电话。",
              "电子邮件。",
            ],
          },
        ],
      },
    },
    footer: {
      description: "国际进口、出口与采购解决方案。",
      rights: "版权所有。",
    },
  },
} as const;

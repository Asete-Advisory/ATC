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
      kicker: "Diagnóstico de importação",
      profilesLabel: "Os 4 perfis de importador",
      title: "Descubra o perfil e o potencial da sua empresa",
      description:
        "Responda a 4 perguntas rápidas, descubra em qual modelo de experiência de importação sua empresa se encaixa e desbloqueie um benefício exclusivo no final.",
      progressLabel: "Pergunta {current} de {total}",
      backLabel: "Voltar",
      questions: [
        {
          question:
            "O que você mais busca quando pensa em importar para a sua empresa?",
          options: [
            "Aumentar margem de lucro reduzindo o custo unitário do produto.",
            "Acessar produtos exclusivos e tecnologias que não existem no Brasil.",
            "Escalar a produção e garantir fornecimento contínuo sem falhas.",
            "Ainda estou avaliando se a importação é viável para o meu negócio.",
          ],
        },
        {
          question:
            "O que sua empresa mais ganha e o que mais teme perder ao iniciar/expandir uma operação de importação?",
          options: [
            "Ganho: Alta lucratividade / Receio: Burocracia fiscal e riscos operacionais.",
            "Ganho: Controle da qualidade e marca própria / Receio: Fornecedores não confiáveis na China.",
            "Ganho: Competitividade no mercado / Receio: Prazos longos e custos de frete internacional.",
            "Ganho: Diversificação de portfólio / Receio: Falta de conhecimento técnico do processo.",
          ],
        },
        {
          question:
            "Qual é a principal meta da sua empresa para os próximos 12 meses?",
          options: [
            "Começar a importar do zero com segurança total.",
            "Otimizar os custos de uma operação de importação que já existe.",
            "Desenvolver produtos sob medida (OEM) diretamente com fábricas chinesas.",
            "Apenas entender como funciona o mercado internacional.",
          ],
        },
        {
          question:
            "Qual o porte ou faixa de investimento prevista para a sua operação de importação?",
          options: [
            "Operação inicial / teste de mercado (pedidos menores ou carga compartilhada).",
            "Operação recorrente de médio porte (compras regulares para reposição de estoque).",
            "Operação de grande escala / contêiner fechado (FCL) direto de fábrica.",
            "Ainda não defini o orçamento e preciso de um estudo de viabilidade.",
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
        fields: {
          company: { label: "Nome da empresa", placeholder: "Nome da sua empresa" },
          name: { label: "Seu nome", placeholder: "Como podemos te chamar?" },
          contact: {
            label: "WhatsApp com DDD ou e-mail corporativo",
            placeholder: "(00) 00000-0000 ou voce@suaempresa.com",
          },
        },
        submitLabel: "Resgatar meu diagnóstico e falar no WhatsApp",
      },
      restartLabel: "Refazer diagnóstico",
      analyzingTitle: "Calculando seu perfil…",
      completedEyebrow: "Seu resultado",
      openResultLabel: "Ver resultado e resgatar benefício",
      closeLabel: "Fechar",
      requiredError: "Preencha este campo.",
      contactError: "Informe um WhatsApp com DDD ou um e-mail válido.",
      messageIntro:
        "Olá, equipe ATC! Fiz o Diagnóstico de Importação e quero resgatar minha Sessão de Viabilidade.",
      profileMessageLabel: "Perfil",
      contactMessageLabel: "WhatsApp / E-mail",
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
      kicker: "Import diagnosis",
      profilesLabel: "The 4 importer profiles",
      title: "Discover your company's import profile and potential",
      description:
        "Answer 4 quick questions, find out which import experience model fits your company and unlock an exclusive benefit at the end.",
      progressLabel: "Question {current} of {total}",
      backLabel: "Back",
      questions: [
        {
          question:
            "What do you look for most when you think about importing for your company?",
          options: [
            "Increase profit margins by lowering the product's unit cost.",
            "Access exclusive products and technologies not available in Brazil.",
            "Scale production and secure continuous, uninterrupted supply.",
            "I'm still assessing whether importing is viable for my business.",
          ],
        },
        {
          question:
            "What does your company stand to gain most, and what does it fear losing most, when starting or expanding an import operation?",
          options: [
            "Gain: High profitability / Concern: Tax bureaucracy and operational risks.",
            "Gain: Quality control and private label / Concern: Unreliable suppliers in China.",
            "Gain: Market competitiveness / Concern: Long lead times and international freight costs.",
            "Gain: Portfolio diversification / Concern: Lack of technical knowledge of the process.",
          ],
        },
        {
          question: "What is your company's main goal for the next 12 months?",
          options: [
            "Start importing from scratch with complete security.",
            "Optimize the costs of an existing import operation.",
            "Develop custom (OEM) products directly with Chinese factories.",
            "Just understand how the international market works.",
          ],
        },
        {
          question:
            "What is the expected size or investment range for your import operation?",
          options: [
            "Initial operation / market test (smaller orders or shared cargo).",
            "Recurring mid-sized operation (regular purchases to restock inventory).",
            "Large-scale operation / full container load (FCL) direct from the factory.",
            "I haven't set a budget yet and need a feasibility study.",
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
        fields: {
          company: { label: "Company name", placeholder: "Your company name" },
          name: { label: "Your name", placeholder: "What should we call you?" },
          contact: {
            label: "WhatsApp with area code or business email",
            placeholder: "+55 00 00000-0000 or you@yourcompany.com",
          },
        },
        submitLabel: "Claim my diagnosis and chat on WhatsApp",
      },
      restartLabel: "Retake diagnosis",
      analyzingTitle: "Calculating your profile…",
      completedEyebrow: "Your result",
      openResultLabel: "See result and claim benefit",
      closeLabel: "Close",
      requiredError: "Please fill in this field.",
      contactError: "Enter a WhatsApp number with area code or a valid email.",
      messageIntro:
        "Hello, ATC team! I took the Import Diagnosis and would like to claim my Feasibility Session.",
      profileMessageLabel: "Profile",
      contactMessageLabel: "WhatsApp / Email",
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
      kicker: "进口诊断",
      profilesLabel: "4 种进口商画像",
      title: "了解贵公司的进口画像与潜力",
      description:
        "回答 4 个简单问题，了解贵公司适合哪种进口经验模式，并在最后解锁一项专属权益。",
      progressLabel: "第 {current} 题，共 {total} 题",
      backLabel: "返回",
      questions: [
        {
          question: "考虑为公司开展进口时，您最看重什么？",
          options: [
            "通过降低产品单位成本来提高利润率。",
            "获取巴西市场没有的独家产品和技术。",
            "扩大生产规模，确保持续稳定的供应。",
            "仍在评估进口对我的业务是否可行。",
          ],
        },
        {
          question:
            "开始或扩大进口业务时，贵公司最期待获得什么？最担心失去什么？",
          options: [
            "收获：高盈利能力／顾虑：税务繁琐与运营风险。",
            "收获：质量把控与自有品牌／顾虑：中国供应商不可靠。",
            "收获：市场竞争力／顾虑：交期长与国际运费高。",
            "收获：产品组合多元化／顾虑：缺乏流程专业知识。",
          ],
        },
        {
          question: "未来 12 个月，贵公司的主要目标是什么？",
          options: [
            "在充分保障下从零开始进口。",
            "优化现有进口业务的成本。",
            "直接与中国工厂开发定制（OEM）产品。",
            "只是想了解国际市场如何运作。",
          ],
        },
        {
          question: "贵公司进口业务的预计规模或投资范围是多少？",
          options: [
            "起步阶段／市场测试（小批量订单或拼箱）。",
            "中等规模的持续采购（定期补货）。",
            "大规模运营／工厂直发整柜（FCL）。",
            "尚未确定预算，需要可行性研究。",
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
        fields: {
          company: { label: "公司名称", placeholder: "贵公司名称" },
          name: { label: "您的姓名", placeholder: "我们该如何称呼您？" },
          contact: {
            label: "WhatsApp（含区号）或企业邮箱",
            placeholder: "+55 00 00000-0000 或 you@yourcompany.com",
          },
        },
        submitLabel: "领取诊断结果并在 WhatsApp 沟通",
      },
      restartLabel: "重新诊断",
      analyzingTitle: "正在计算您的画像…",
      completedEyebrow: "您的结果",
      openResultLabel: "查看结果并领取权益",
      closeLabel: "关闭",
      requiredError: "请填写此项。",
      contactError: "请输入含区号的 WhatsApp 号码或有效的电子邮件。",
      messageIntro: "您好，ATC 团队！我完成了进口诊断，想领取可行性评估会议。",
      profileMessageLabel: "画像",
      contactMessageLabel: "WhatsApp／电子邮件",
    },
    footer: {
      description: "国际进口、出口与采购解决方案。",
      rights: "版权所有。",
    },
  },
} as const;

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
    hero: {
      title: "Trading, Sourcing & Inteligência Comercial Internacional",
      description:
        "Soluções estruturadas para empresas que desejam importar, exportar e operar no mercado global com segurança, estratégia e escala.",
      primaryCtaLabel: "Falar com nosso time",
      primaryCtaMessage: "Olá, quero falar com o time da ATC.",
      secondaryCtaLabel: "Como funciona",
      newsCtaLabel: "Clique e acompanhe as notícias do mercado",
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
    hero: {
      title: "International import, export and sourcing solutions",
      description:
        "We connect your company directly with the world's best factories, combining security, strategy and local presence in China.",
      primaryCtaLabel: "Talk to our team",
      primaryCtaMessage: "Hello, I would like to talk to the ATC team.",
      secondaryCtaLabel: "How it works",
      newsCtaLabel: "Click to follow market news",
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
    hero: {
      title: "国际进口、出口与采购解决方案",
      description:
        "我们将您的企业直接连接到全球优质工厂，以安全、策略和中国本地执行能力推动业务发展。",
      primaryCtaLabel: "联系我们的团队",
      primaryCtaMessage: "您好，我想与 ATC 团队沟通。",
      secondaryCtaLabel: "运作方式",
      newsCtaLabel: "点击关注市场新闻",
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
      description:
        "关注市场、企业、大宗商品和影响国际决策的指标的最新报道。",
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
    footer: {
      description: "国际进口、出口与采购解决方案。",
      rights: "版权所有。",
    },
  },
} as const;

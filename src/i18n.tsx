import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';

/** 支持的语言。 */
export type Lang = 'zh' | 'en';

/** 导航项（中文/英文共用同一路由路径）。 */
export interface NavItem {
  label: string;
  to: string;
}

/** 看板侧边栏导航项。 */
export interface DashNavItem {
  key: string;
  label: string;
  to: string;
}

/** 能力卡片。 */
export interface Capability {
  title: string;
  desc: string;
}

/** 工作流步骤。 */
export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}

/** 常见问题。 */
export interface Faq {
  q: string;
  a: string;
}

/** 政策/条款章节。 */
export interface ContentSection {
  title: string;
  paragraphs: string[];
}

/** 演示页文案结构。 */
export interface DemoContent {
  title: string;
  subtitle: string;
  advertiserLabel: string;
  kpiGmv: string;
  kpiRoas: string;
  kpiSpend: string;
  kpiConversions: string;
  kpiCtr: string;
  trendTitle: string;
  legendGmv: string;
  legendSpend: string;
  rulesTitle: string;
  logsTitle: string;
  lastTriggered: string;
  enabled: string;
  disabled: string;
  simulatedNote: string;
}

/** 看板文案结构。 */
export interface DashboardContent {
  nav: DashNavItem[];
  common: {
    demoData: string;
    loading: string;
    empty: string;
    exportCsv: string;
    enabled: string;
    disabled: string;
    all: string;
    range7: string;
    range30: string;
  };
  overview: {
    title: string;
    subtitle: string;
    trendTitle: string;
    legendGmv: string;
    legendSpend: string;
    storesTitle: string;
    recentTitle: string;
    colStore: string;
    colAdvertiser: string;
    colRegion: string;
    colType: string;
    colGmv: string;
    colSpend: string;
    colRoas: string;
    colConversions: string;
    colOrders: string;
    colCtr: string;
    colStatus: string;
  };
  campaigns: {
    title: string;
    subtitle: string;
    filterStatus: string;
    filterObjective: string;
    statusActive: string;
    statusPaused: string;
    statusEnded: string;
    objAwareness: string;
    objConsideration: string;
    objConversion: string;
    colName: string;
    colStore: string;
    colStatus: string;
    colObjective: string;
    colBudget: string;
    colSpend: string;
    colGmv: string;
    colRoas: string;
    colConversions: string;
    creativesTitle: string;
    productsTitle: string;
    colCreative: string;
    colImpressions: string;
    colClicks: string;
    colCtr: string;
    colProduct: string;
    colSku: string;
    colPrice: string;
    colOrders: string;
    empty: string;
  };
  rules: {
    title: string;
    subtitle: string;
    colName: string;
    colStore: string;
    colCondition: string;
    colPlan: string;
    colStatus: string;
    colTriggers: string;
    newRule: string;
    newRuleTitle: string;
    fieldLabel: string;
    operatorLabel: string;
    valueLabel: string;
    planTypeLabel: string;
    createBtn: string;
    cancelBtn: string;
    addCondition: string;
    vizTitle: string;
    vizCondition: string;
    vizAction: string;
  };
  automation: {
    title: string;
    subtitle: string;
    configTitle: string;
    triggerCount: string;
  };
  metrics: {
    title: string;
    subtitle: string;
    tabCreative: string;
    tabProduct: string;
    trendTitle: string;
    colName: string;
    colParent: string;
    colImpressions: string;
    colClicks: string;
    colCtr: string;
    colGmv: string;
    colOrders: string;
    colConversions: string;
    colRoas: string;
  };
  logs: {
    title: string;
    subtitle: string;
    filterRule: string;
    filterResult: string;
    colTime: string;
    colStore: string;
    colRule: string;
    colAction: string;
    colResult: string;
    colImpactGmv: string;
    empty: string;
  };
  accounts: {
    title: string;
    subtitle: string;
    colName: string;
    colAdvertiser: string;
    colType: string;
    colRegion: string;
    colStatus: string;
    colGmv: string;
    colMembers: string;
    membersCount: string;
  };
}

/** TikTok OAuth 演示流程文案结构。 */
export interface OAuthContent {
  sectionTitle: string;
  sectionSubtitle: string;
  connectButton: string;
  connectedBadge: string;
  accountLabel: string;
  disconnect: string;
  pageHeading: string;
  simulatedBanner: string;
  demoNote: string;
  authPrompt: string;
  scopeTitle: string;
  scopeBasic: string;
  scopeAd: string;
  authorize: string;
  cancel: string;
  authorized: string;
  returning: string;
  backToConsole: string;
}

/** 全站文案结构。 */
export interface Content {
  nav: {
    links: NavItem[];
    cta: string;
    demo: { zh: string; en: string };
    dashboard: { zh: string; en: string };
  };
  landing: {
    eyebrow: string;
    heroTitle: string;
    heroSub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    capabilitiesTitle: string;
    capabilitiesSub: string;
    capabilities: Capability[];
    workflowTitle: string;
    workflowSub: string;
    workflow: WorkflowStep[];
    faqTitle: string;
    faqSub: string;
    faqs: Faq[];
    ctaTitle: string;
    ctaSub: string;
    ctaButton: string;
  };
  privacy: {
    title: string;
    updatedLabel: string;
    updatedAt: string;
    intro: string;
    sections: ContentSection[];
    draftNote: string;
  };
  terms: {
    title: string;
    updatedLabel: string;
    updatedAt: string;
    intro: string;
    sections: ContentSection[];
    draftNote: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
  demo: DemoContent;
  dashboard: DashboardContent;
  oauth: OAuthContent;
}

/** 全站文案：按语言组织，中文保留原意，英文为专业、克制、不夸大的对应翻译。 */
export const content: Record<Lang, Content> = {
  zh: {
    nav: {
      links: [
        { label: '产品介绍', to: '/' },
        { label: '隐私政策', to: '/privacy' },
        { label: '服务条款', to: '/terms' },
      ],
      cta: '申请试用',
      demo: { zh: '演示', en: 'Demo' },
      dashboard: { zh: '数据看板', en: 'Dashboard' },
    },
    landing: {
      eyebrow: 'TIKTOK GMV MAX · 智能投放',
      heroTitle: '用数据驱动的智能投放，最大化你的 TikTok GMV',
      heroSub:
        'GMVMAX 面向电商广告主，提供智能规则生成、实时指标监控与自动化投放执行，让 GMV Max 投放更省心、更高效。',
      ctaPrimary: '申请试用',
      ctaSecondary: '了解隐私保护',
      capabilitiesTitle: '核心能力',
      capabilitiesSub: '围绕 GMV 最大化，构建从洞察到执行的完整闭环',
      capabilities: [
        {
          title: '智能规则生成',
          desc: '基于广告表现数据，自动生成投放优化规则，将运营经验沉淀为可复用的策略模板。',
        },
        {
          title: '实时指标监控',
          desc: 'GMV、ROAS、消耗、转化等核心指标看板，分钟级更新，异常波动即时预警。',
        },
        {
          title: '自动化投放执行',
          desc: '按既定规则自动调整预算与出价，减少人工盯盘，让投放策略持续在线运行。',
        },
        {
          title: '多账户管理',
          desc: '支持多广告主、多店铺的统一管理，账户与权限隔离，协作清晰可控。',
        },
      ],
      workflowTitle: '工作流程',
      workflowSub: '四步上手，让智能投放稳定运行',
      workflow: [
        { step: '01', title: '授权连接', desc: '通过 TikTok 开发者平台授权，安全读取广告账户数据。' },
        { step: '02', title: '策略配置', desc: '选择或自定义优化规则，设定预算与出价边界。' },
        { step: '03', title: '自动执行', desc: '系统按规则持续监控并执行投放调整。' },
        { step: '04', title: '复盘优化', desc: '基于实时指标复盘效果，迭代规则以获得更优 GMV。' },
      ],
      faqTitle: '常见问题',
      faqSub: '关于产品、数据与安全的常见疑问',
      faqs: [
        {
          q: 'GMVMAX 会直接修改我的广告账户吗？',
          a: 'GMVMAX 仅在您授权的范围内、按您设定的规则边界执行预算与出价调整，所有操作可追溯、可随时暂停。',
        },
        {
          q: '数据安全如何保障？',
          a: '我们遵循最小权限原则，数据加密存储与传输，绝不将您的广告数据用于与您无关的商业用途。详见《隐私政策》。',
        },
        {
          q: '支持哪些类型的广告主？',
          a: '面向使用 TikTok GMV Max 产品的电商广告主，支持多店铺、多账户统一管理。',
        },
      ],
      ctaTitle: '准备好提升你的 TikTok GMV 了吗？',
      ctaSub: '提交申请，我们的团队将与你联系，协助完成 TikTok 开发者平台授权与投放策略配置。',
      ctaButton: '申请试用',
    },
    privacy: {
      title: '隐私政策',
      updatedLabel: '最后更新日期：',
      updatedAt: '2026年7月25日',
      intro:
        '欢迎使用 GMVMAX（以下简称“本服务”）。本隐私政策说明我们在您使用本服务过程中如何收集、使用、存储与共享您的个人信息，以及您所享有的相关权利。请在开通与使用本服务前仔细阅读本政策。',
      sections: [
        {
          title: '1. 我们收集的数据类型',
          paragraphs: [
            '账户信息：您在注册或开通服务时提供的企业名称、联系人姓名、电子邮箱、登录凭证及必要的资质信息。',
            '使用与诊断数据：为提供稳定的服务，我们会收集必要的技术日志（如访问时间、设备与浏览器类型、页面交互聚合数据），用于故障排查、安全风控与产品改进。',
          ],
        },
        {
          title: '2. TikTok 广告数据授权范围',
          paragraphs: [
            '在您通过 TikTok 开发者平台完成授权后，我们仅在您授予的权限范围内读取广告账户相关的表现数据，包括但不限于广告系列、广告组与创意信息，消耗、GMV、ROAS、转化与订单数据，以及受众、投放地域与时段等投放配置信息。我们不会超出授权范围访问您账户的其它数据。',
            '所有数据收集与处理均严格遵循 TikTok API 规范及 TikTok 开发者平台的相关要求，仅在您授权的范围内进行。',
          ],
        },
        {
          title: '3. 数据使用目的',
          paragraphs: [
            '向您展示 GMV、ROAS、消耗、转化等实时指标看板；',
            '基于广告表现数据生成投放优化规则，并依据您设定的边界执行预算与出价调整；',
            '提供客户支持、处理您的咨询与请求；',
            '保障服务安全，防范欺诈、滥用与未授权访问；',
            '在法律法规允许的范围内改进产品功能与体验。',
          ],
        },
        {
          title: '4. 与第三方（TikTok）的数据共享',
          paragraphs: [
            '为实现广告管理能力，本服务依赖 TikTok 平台的官方 API 及其授权体系。在您授权范围内，相关广告数据会按照 TikTok 平台的接口规则与您指定的广告账户进行交互（读取指标、下达预算/出价调整指令）。',
            '除 TikTok 平台外，我们仅在以下情形下向第三方提供您的个人信息：(1) 为安全托管与运行所必需、并与我们签署保密义务的云服务提供商；(2) 根据法律法规要求或有权机关的合法请求；(3) 经您另行明确同意。',
            '我们不会向任何无关第三方出售您的个人信息，也不会将其用于与您无关的定向广告或商业变现。',
          ],
        },
        {
          title: '5. 您的权利',
          paragraphs: [
            '您对自己的个人信息享有访问、更正与删除的权利；',
            '您可随时在 TikTok 平台撤回对 GMVMAX 的授权，撤回后我们将停止读取新的广告数据；',
            '您有权要求导出您的账户数据，或在账户注销后要求我们删除相关数据；',
            '若您认为我们处理个人信息的方式违反了适用法律，您有权向相关监管部门投诉。',
          ],
        },
        {
          title: '6. 数据保留期限',
          paragraphs: [
            '在您账户存续期间，我们保留为提供本服务所必需的个人信息与广告数据。',
            '当您注销账户或撤回授权后，我们将在合理期限内删除或匿名化处理您的个人信息，法律法规要求更长保留期限的除外。',
          ],
        },
        {
          title: '7. 联系方式与数据保护官（DPO）',
          paragraphs: [
            '如您对本隐私政策或我们的数据处理方式有任何疑问，可通过以下方式联系我们：hali@paofou.vip。',
            '我们将在收到请求后的合理时间内予以响应与处理。',
            '我们已设立数据保护官（DPO）专职负责个人信息保护与数据合规事务，您可经 hali@paofou.vip 联系 DPO，我们将在合理时间内予以响应。',
          ],
        },
        {
          title: '8. 儿童与未成年人数据保护',
          paragraphs: [
            '本服务不面向未满 18 周岁的未成年人，我们不会故意收集儿童的个人数据。',
            '若我们发现误收集了儿童的个人数据，将立即予以删除并向其监护人说明情况。',
            '父母或监护人如发现儿童数据被误收集，可通过 hali@paofou.vip 申请删除相关个人数据。',
          ],
        },
        {
          title: '9. 管辖法律与印尼数据合规',
          paragraphs: [
            '本服务遵守印度尼西亚 2022 年第 27 号《个人数据保护法》（Undang-Undang Pelindungan Data Pribadi，简称 PDP Law），并严格遵循 TikTok API 规范处理数据。',
            '本服务的数据控制者为 PT TTBIG BOOM INDONESIA（以下简称“本公司”）。',
            '本政策的解释、效力及由此产生的任何争议，均受印度尼西亚法律管辖，相关争议提交印度尼西亚有管辖权的法院处理。',
          ],
        },
      ],
      draftNote: '本隐私政策为产品草案说明，最终条款以正式上线版本为准。',
    },
    terms: {
      title: '服务条款',
      updatedLabel: '最后更新日期：',
      updatedAt: '2026年7月25日',
      intro:
        '欢迎使用 GMVMAX（以下简称“本服务”）。本服务条款约定您使用本服务过程中的权利与义务。使用本服务即表示您同意以下条款。',
      sections: [
        {
          title: '1. 使用资格',
          paragraphs: [
            '您须为具有完全民事行为能力的自然人、法人或其他组织，并拥有合法使用 TikTok 广告账户的权限。',
            '您在使用本服务前，应已阅读并同意本服务条款及《隐私政策》。如您代表企业使用本服务，您声明已获得该企业的合法授权。',
            '我们保留基于合规与安全考量，决定是否向特定用户提供服务、或暂停/终止服务的权利。',
          ],
        },
        {
          title: '2. 账户责任',
          paragraphs: [
            '您应对账户凭证的安全负责，并对账户下发生的所有活动承担责任。',
            '您通过 TikTok 平台授权本服务访问的广告账户，其投放行为仍需遵守 TikTok 平台的相关政策与条款。',
            '如发生未授权使用或安全事件，您应及时通知我们，并同时在 TikTok 平台调整授权范围。',
          ],
        },
        {
          title: '3. 服务范围与限制',
          paragraphs: [
            '本服务通过 TikTok 官方 API 提供指标监控、规则生成与自动化投放执行等能力，其可用性受 TikTok 平台接口与授权范围约束。',
            '自动化投放调整仅在您设定的规则边界内执行，最终结果以 TikTok 平台实际生效为准。',
            '我们不对因平台接口变更、网络故障、不可抗力或您账户本身限制而导致的服务中断或投放偏差承担责任。',
            '本服务的数据收集与处理严格遵循 TikTok API 规范，仅在授权范围内进行。',
          ],
        },
        {
          title: '4. 免责声明',
          paragraphs: [
            '本服务按“现状”提供，在法律允许的最大范围内，我们对服务的适用性、准确性与不间断性不作明示或暗示担保。',
            '广告投放效果受市场、创意、商品与平台策略等多重因素影响，本服务不对任何 GMV、ROAS 或其它业务结果作出承诺或保证。',
            '因使用或无法使用本服务而产生的间接、附带或 consequential 损失，我们不承担责任。',
          ],
        },
        {
          title: '5. 终止条款',
          paragraphs: [
            '您可随时停止使用本服务，并在 TikTok 平台撤回授权、注销账户。',
            '若您违反本服务条款，我们可暂停或终止对您提供服务，并保留追究相应责任的权利。',
            '服务终止后，我们将按照《隐私政策》处理您留存的数据。',
          ],
        },
        {
          title: '6. 法律适用',
          paragraphs: [
            '本服务条款的解释、效力及争议解决，适用相关司法管辖区的法律。',
            '因本服务条款引起的或与之相关的任何争议，双方应首先友好协商解决；协商不成的，任一方均可向有管辖权的人民法院提起诉讼。',
            '本条款中部分内容被认定为无效的，不影响其余条款的效力。',
          ],
        },
      ],
      draftNote: '本服务条款为产品草案说明，最终条款以正式上线版本为准。',
    },
    footer: {
      tagline: 'TikTok GMV Max 智能投放系统',
      copyright: 'GMVMAX. 保留所有权利。本网站为产品草案，用于 TikTok 开发者平台 API 申请。',
    },
    demo: {
      title: '产品演示',
      subtitle: '演示环境 · 全部数据均为模拟生成，用于展示 GMV Max 智能投放看板的交互效果。',
      advertiserLabel: '广告主',
      kpiGmv: 'GMV（14 日）',
      kpiRoas: 'ROAS',
      kpiSpend: '消耗（14 日）',
      kpiConversions: '转化数',
      kpiCtr: 'CTR',
      trendTitle: '14 日趋势（GMV vs 消耗）',
      legendGmv: 'GMV',
      legendSpend: '消耗',
      rulesTitle: '智能投放规则',
      logsTitle: '模拟执行日志',
      lastTriggered: '最近触发',
      enabled: '启用',
      disabled: '停用',
      simulatedNote: '本页数据为演示用模拟数据，不代表任何真实广告账户表现。',
    },
    dashboard: {
      nav: [
        { key: 'overview', label: '总览', to: '/dashboard' },
        { key: 'campaigns', label: '投放系列', to: '/dashboard/campaigns' },
        { key: 'rules', label: '智能规则', to: '/dashboard/rules' },
        { key: 'automation', label: '自动化', to: '/dashboard/automation' },
        { key: 'metrics', label: '指标分析', to: '/dashboard/metrics' },
        { key: 'logs', label: '执行日志', to: '/dashboard/logs' },
        { key: 'accounts', label: '账户管理', to: '/dashboard/accounts' },
      ],
      common: {
        demoData: '演示数据 · Demo Data（全部为模拟生成）',
        loading: '加载中…',
        empty: '暂无数据',
        exportCsv: '导出 CSV',
        enabled: '启用',
        disabled: '停用',
        all: '全部',
        range7: '近 7 天',
        range30: '近 30 天',
      },
      overview: {
        title: '总览',
        subtitle: 'GMV Max 智能投放核心指标与近期动态一览。',
        trendTitle: 'GMV 与消耗趋势',
        legendGmv: 'GMV',
        legendSpend: '消耗',
        storesTitle: '店铺与账户概览',
        recentTitle: '近期执行动作',
        colStore: '店铺',
        colAdvertiser: '广告主',
        colRegion: '地区',
        colType: '类型',
        colGmv: 'GMV',
        colSpend: '消耗',
        colRoas: 'ROAS',
        colConversions: '转化数',
        colOrders: '订单数',
        colCtr: 'CTR',
        colStatus: '状态',
      },
      campaigns: {
        title: '投放系列',
        subtitle: '查看各店铺投放系列的表现，并下钻至创意与商品明细。',
        filterStatus: '按状态筛选',
        filterObjective: '按目标筛选',
        statusActive: '投放中',
        statusPaused: '已暂停',
        statusEnded: '已结束',
        objAwareness: '品牌曝光',
        objConsideration: '兴趣种草',
        objConversion: '转化成交',
        colName: '系列名称',
        colStore: '店铺',
        colStatus: '状态',
        colObjective: '目标',
        colBudget: '预算',
        colSpend: '消耗',
        colGmv: 'GMV',
        colRoas: 'ROAS',
        colConversions: '转化数',
        creativesTitle: '创意明细',
        productsTitle: '商品明细',
        colCreative: '创意',
        colImpressions: '曝光',
        colClicks: '点击',
        colCtr: 'CTR',
        colProduct: '商品',
        colSku: 'SKU',
        colPrice: '单价',
        colOrders: '订单',
        empty: '没有符合条件的投放系列',
      },
      rules: {
        title: '智能规则',
        subtitle: '管理自动化投放规则，配置触发条件与执行计划。',
        colName: '规则名称',
        colStore: '店铺',
        colCondition: '触发条件',
        colPlan: '执行计划',
        colStatus: '状态',
        colTriggers: '触发次数',
        newRule: '新建规则',
        newRuleTitle: '新建投放规则',
        fieldLabel: '条件字段',
        operatorLabel: '运算符',
        valueLabel: '阈值',
        planTypeLabel: '执行计划',
        createBtn: '创建规则',
        cancelBtn: '取消',
        addCondition: '添加条件',
        vizTitle: '条件 → 动作 逻辑',
        vizCondition: '触发条件',
        vizAction: '执行动作',
      },
      automation: {
        title: '自动化',
        subtitle: '五种执行计划类型，覆盖预算、出价、开关、通知与批量放量。',
        configTitle: '配置项',
        triggerCount: '累计触发',
      },
      metrics: {
        title: '指标分析',
        subtitle: '按创意与商品维度查看曝光、点击、GMV 与转化表现。',
        tabCreative: '创意维度',
        tabProduct: '商品维度',
        trendTitle: 'Top 表现趋势',
        colName: '名称',
        colParent: '归属',
        colImpressions: '曝光',
        colClicks: '点击',
        colCtr: 'CTR',
        colGmv: 'GMV',
        colOrders: '订单',
        colConversions: '转化',
        colRoas: 'ROAS',
      },
      logs: {
        title: '执行日志',
        subtitle: '查看规则触发的执行记录与对 GMV 的影响。',
        filterRule: '按规则筛选',
        filterResult: '按结果筛选',
        colTime: '时间',
        colStore: '店铺',
        colRule: '规则',
        colAction: '动作',
        colResult: '结果',
        colImpactGmv: '影响 GMV',
        empty: '没有符合条件的执行日志',
      },
      accounts: {
        title: '账户管理',
        subtitle: '管理多店铺与多广告主账户，隔离数据与权限。',
        colName: '店铺',
        colAdvertiser: '广告主',
        colType: '类型',
        colRegion: '地区',
        colStatus: '绑定状态',
        colGmv: 'GMV 汇总',
        colMembers: '成员',
        membersCount: '位成员',
      },
    },
    oauth: {
      sectionTitle: 'TikTok 账号绑定',
      sectionSubtitle: '通过 OAuth 授权，将你的 TikTok 广告账户连接到 GMVMAX（演示）。',
      connectButton: '绑定 TikTok 账号',
      connectedBadge: '已连接 TikTok 账号',
      accountLabel: '演示账号',
      disconnect: '断开连接',
      pageHeading: '登录 TikTok',
      simulatedBanner: '仿真 TikTok 授权页（演示用，非真实登录）',
      demoNote: '* 演示授权逻辑（DEMO client_id，非真实凭证）',
      authPrompt: 'gmvmax-center 想要访问你的 TikTok 广告账户',
      scopeTitle: '此应用将获得以下权限',
      scopeBasic: '基础用户信息',
      scopeAd: '广告账户读取',
      authorize: '授权并连接',
      cancel: '取消',
      authorized: 'TikTok 账号授权成功',
      returning: '正在返回 gmvmax-center…',
      backToConsole: '返回控制台',
    },
  },
  en: {
    nav: {
      links: [
        { label: 'Product', to: '/' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
      ],
      cta: 'Request a Trial',
      demo: { zh: '演示', en: 'Demo' },
      dashboard: { zh: '数据看板', en: 'Dashboard' },
    },
    landing: {
      eyebrow: 'TIKTOK GMV MAX · SMART DELIVERY',
      heroTitle: 'Data-driven smart delivery to maximize your TikTok GMV',
      heroSub:
        'GMVMAX serves e-commerce advertisers with intelligent rule generation, real-time metrics monitoring, and automated delivery execution—making GMV Max campaigns easier and more efficient to run.',
      ctaPrimary: 'Request a Trial',
      ctaSecondary: 'Learn About Privacy',
      capabilitiesTitle: 'Core Capabilities',
      capabilitiesSub: 'A complete loop from insight to execution, built around maximizing GMV',
      capabilities: [
        {
          title: 'Smart Rule Generation',
          desc: 'Automatically generate optimization rules from ad performance data, turning operational experience into reusable strategy templates.',
        },
        {
          title: 'Real-time Metrics Monitoring',
          desc: 'Dashboards for core metrics such as GMV, ROAS, spend, and conversions, updated minute by minute with instant alerts on abnormal fluctuations.',
        },
        {
          title: 'Automated Delivery Execution',
          desc: 'Automatically adjust budgets and bids according to set rules, reducing manual monitoring and keeping your strategy running continuously.',
        },
        {
          title: 'Multi-account Management',
          desc: 'Unified management across multiple advertisers and stores, with account and permission isolation for clear, controlled collaboration.',
        },
      ],
      workflowTitle: 'How It Works',
      workflowSub: 'Get started in four steps and keep smart delivery running stably',
      workflow: [
        {
          step: '01',
          title: 'Connect & Authorize',
          desc: 'Authorize via the TikTok Developer Platform to securely read your ad account data.',
        },
        {
          step: '02',
          title: 'Configure Strategy',
          desc: 'Choose or customize optimization rules, and set budget and bid boundaries.',
        },
        {
          step: '03',
          title: 'Run Automatically',
          desc: 'The system continuously monitors and executes delivery adjustments per your rules.',
        },
        {
          step: '04',
          title: 'Review & Optimize',
          desc: 'Review performance against real-time metrics and iterate on rules to achieve better GMV.',
        },
      ],
      faqTitle: 'Frequently Asked Questions',
      faqSub: 'Common questions about the product, data, and security',
      faqs: [
        {
          q: 'Will GMVMAX modify my ad account directly?',
          a: 'GMVMAX only adjusts budgets and bids within the scope you authorize and the rule boundaries you set. All actions are traceable and can be paused at any time.',
        },
        {
          q: 'How is my data secured?',
          a: 'We follow the principle of least privilege and encrypt data at rest and in transit. We never use your ad data for unrelated commercial purposes. See our Privacy Policy.',
        },
        {
          q: 'What kinds of advertisers are supported?',
          a: 'We serve e-commerce advertisers using TikTok GMV Max, with unified management across multiple stores and accounts.',
        },
      ],
      ctaTitle: 'Ready to grow your TikTok GMV?',
      ctaSub:
        'Submit a request and our team will reach out to help you complete TikTok Developer Platform authorization and delivery strategy configuration.',
      ctaButton: 'Request a Trial',
    },
    privacy: {
      title: 'Privacy Policy',
      updatedLabel: 'Last updated: ',
      updatedAt: 'July 25, 2026',
      intro:
        'Welcome to GMVMAX (referred to as “the Service”). This Privacy Policy explains how we collect, use, store, and share your personal information when you use the Service, as well as the rights you have. Please read this policy carefully before activating and using the Service.',
      sections: [
        {
          title: '1. Types of Data We Collect',
          paragraphs: [
            'Account information: the company name, contact name, email address, login credentials, and required qualification information you provide when registering or activating the service.',
            'Usage and diagnostic data: to provide a stable service, we collect necessary technical logs (such as access time, device and browser type, and aggregated page interaction data) for troubleshooting, security risk control, and product improvement.',
          ],
        },
        {
          title: '2. Scope of TikTok Ad Data Authorization',
          paragraphs: [
            'After you complete authorization through the TikTok Developer Platform, we only read performance data related to your ad account within the permissions you grant. This includes, but is not limited to, campaign, ad group, and creative information; spend, GMV, ROAS, conversion, and order data; and targeting, delivery region, and schedule configuration. We will not access other data in your account beyond the authorized scope.',
            'All data collection and processing strictly follow the TikTok API specifications and the requirements of the TikTok Developer Platform, and are conducted only within your authorized scope.',
          ],
        },
        {
          title: '3. Purposes of Data Use',
          paragraphs: [
            'To display real-time dashboards of metrics such as GMV, ROAS, spend, and conversions;',
            'To generate delivery optimization rules from ad performance data and execute budget and bid adjustments within the boundaries you set;',
            'To provide customer support and handle your inquiries and requests;',
            'To secure the service and prevent fraud, abuse, and unauthorized access;',
            'To improve product features and experience within the limits permitted by law.',
          ],
        },
        {
          title: '4. Data Sharing with Third Parties (TikTok)',
          paragraphs: [
            'To deliver ad management capabilities, this service relies on TikTok’s official API and authorization framework. Within your authorized scope, relevant ad data is exchanged with the ad accounts you designate according to TikTok’s API rules (reading metrics and issuing budget/bid adjustment instructions).',
            'Beyond the TikTok platform, we only share your personal information with third parties in the following cases: (1) cloud service providers necessary for secure hosting and operation, bound by confidentiality obligations; (2) where required by law or by a legitimate request from an authorized authority; (3) with your explicit separate consent.',
            'We will not sell your personal information to any unrelated third party, nor use it for unrelated targeted advertising or commercial monetization.',
          ],
        },
        {
          title: '5. Your Rights',
          paragraphs: [
            'You have the right to access, correct, and delete your personal information;',
            'You may revoke GMVMAX’s authorization on the TikTok platform at any time, after which we will stop reading new ad data;',
            'You may request an export of your account data, or ask us to delete the relevant data after your account is closed;',
            'If you believe our handling of personal information violates applicable law, you have the right to file a complaint with the relevant supervisory authority.',
          ],
        },
        {
          title: '6. Data Retention Period',
          paragraphs: [
            'While your account is active, we retain the personal information and ad data necessary to provide this service.',
            'After you close your account or revoke authorization, we will delete or anonymize your personal information within a reasonable period, except where a longer retention period is required by law.',
          ],
        },
        {
          title: '7. Contact and Data Protection Officer (DPO)',
          paragraphs: [
            'If you have any questions about this Privacy Policy or how we process data, you can contact us at: hali@paofou.vip.',
            'We will respond to and process your request within a reasonable time after receiving it.',
            'We have appointed a Data Protection Officer (DPO) responsible for personal data protection and compliance. You may contact the DPO at hali@paofou.vip, and we will respond within a reasonable time.',
          ],
        },
        {
          title: '8. Children and Minor Data Protection',
          paragraphs: [
            'This Service is not directed to users under the age of 18, and we do not knowingly collect personal data from children.',
            'If we discover that we have inadvertently collected a child’s personal data, we will delete it promptly and inform the guardian where feasible.',
            'Parents or guardians who believe a child’s data was collected in error may request deletion via hali@paofou.vip.',
          ],
        },
        {
          title: '9. Governing Law and Indonesia Data Compliance',
          paragraphs: [
            'This Service complies with Indonesia’s Personal Data Protection Law No. 27 of 2022 (Undang-Undang Pelindungan Data Pribadi, “PDP Law”) and strictly follows the TikTok API specifications in processing data.',
            'The data controller of this Service is PT TTBIG BOOM INDONESIA (the “Company”).',
            'The interpretation, validity, and any dispute arising from this policy are governed by the laws of Indonesia, and any dispute shall be submitted to the competent court in Indonesia.',
          ],
        },
      ],
      draftNote: 'This Privacy Policy is a product draft. The final terms are subject to the official launched version.',
    },
    terms: {
      title: 'Terms of Service',
      updatedLabel: 'Last updated: ',
      updatedAt: 'July 25, 2026',
      intro:
        'Welcome to GMVMAX (referred to as “the Service”). These Terms of Service set out your rights and obligations when using the Service. By using the Service, you agree to the following terms.',
      sections: [
        {
          title: '1. Eligibility',
          paragraphs: [
            'You must be a natural person, legal entity, or organization with full civil capacity, and have the lawful right to use a TikTok ad account.',
            'Before using the Service, you should have read and agreed to these Terms of Service and the Privacy Policy. If you use the Service on behalf of an organization, you represent that you are duly authorized to do so.',
            'We reserve the right, based on compliance and security considerations, to decide whether to provide the Service to a given user, or to suspend or terminate the Service.',
          ],
        },
        {
          title: '2. Account Responsibility',
          paragraphs: [
            'You are responsible for the security of your account credentials and for all activities that occur under your account.',
            'Ad accounts you authorize the Service to access via the TikTok platform remain subject to TikTok’s own policies and terms for delivery activities.',
            'If any unauthorized use or security incident occurs, you should promptly notify us and adjust the authorization scope on the TikTok platform at the same time.',
          ],
        },
        {
          title: '3. Scope and Limitations of the Service',
          paragraphs: [
            'The Service provides capabilities such as metrics monitoring, rule generation, and automated delivery execution through TikTok’s official API, and its availability is constrained by TikTok’s interfaces and your authorized scope.',
            'Automated delivery adjustments are executed only within the rule boundaries you set, and the final result is subject to what takes effect on the TikTok platform.',
            'We are not liable for service interruptions or delivery deviations caused by platform API changes, network failures, force majeure, or limitations of your own account.',
            'The Service’s data collection and processing strictly follow the TikTok API specifications and are conducted only within the authorized scope.',
          ],
        },
        {
          title: '4. Disclaimer',
          paragraphs: [
            'The Service is provided “as is.” To the maximum extent permitted by law, we make no express or implied warranties regarding its suitability, accuracy, or uninterrupted availability.',
            'Ad performance is affected by many factors including the market, creatives, products, and platform policies. The Service makes no commitment or guarantee regarding any GMV, ROAS, or other business outcomes.',
            'We are not liable for any indirect, incidental, or consequential losses arising from the use of or inability to use the Service.',
          ],
        },
        {
          title: '5. Termination',
          paragraphs: [
            'You may stop using the Service at any time, and revoke authorization and close your account on the TikTok platform.',
            'If you violate these Terms of Service, we may suspend or terminate the Service for you and reserve the right to pursue corresponding liability.',
            'After termination, we will handle your retained data in accordance with the Privacy Policy.',
          ],
        },
        {
          title: '6. Governing Law',
          paragraphs: [
            'The interpretation, validity, and dispute resolution of these Terms of Service are governed by the laws of the relevant jurisdiction.',
            'Any dispute arising from or relating to these Terms shall first be resolved through friendly negotiation between the parties; if negotiation fails, either party may bring a lawsuit before a court of competent jurisdiction.',
            'If any part of these Terms is deemed invalid, the remaining provisions shall remain in effect.',
          ],
        },
      ],
      draftNote: 'These Terms of Service are a product draft. The final terms are subject to the official launched version.',
    },
    footer: {
      tagline: 'TikTok GMV Max Smart Delivery System',
      copyright:
        'GMVMAX. All rights reserved. This website is a product draft for the TikTok Developer Platform API application.',
    },
    demo: {
      title: 'Product Demo',
      subtitle: 'Demo environment · All data is simulated to showcase the interactive GMV Max smart delivery dashboard.',
      advertiserLabel: 'Advertiser',
      kpiGmv: 'GMV (14d)',
      kpiRoas: 'ROAS',
      kpiSpend: 'Spend (14d)',
      kpiConversions: 'Conversions',
      kpiCtr: 'CTR',
      trendTitle: '14-Day Trend (GMV vs Spend)',
      legendGmv: 'GMV',
      legendSpend: 'Spend',
      rulesTitle: 'Smart Delivery Rules',
      logsTitle: 'Simulated Execution Log',
      lastTriggered: 'Last triggered',
      enabled: 'Enabled',
      disabled: 'Disabled',
      simulatedNote: 'All data on this page is simulated demo data and does not represent any real ad account performance.',
    },
    dashboard: {
      nav: [
        { key: 'overview', label: 'Overview', to: '/dashboard' },
        { key: 'campaigns', label: 'Campaigns', to: '/dashboard/campaigns' },
        { key: 'rules', label: 'Rules', to: '/dashboard/rules' },
        { key: 'automation', label: 'Automation', to: '/dashboard/automation' },
        { key: 'metrics', label: 'Metrics', to: '/dashboard/metrics' },
        { key: 'logs', label: 'Logs', to: '/dashboard/logs' },
        { key: 'accounts', label: 'Accounts', to: '/dashboard/accounts' },
      ],
      common: {
        demoData: 'Demo Data · All values are simulated',
        loading: 'Loading…',
        empty: 'No data',
        exportCsv: 'Export CSV',
        enabled: 'Enabled',
        disabled: 'Disabled',
        all: 'All',
        range7: 'Last 7 days',
        range30: 'Last 30 days',
      },
      overview: {
        title: 'Overview',
        subtitle: 'Core GMV Max delivery metrics and recent activity at a glance.',
        trendTitle: 'GMV & Spend Trend',
        legendGmv: 'GMV',
        legendSpend: 'Spend',
        storesTitle: 'Stores & Accounts',
        recentTitle: 'Recent Actions',
        colStore: 'Store',
        colAdvertiser: 'Advertiser',
        colRegion: 'Region',
        colType: 'Type',
        colGmv: 'GMV',
        colSpend: 'Spend',
        colRoas: 'ROAS',
        colConversions: 'Conversions',
        colOrders: 'Orders',
        colCtr: 'CTR',
        colStatus: 'Status',
      },
      campaigns: {
        title: 'Campaigns',
        subtitle: 'Review campaign performance across stores, and drill down into creatives and products.',
        filterStatus: 'Filter by status',
        filterObjective: 'Filter by objective',
        statusActive: 'Active',
        statusPaused: 'Paused',
        statusEnded: 'Ended',
        objAwareness: 'Awareness',
        objConsideration: 'Consideration',
        objConversion: 'Conversion',
        colName: 'Campaign',
        colStore: 'Store',
        colStatus: 'Status',
        colObjective: 'Objective',
        colBudget: 'Budget',
        colSpend: 'Spend',
        colGmv: 'GMV',
        colRoas: 'ROAS',
        colConversions: 'Conversions',
        creativesTitle: 'Creatives',
        productsTitle: 'Products',
        colCreative: 'Creative',
        colImpressions: 'Impr.',
        colClicks: 'Clicks',
        colCtr: 'CTR',
        colProduct: 'Product',
        colSku: 'SKU',
        colPrice: 'Price',
        colOrders: 'Orders',
        empty: 'No campaigns match the filters',
      },
      rules: {
        title: 'Smart Rules',
        subtitle: 'Manage automated delivery rules, configure triggers and execution plans.',
        colName: 'Rule Name',
        colStore: 'Store',
        colCondition: 'Condition',
        colPlan: 'Plan',
        colStatus: 'Status',
        colTriggers: 'Triggers',
        newRule: 'New Rule',
        newRuleTitle: 'Create a Delivery Rule',
        fieldLabel: 'Field',
        operatorLabel: 'Operator',
        valueLabel: 'Threshold',
        planTypeLabel: 'Plan',
        createBtn: 'Create Rule',
        cancelBtn: 'Cancel',
        addCondition: 'Add condition',
        vizTitle: 'Condition → Action Logic',
        vizCondition: 'Trigger',
        vizAction: 'Action',
      },
      automation: {
        title: 'Automation',
        subtitle: 'Five execution plan types covering budget, bid, switch, notify, and batch scaling.',
        configTitle: 'Configuration',
        triggerCount: 'Total triggers',
      },
      metrics: {
        title: 'Metrics',
        subtitle: 'Explore impressions, clicks, GMV, and conversions by creative and product.',
        tabCreative: 'By Creative',
        tabProduct: 'By Product',
        trendTitle: 'Top Performance Trend',
        colName: 'Name',
        colParent: 'Parent',
        colImpressions: 'Impr.',
        colClicks: 'Clicks',
        colCtr: 'CTR',
        colGmv: 'GMV',
        colOrders: 'Orders',
        colConversions: 'Conv.',
        colRoas: 'ROAS',
      },
      logs: {
        title: 'Execution Logs',
        subtitle: 'Review rule-triggered actions and their GMV impact.',
        filterRule: 'Filter by rule',
        filterResult: 'Filter by result',
        colTime: 'Time',
        colStore: 'Store',
        colRule: 'Rule',
        colAction: 'Action',
        colResult: 'Result',
        colImpactGmv: 'Impact GMV',
        empty: 'No logs match the filters',
      },
      accounts: {
        title: 'Accounts',
        subtitle: 'Manage multiple stores and advertisers with isolated data and permissions.',
        colName: 'Store',
        colAdvertiser: 'Advertiser',
        colType: 'Type',
        colRegion: 'Region',
        colStatus: 'Binding',
        colGmv: 'GMV Total',
        colMembers: 'Members',
        membersCount: 'members',
      },
    },
    oauth: {
      sectionTitle: 'TikTok Account Binding',
      sectionSubtitle: 'Connect your TikTok ad account to GMVMAX via OAuth authorization (demo).',
      connectButton: 'Connect TikTok Account',
      connectedBadge: 'TikTok Account Connected',
      accountLabel: 'Demo account',
      disconnect: 'Disconnect',
      pageHeading: 'Log in to TikTok',
      simulatedBanner: 'Simulated TikTok authorization page (demo only, not a real login)',
      demoNote: '* Demo authorization flow (DEMO client_id, not real credentials)',
      authPrompt: 'gmvmax-center wants to access your TikTok ad account',
      scopeTitle: 'This app will get the following permissions',
      scopeBasic: 'Basic user info',
      scopeAd: 'Ad account read',
      authorize: 'Authorize & Connect',
      cancel: 'Cancel',
      authorized: 'TikTok Account Authorized',
      returning: 'Returning to gmvmax-center…',
      backToConsole: 'Back to Console',
    },
  },
};

/** 语言持久化键。 */
const STORAGE_KEY = 'gmvmax-lang';

/** useLang 返回值。 */
export interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Content;
}

const LangContext = createContext<LangContextValue | null>(null);

/** 语言 Provider：默认中文，用户选择持久化到 localStorage。 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'zh';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'zh';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const t = content[lang];
  const value = useMemo<LangContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** 获取当前语言、切换函数与当前语言文案。 */
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return ctx;
}

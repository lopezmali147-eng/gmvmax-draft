/**
 * GMVMAX 看板核心数据层。
 *
 * 设计要点：
 *  - 全部数据为前端确定性 mock，不请求任何后端。
 *  - 使用 mulberry32(FNV-1a hashSeed) 小型 PRNG 生成数值，刷新可完整复现。
 *  - 模块加载时调用一次 buildDashboardData()，导出常量 dashboardData。
 *  - 所有业务文本均为双语 { zh, en }，由看板页按当前语言取值。
 */

/* ----------------------------- 基础类型 ----------------------------- */

/** 双语文本。 */
export type LocalizedText = { zh: string; en: string };

/** 语言。 */
export type Lang = 'zh' | 'en';

/** 店铺绑定状态。 */
export type StoreBindingStatus = 'connected' | 'pending' | 'error';

/** 团队成员。 */
export interface Member {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
}

/** 店铺 / 广告账户。 */
export interface Store {
  id: string;
  name: LocalizedText;
  advertiser: LocalizedText;
  type: LocalizedText;
  region: LocalizedText;
  bindingStatus: StoreBindingStatus;
  gmvSummary: number;
  currency: string;
  members: Member[];
}

/** 投放系列状态。 */
export type CampaignStatus = 'active' | 'paused' | 'ended';

/** 投放目标。 */
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion';

/** 商品。 */
export interface Product {
  id: string;
  name: LocalizedText;
  sku: string;
  price: number;
  gmv: number;
  orders: number;
  conversions: number;
}

/** 创意。 */
export interface Creative {
  id: string;
  name: LocalizedText;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  ctr: number;
  products: Product[];
}

/** 投放系列。 */
export interface CampaignSeries {
  id: string;
  name: LocalizedText;
  storeId: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  budget: number;
  spend: number;
  gmv: number;
  roas: number;
  conversions: number;
  creatives: Creative[];
}

/** 规则条件字段（33+ 个）。 */
export type RuleConditionField =
  | 'gmv' | 'spend' | 'roas' | 'ctr' | 'cvr' | 'cpa' | 'cpc' | 'impressions'
  | 'clicks' | 'conversions' | 'orders' | 'budgetUsage' | 'frequency' | 'reach'
  | 'videoViewRate' | 'addToCart' | 'checkout' | 'refundRate' | 'newCustomerRatio'
  | 'returnOnAdSpend' | 'costPerOrder' | 'aov' | 'engagementRate' | 'shareRate'
  | 'saveRate' | 'commentRate' | 'followRate' | 'liveViewers' | 'watchTime'
  | 'productClicks' | 'cartAbandonRate' | 'dayparting' | 'geoPerformance'
  | 'deviceType' | 'audienceOverlap' | 'creativeFatigue' | 'competitorShare';

/** 规则运算符。 */
export type RuleOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'between' | 'change_pct';

/** 条件单位。 */
export type ConditionUnit = 'pct' | 'currency' | 'count' | 'ratio';

/** 单条规则条件。 */
export interface RuleCondition {
  field: RuleConditionField;
  operator: RuleOperator;
  value: number | [number, number];
  unit?: ConditionUnit;
}

/** 执行计划类型。 */
export type PlanType = 'budget' | 'bid' | 'switch' | 'notify' | 'batch';

/** 规则。 */
export interface Rule {
  id: string;
  name: LocalizedText;
  storeId: string;
  conditions: RuleCondition[];
  planType: PlanType;
  planConfig: Record<string, string | number>;
  enabled: boolean;
  lastTriggered: string;
  triggerCount: number;
}

/** 执行计划配置字段。 */
export interface PlanConfigField {
  key: string;
  label: LocalizedText;
  kind: 'number' | 'select' | 'text';
  options?: LocalizedText[];
}

/** 执行计划目录项。 */
export interface PlanCatalogItem {
  type: PlanType;
  title: LocalizedText;
  desc: LocalizedText;
  configFields: PlanConfigField[];
  triggerCount: number;
}

/** 指标维度。 */
export type MetricDimension = 'creative' | 'product';

/** 指标明细行。 */
export interface MetricRow {
  id: string;
  dimension: MetricDimension;
  name: LocalizedText;
  parent: LocalizedText;
  impressions: number;
  clicks: number;
  ctr: number;
  gmv: number;
  orders: number;
  conversions: number;
  roas: number;
}

/** 执行日志结果。 */
export type LogResult = 'applied' | 'notified' | 'skipped' | 'failed';

/** 单条执行日志。 */
export interface LogEntry {
  id: string;
  time: string;
  storeId: string;
  ruleId: string;
  ruleName: LocalizedText;
  action: LocalizedText;
  planType: PlanType;
  result: LogResult;
  impactGmv: number;
}

/** 核心指标快照。 */
export interface KpiSnapshot {
  gmv: number;
  spend: number;
  roas: number;
  conversions: number;
  orders: number;
  ctr: number;
  deltas: {
    gmv: number;
    spend: number;
    roas: number;
    conversions: number;
    orders: number;
    ctr: number;
  };
}

/** 近期执行动作（概览用）。 */
export interface RecentAction {
  id: string;
  time: string;
  store: LocalizedText;
  ruleName: LocalizedText;
  action: LocalizedText;
  result: LogResult;
}

/** 看板数据集。 */
export interface DashboardData {
  stores: Store[];
  campaigns: CampaignSeries[];
  rules: Rule[];
  planCatalog: PlanCatalogItem[];
  metrics: MetricRow[];
  logs: LogEntry[];
  kpi: KpiSnapshot;
  recentActions: RecentAction[];
  trend: { date: string; gmv: number; spend: number }[];
}

/* --------------------------- 确定性 PRNG --------------------------- */

/** FNV-1a 字符串哈希，得到 32 位无符号整数种子。 */
function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32：小巧确定性 PRNG，返回 [0,1) 序列。 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 以字符串为键获取确定性随机序列。 */
function rngFor(key: string): () => number {
  return mulberry32(hashSeed(key));
}

/** 固定基准日期，保证趋势可复现。 */
const BASE_DATE = new Date(2026, 6, 25); // 2026-07-25

/* ----------------------- 双语标签常量（枚举） ----------------------- */

export const FIELD_LABELS: Record<RuleConditionField, LocalizedText> = {
  gmv: { zh: 'GMV', en: 'GMV' },
  spend: { zh: '消耗', en: 'Spend' },
  roas: { zh: 'ROAS', en: 'ROAS' },
  ctr: { zh: '点击率', en: 'CTR' },
  cvr: { zh: '转化率', en: 'CVR' },
  cpa: { zh: '转化成本', en: 'CPA' },
  cpc: { zh: '单次点击成本', en: 'CPC' },
  impressions: { zh: '曝光量', en: 'Impressions' },
  clicks: { zh: '点击量', en: 'Clicks' },
  conversions: { zh: '转化数', en: 'Conversions' },
  orders: { zh: '订单数', en: 'Orders' },
  budgetUsage: { zh: '预算使用率', en: 'Budget Usage' },
  frequency: { zh: '频次', en: 'Frequency' },
  reach: { zh: '触达人数', en: 'Reach' },
  videoViewRate: { zh: '视频完播率', en: 'Video View Rate' },
  addToCart: { zh: '加购数', en: 'Add to Cart' },
  checkout: { zh: '下单数', en: 'Checkouts' },
  refundRate: { zh: '退款率', en: 'Refund Rate' },
  newCustomerRatio: { zh: '新客占比', en: 'New Customer Ratio' },
  returnOnAdSpend: { zh: '广告支出回报', en: 'Return on Ad Spend' },
  costPerOrder: { zh: '单均成本', en: 'Cost per Order' },
  aov: { zh: '客单价', en: 'AOV' },
  engagementRate: { zh: '互动率', en: 'Engagement Rate' },
  shareRate: { zh: '分享率', en: 'Share Rate' },
  saveRate: { zh: '收藏率', en: 'Save Rate' },
  commentRate: { zh: '评论率', en: 'Comment Rate' },
  followRate: { zh: '关注率', en: 'Follow Rate' },
  liveViewers: { zh: '直播间观看人数', en: 'Live Viewers' },
  watchTime: { zh: '观看时长', en: 'Watch Time' },
  productClicks: { zh: '商品点击数', en: 'Product Clicks' },
  cartAbandonRate: { zh: '加购流失率', en: 'Cart Abandon Rate' },
  dayparting: { zh: '分时段表现', en: 'Dayparting' },
  geoPerformance: { zh: '地域表现', en: 'Geo Performance' },
  deviceType: { zh: '设备类型', en: 'Device Type' },
  audienceOverlap: { zh: '受众重叠度', en: 'Audience Overlap' },
  creativeFatigue: { zh: '创意疲劳度', en: 'Creative Fatigue' },
  competitorShare: { zh: '竞品声量占比', en: 'Competitor Share' },
};

export const OPERATOR_LABELS: Record<RuleOperator, LocalizedText> = {
  gt: { zh: '大于', en: 'Greater than' },
  lt: { zh: '小于', en: 'Less than' },
  gte: { zh: '大于等于', en: 'Greater or equal' },
  lte: { zh: '小于等于', en: 'Less or equal' },
  eq: { zh: '等于', en: 'Equal to' },
  between: { zh: '介于', en: 'Between' },
  change_pct: { zh: '环比变化', en: 'Change %' },
};

export const PLAN_TYPE_LABELS: Record<PlanType, LocalizedText> = {
  budget: { zh: '预算调整', en: 'Budget' },
  bid: { zh: '智能出价', en: 'Bid' },
  switch: { zh: '开关与暂停', en: 'Switch' },
  notify: { zh: '通知与告警', en: 'Notify' },
  batch: { zh: '批量放量', en: 'Batch' },
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, LocalizedText> = {
  active: { zh: '投放中', en: 'Active' },
  paused: { zh: '已暂停', en: 'Paused' },
  ended: { zh: '已结束', en: 'Ended' },
};

export const CAMPAIGN_OBJECTIVE_LABELS: Record<CampaignObjective, LocalizedText> = {
  awareness: { zh: '品牌曝光', en: 'Awareness' },
  consideration: { zh: '兴趣种草', en: 'Consideration' },
  conversion: { zh: '转化成交', en: 'Conversion' },
};

export const STORE_STATUS_LABELS: Record<StoreBindingStatus, LocalizedText> = {
  connected: { zh: '已连接', en: 'Connected' },
  pending: { zh: '待授权', en: 'Pending' },
  error: { zh: '异常', en: 'Error' },
};

export const LOG_RESULT_LABELS: Record<LogResult, LocalizedText> = {
  applied: { zh: '已生效', en: 'Applied' },
  notified: { zh: '已通知', en: 'Notified' },
  skipped: { zh: '已跳过', en: 'Skipped' },
  failed: { zh: '失败', en: 'Failed' },
};

export const METRIC_DIMENSION_LABELS: Record<MetricDimension, LocalizedText> = {
  creative: { zh: '创意', en: 'Creative' },
  product: { zh: '商品', en: 'Product' },
};

/** 货币代码 -> 展示符号。 */
export const CURRENCY_SYMBOL: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
};

/* ----------------------------- 名称池 ----------------------------- */

const PRODUCT_NOUNS_ZH = [
  '潮玩手办', '盲盒', '口红', '面膜', '抱枕', '餐具', '台灯', '数据线',
  '充电宝', '耳机', '保温杯', '收纳盒', '香薰', '靠垫', '水杯', '玩偶',
];
const PRODUCT_NOUNS_EN = [
  'Toy Figure', 'Blind Box', 'Lipstick', 'Face Mask', 'Cushion', 'Tableware', 'Lamp', 'Cable',
  'Power Bank', 'Earphone', 'Tumbler', 'Storage Box', 'Diffuser', 'Pillow', 'Cup', 'Plushie',
];
const CREATIVE_NOUNS_ZH = ['夏日主图视频', '达人种草短片', '直播间切片', '商品卡点视频', '开箱测评', '场景剧情短片'];
const CREATIVE_NOUNS_EN = ['Summer Hero Video', 'Creator Clip', 'Live Replay', 'Beat Video', 'Unboxing', 'Story Short'];

/* --------------------------- 店铺种子 --------------------------- */

interface StoreSeed {
  id: string;
  name: LocalizedText;
  advertiser: LocalizedText;
  type: LocalizedText;
  region: LocalizedText;
  bindingStatus: StoreBindingStatus;
  currency: string;
  members: Array<{ name: LocalizedText; role: LocalizedText }>;
}

const STORE_SEEDS: StoreSeed[] = [
  {
    id: 's1',
    name: { zh: '潮玩旗舰店', en: 'Trendy Toys Flagship' },
    advertiser: { zh: '星河电商', en: 'Galaxy Commerce' },
    type: { zh: '品牌自营', en: 'Brand Store' },
    region: { zh: '中国大陆', en: 'Mainland China' },
    bindingStatus: 'connected',
    currency: 'CNY',
    members: [
      { name: { zh: '林浩', en: 'Lin Hao' }, role: { zh: '投放负责人', en: 'Campaign Lead' } },
      { name: { zh: '周敏', en: 'Zhou Min' }, role: { zh: '数据分析', en: 'Data Analyst' } },
    ],
  },
  {
    id: 's2',
    name: { zh: '美妆优选', en: 'Beauty Picks' },
    advertiser: { zh: '星河电商', en: 'Galaxy Commerce' },
    type: { zh: '旗舰店', en: 'Flagship' },
    region: { zh: '东南亚', en: 'Southeast Asia' },
    bindingStatus: 'connected',
    currency: 'USD',
    members: [
      { name: { zh: '王蕊', en: 'Wang Rui' }, role: { zh: '投放专员', en: 'Specialist' } },
      { name: { zh: '陈宇', en: 'Chen Yu' }, role: { zh: '创意策划', en: 'Creative' } },
    ],
  },
  {
    id: 's3',
    name: { zh: '家居生活', en: 'Home Living' },
    advertiser: { zh: '蓝海贸易', en: 'BlueOcean Trading' },
    type: { zh: '经销商', en: 'Reseller' },
    region: { zh: '北美', en: 'North America' },
    bindingStatus: 'pending',
    currency: 'USD',
    members: [
      { name: { zh: '李娜', en: 'Li Na' }, role: { zh: '区域经理', en: 'Regional Manager' } },
      { name: { zh: '赵强', en: 'Zhao Qiang' }, role: { zh: '投放优化', en: 'Optimizer' } },
    ],
  },
  {
    id: 's4',
    name: { zh: '数码先锋', en: 'Digi Pioneer' },
    advertiser: { zh: '蓝海贸易', en: 'BlueOcean Trading' },
    type: { zh: '品牌自营', en: 'Brand Store' },
    region: { zh: '欧洲', en: 'Europe' },
    bindingStatus: 'error',
    currency: 'EUR',
    members: [
      { name: { zh: '孙悦', en: 'Sun Yue' }, role: { zh: '投放负责人', en: 'Lead' } },
      { name: { zh: '吴桐', en: 'Wu Tong' }, role: { zh: '数据分析', en: 'Analyst' } },
      { name: { zh: '郑凯', en: 'Zheng Kai' }, role: { zh: '创意', en: 'Creative' } },
    ],
  },
];

/* --------------------------- 系列种子 --------------------------- */

interface CampaignDef {
  id: string;
  storeId: string;
  name: LocalizedText;
  status: CampaignStatus;
  objective: CampaignObjective;
  budget: number;
  seed: number;
}

const CAMPAIGN_DEFS: CampaignDef[] = [
  { id: 'c1', storeId: 's1', name: { zh: '夏季潮玩大促', en: 'Summer Toy Fest' }, status: 'active', objective: 'conversion', budget: 120000, seed: 11 },
  { id: 'c2', storeId: 's1', name: { zh: '新品盲盒首发', en: 'New Blind Box Launch' }, status: 'active', objective: 'awareness', budget: 80000, seed: 12 },
  { id: 'c3', storeId: 's2', name: { zh: '美妆夏季清仓', en: 'Beauty Summer Clearance' }, status: 'paused', objective: 'consideration', budget: 90000, seed: 13 },
  { id: 'c4', storeId: 's2', name: { zh: '彩妆种草计划', en: 'Makeup Seeding Plan' }, status: 'active', objective: 'consideration', budget: 70000, seed: 14 },
  { id: 'c5', storeId: 's3', name: { zh: '家居焕新季', en: 'Home Refresh Season' }, status: 'active', objective: 'conversion', budget: 150000, seed: 15 },
  { id: 'c6', storeId: 's3', name: { zh: '厨房好物专场', en: 'Kitchen Picks Live' }, status: 'ended', objective: 'awareness', budget: 60000, seed: 16 },
  { id: 'c7', storeId: 's4', name: { zh: '数码旗舰新品', en: 'Digi Flagship New' }, status: 'paused', objective: 'conversion', budget: 200000, seed: 17 },
  { id: 'c8', storeId: 's4', name: { zh: '智能配件专场', en: 'Smart Accessories' }, status: 'active', objective: 'consideration', budget: 95000, seed: 18 },
];

/* --------------------------- 规则种子 --------------------------- */

interface RuleDef {
  id: string;
  name: LocalizedText;
  storeId: string;
  conditions: RuleCondition[];
  planType: PlanType;
  planConfig: Record<string, string | number>;
  enabled: boolean;
  lastTriggered: string;
  triggerCount: number;
}

const RULE_DEFS: RuleDef[] = [
  {
    id: 'r1',
    name: { zh: 'ROAS 低于 2 自动降预算', en: 'Auto-cut budget when ROAS < 2' },
    storeId: 's1',
    conditions: [{ field: 'roas', operator: 'lt', value: 2, unit: 'ratio' }],
    planType: 'budget',
    planConfig: { adjustPct: -20 },
    enabled: true,
    lastTriggered: '2026-07-25 09:12',
    triggerCount: 14,
  },
  {
    id: 'r2',
    name: { zh: 'GMV 连续增长加预算', en: 'Raise budget on GMV growth' },
    storeId: 's1',
    conditions: [{ field: 'gmv', operator: 'change_pct', value: 5, unit: 'pct' }],
    planType: 'budget',
    planConfig: { adjustPct: 15 },
    enabled: true,
    lastTriggered: '2026-07-24 18:40',
    triggerCount: 9,
  },
  {
    id: 'r3',
    name: { zh: 'CTR 低于 1% 暂停创意', en: 'Pause creative when CTR < 1%' },
    storeId: 's2',
    conditions: [{ field: 'ctr', operator: 'lt', value: 1, unit: 'pct' }],
    planType: 'switch',
    planConfig: { action: 'pause' },
    enabled: false,
    lastTriggered: '2026-07-22 11:05',
    triggerCount: 5,
  },
  {
    id: 'r4',
    name: { zh: '消耗超日预算 80% 告警', en: 'Alert at 80% of daily budget' },
    storeId: 's2',
    conditions: [{ field: 'budgetUsage', operator: 'gte', value: 80, unit: 'pct' }],
    planType: 'notify',
    planConfig: { channel: 'email' },
    enabled: true,
    lastTriggered: '2026-07-25 14:23',
    triggerCount: 22,
  },
  {
    id: 'r5',
    name: { zh: '转化成本走高自动提价', en: 'Auto-bid up on rising CPA' },
    storeId: 's3',
    conditions: [{ field: 'cpa', operator: 'gt', value: 120, unit: 'currency' }],
    planType: 'bid',
    planConfig: { adjustPct: 8 },
    enabled: true,
    lastTriggered: '2026-07-25 13:40',
    triggerCount: 7,
  },
  {
    id: 'r6',
    name: { zh: '新客占比提升批量放量', en: 'Batch scale on new-customer ratio' },
    storeId: 's3',
    conditions: [
      { field: 'newCustomerRatio', operator: 'gte', value: 40, unit: 'pct' },
      { field: 'roas', operator: 'gte', value: 3, unit: 'ratio' },
    ],
    planType: 'batch',
    planConfig: { scalePct: 25, maxScale: 200 },
    enabled: false,
    lastTriggered: '2026-07-20 08:30',
    triggerCount: 3,
  },
  {
    id: 'r7',
    name: { zh: '视频完播率下降暂停', en: 'Pause on low video view rate' },
    storeId: 's4',
    conditions: [{ field: 'videoViewRate', operator: 'lt', value: 15, unit: 'pct' }],
    planType: 'switch',
    planConfig: { action: 'pause' },
    enabled: true,
    lastTriggered: '2026-07-25 16:30',
    triggerCount: 11,
  },
  {
    id: 'r8',
    name: { zh: '退款率异常告警', en: 'Alert on abnormal refund rate' },
    storeId: 's4',
    conditions: [{ field: 'refundRate', operator: 'gt', value: 8, unit: 'pct' }],
    planType: 'notify',
    planConfig: { channel: 'sms' },
    enabled: false,
    lastTriggered: '2026-07-19 10:00',
    triggerCount: 4,
  },
];

/* --------------------------- 计划目录 --------------------------- */

const PLAN_CATALOG: PlanCatalogItem[] = [
  {
    type: 'budget',
    title: { zh: '预算调整', en: 'Budget Adjustment' },
    desc: { zh: '当指标触发条件时，按比例自动调整系列日预算，并设置上下限保护。', en: 'Automatically adjust daily budget by a ratio when conditions fire, with min/max caps.' },
    configFields: [
      { key: 'adjustPct', label: { zh: '调整幅度 (%)', en: 'Adjust (%)' }, kind: 'number' },
      { key: 'cap', label: { zh: '单日上限', en: 'Daily Cap' }, kind: 'number' },
    ],
    triggerCount: 36,
  },
  {
    type: 'bid',
    title: { zh: '智能出价', en: 'Smart Bidding' },
    desc: { zh: '依据转化成本与竞争环境，自动微调出价以稳定获量成本。', en: 'Fine-tune bids based on CPA and competition to stabilize acquisition cost.' },
    configFields: [
      { key: 'adjustPct', label: { zh: '调整幅度 (%)', en: 'Adjust (%)' }, kind: 'number' },
      {
        key: 'strategy',
        label: { zh: '出价策略', en: 'Strategy' },
        kind: 'select',
        options: [
          { zh: '控成本', en: 'Cost Control' },
          { zh: '冲量', en: 'Volume' },
          { zh: '平稳', en: 'Stable' },
        ],
      },
    ],
    triggerCount: 28,
  },
  {
    type: 'switch',
    title: { zh: '开关与暂停', en: 'Switch & Pause' },
    desc: { zh: '在指标异常时自动暂停创意或系列，或恢复投放，避免无效消耗。', en: 'Auto pause or resume creatives/series on anomalies to avoid wasted spend.' },
    configFields: [
      {
        key: 'action',
        label: { zh: '执行动作', en: 'Action' },
        kind: 'select',
        options: [
          { zh: '暂停', en: 'Pause' },
          { zh: '启用', en: 'Enable' },
          { zh: '下线', en: 'Stop' },
        ],
      },
      { key: 'target', label: { zh: '作用对象', en: 'Target' }, kind: 'text' },
    ],
    triggerCount: 19,
  },
  {
    type: 'notify',
    title: { zh: '通知与告警', en: 'Notify & Alert' },
    desc: { zh: '将关键波动推送到邮件 / 短信 / 站内，便于人工及时介入。', en: 'Push key fluctuations to email / SMS / in-app for timely human review.' },
    configFields: [
      {
        key: 'channel',
        label: { zh: '通知渠道', en: 'Channel' },
        kind: 'select',
        options: [
          { zh: '邮件', en: 'Email' },
          { zh: '短信', en: 'SMS' },
          { zh: '站内', en: 'In-app' },
        ],
      },
      { key: 'recipients', label: { zh: '接收人', en: 'Recipients' }, kind: 'text' },
    ],
    triggerCount: 47,
  },
  {
    type: 'batch',
    title: { zh: '批量放量', en: 'Batch Scaling' },
    desc: { zh: '对满足条件的系列组统一放量，控制总预算增速上限。', en: 'Uniformly scale eligible series groups, capping total budget growth.' },
    configFields: [
      { key: 'scalePct', label: { zh: '放量幅度 (%)', en: 'Scale (%)' }, kind: 'number' },
      { key: 'maxScale', label: { zh: '总上限 (%)', en: 'Max Total (%)' }, kind: 'number' },
    ],
    triggerCount: 12,
  },
];

/* --------------------------- 趋势生成 --------------------------- */

/**
 * 生成 days 天的 GMV / 消耗趋势（确定性，无随机数）。
 * 用于概览页 7/14/30 天切换与内置 14 天趋势。
 */
export function buildTrendSeries(days: number): { date: string; gmv: number; spend: number }[] {
  const points: { date: string; gmv: number; spend: number }[] = [];
  const dailyGmv = 4_200_000 / 14;
  const dailySpend = 1_250_000 / 14;
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(BASE_DATE);
    d.setDate(BASE_DATE.getDate() - i);
    const day = days - 1 - i;
    const denom = Math.max(1, days - 1);
    const growth = day / denom;
    const wave = Math.sin((day + 1) * 1.3) * 0.05;
    const gmv = Math.round(dailyGmv * (0.82 + 0.18 * growth + wave));
    const spend = Math.round(dailySpend * (0.85 + 0.15 * growth + wave * 0.5));
    points.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, gmv, spend });
  }
  return points;
}

/* --------------------------- 数据构建 --------------------------- */

/** 构建完整看板数据集（仅模块加载时调用一次）。 */
function buildDashboardData(): DashboardData {
  // 1) 投放系列（含创意与商品，三层结构）
  let productCounter = 0;
  let creativeCounter = 0;
  const campaigns: CampaignSeries[] = CAMPAIGN_DEFS.map((def) => {
    const rng = rngFor(def.id);
    const spend = Math.round(def.budget * (0.5 + rng() * 0.45));
    const roasTarget = 1.8 + rng() * 2.4;
    const gmv = Math.round(spend * roasTarget);
    const roas = Number((gmv / spend).toFixed(2));
    const conversions = Math.round(gmv / (80 + rng() * 220));
    const creativeCount = 2 + Math.floor(rng() * 3); // 2..4
    const creatives: Creative[] = [];
    for (let j = 0; j < creativeCount; j += 1) {
      const crng = rngFor(`${def.id}-cr${j}`);
      const impressions = Math.round(50000 + crng() * 450000);
      const clicks = Math.round(impressions * (0.012 + crng() * 0.05));
      const ctr = Number(((clicks / impressions) * 100).toFixed(2));
      const productCount = 2 + Math.floor(crng() * 2); // 2..3
      const products: Product[] = [];
      let crGmv = 0;
      let crOrders = 0;
      let crConv = 0;
      for (let k = 0; k < productCount; k += 1) {
        const prng = rngFor(`${def.id}-cr${j}-p${k}`);
        const price = Math.round(10 + prng() * 400);
        const orders = Math.round(clicks * (0.02 + prng() * 0.08));
        const gmvP = Math.round(orders * price * (0.8 + prng() * 0.5));
        const conversionsP = Math.round(orders * (0.5 + prng() * 0.5));
        crGmv += gmvP;
        crOrders += orders;
        crConv += conversionsP;
        productCounter += 1;
        const nounIdx = productCounter % PRODUCT_NOUNS_ZH.length;
        products.push({
          id: `${def.id}-cr${j}-p${k}`,
          name: { zh: `${PRODUCT_NOUNS_ZH[nounIdx]} ${productCounter}`, en: `${PRODUCT_NOUNS_EN[nounIdx]} ${productCounter}` },
          sku: `SKU-${1000 + productCounter}`,
          price,
          gmv: gmvP,
          orders,
          conversions: conversionsP,
        });
      }
      creativeCounter += 1;
      const cNounIdx = creativeCounter % CREATIVE_NOUNS_ZH.length;
      creatives.push({
        id: `${def.id}-cr${j}`,
        name: { zh: `${CREATIVE_NOUNS_ZH[cNounIdx]} ${creativeCounter}`, en: `${CREATIVE_NOUNS_EN[cNounIdx]} ${creativeCounter}` },
        status: def.status === 'ended' ? 'ended' : crng() > 0.82 ? 'paused' : 'active',
        impressions,
        clicks,
        ctr,
        products,
      });
    }
    return {
      id: def.id,
      name: def.name,
      storeId: def.storeId,
      status: def.status,
      objective: def.objective,
      budget: def.budget,
      spend,
      gmv,
      roas,
      conversions,
      creatives,
    };
  });

  // 2) 店铺（GMV 汇总自其系列）
  const stores: Store[] = STORE_SEEDS.map((seed) => {
    const storeCampaigns = campaigns.filter((c) => c.storeId === seed.id);
    const gmvSummary = storeCampaigns.reduce((sum, c) => sum + c.gmv, 0);
    return {
      id: seed.id,
      name: seed.name,
      advertiser: seed.advertiser,
      type: seed.type,
      region: seed.region,
      bindingStatus: seed.bindingStatus,
      gmvSummary,
      currency: seed.currency,
      members: seed.members.map((m, idx) => ({
        id: `${seed.id}-m${idx + 1}`,
        name: m.name,
        role: m.role,
      })),
    };
  });

  // 3) 规则
  const rules: Rule[] = RULE_DEFS.map((r) => ({ ...r }));

  // 4) 计划目录（直接复用常量）
  const planCatalog: PlanCatalogItem[] = PLAN_CATALOG.map((p) => ({ ...p }));

  // 5) 指标明细（创意 + 商品）
  const metrics: MetricRow[] = [];
  campaigns.forEach((camp) => {
    camp.creatives.forEach((cr) => {
      const crRoas = Number((cr.impressions > 0 ? (cr.impressions * 0.45) : 1).toFixed(2));
      metrics.push({
        id: `m-${cr.id}`,
        dimension: 'creative',
        name: cr.name,
        parent: camp.name,
        impressions: cr.impressions,
        clicks: cr.clicks,
        ctr: cr.ctr,
        gmv: cr.products.reduce((s, p) => s + p.gmv, 0),
        orders: cr.products.reduce((s, p) => s + p.orders, 0),
        conversions: cr.products.reduce((s, p) => s + p.conversions, 0),
        roas: crRoas,
      });
      cr.products.forEach((p) => {
        const pRoas = Number((p.orders > 0 ? p.gmv / (p.orders * p.price * 0.3) : 1).toFixed(2));
        metrics.push({
          id: `m-${p.id}`,
          dimension: 'product',
          name: p.name,
          parent: cr.name,
          impressions: Math.round(p.orders * (10 + (p.id.length % 12))),
          clicks: p.orders,
          ctr: Number(((p.orders / Math.max(1, p.orders * (10 + (p.id.length % 12)))) * 100).toFixed(2)),
          gmv: p.gmv,
          orders: p.orders,
          conversions: p.conversions,
          roas: pRoas,
        });
      });
    });
  });

  // 6) 执行日志（≥30 条，确定性）
  const LOG_COUNT = 36;
  const ACTION_BY_PLAN: Record<PlanType, LocalizedText> = {
    budget: { zh: '预算调整', en: 'Budget adjusted' },
    bid: { zh: '出价调整', en: 'Bid adjusted' },
    switch: { zh: '创意已暂停', en: 'Creative paused' },
    notify: { zh: '告警已发送', en: 'Alert sent' },
    batch: { zh: '批量放量', en: 'Batch scaled' },
  };
  const RESULT_CYCLE: LogResult[] = ['applied', 'notified', 'skipped', 'failed'];
  const logs: LogEntry[] = [];
  for (let i = 0; i < LOG_COUNT; i += 1) {
    const rule = rules[i % rules.length];
    const rng = rngFor(`log-${i}`);
    const hoursAgo = i * 9 + (i % 5) * 3;
    const d = new Date(BASE_DATE);
    d.setHours(8 + (i % 12), (i * 7) % 60, 0, 0);
    d.setDate(d.getDate() - Math.floor(hoursAgo / 24));
    const pad = (n: number) => String(n).padStart(2, '0');
    const time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const result = RESULT_CYCLE[i % RESULT_CYCLE.length];
    const impactGmv = result === 'applied' ? Math.round(2000 + rng() * 48000) : 0;
    logs.push({
      id: `log-${i}`,
      time,
      storeId: rule.storeId,
      ruleId: rule.id,
      ruleName: rule.name,
      action: ACTION_BY_PLAN[rule.planType],
      planType: rule.planType,
      result,
      impactGmv,
    });
  }
  // 按时间倒序
  logs.sort((a, b) => (a.time < b.time ? 1 : -1));

  // 7) 核心指标快照（聚合）
  const totalGmv = campaigns.reduce((s, c) => s + c.gmv, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalOrders = metrics.reduce((s, m) => s + m.orders, 0);
  const weightedCtr = (() => {
    const imp = campaigns.reduce((s, c) => s + c.creatives.reduce((cs, cr) => cs + cr.impressions, 0), 0);
    const clk = campaigns.reduce((s, c) => s + c.creatives.reduce((cs, cr) => cs + cr.clicks, 0), 0);
    return imp > 0 ? Number(((clk / imp) * 100).toFixed(2)) : 0;
  })();
  const kpi: KpiSnapshot = {
    gmv: totalGmv,
    spend: totalSpend,
    roas: Number((totalGmv / totalSpend).toFixed(2)),
    conversions: totalConversions,
    orders: totalOrders,
    ctr: weightedCtr,
    deltas: {
      gmv: 12.4,
      spend: 8.1,
      roas: 3.2,
      conversions: 10.5,
      orders: 9.8,
      ctr: -0.4,
    },
  };

  // 8) 近期动作（取前 6 条日志）
  const storeNameById = (id: string): LocalizedText =>
    stores.find((s) => s.id === id)?.name ?? { zh: '未知', en: 'Unknown' };
  const recentActions: RecentAction[] = logs.slice(0, 6).map((l) => ({
    id: l.id,
    time: l.time,
    store: storeNameById(l.storeId),
    ruleName: l.ruleName,
    action: l.action,
    result: l.result,
  }));

  // 9) 趋势（14 天）
  const trend = buildTrendSeries(14);

  return {
    stores,
    campaigns,
    rules,
    planCatalog,
    metrics,
    logs,
    kpi,
    recentActions,
    trend,
  };
}

/** 看板数据常量（模块加载时生成一次，刷新可复现）。 */
export const dashboardData: DashboardData = buildDashboardData();

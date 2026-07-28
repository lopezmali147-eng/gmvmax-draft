/**
 * GMV Max 智能投放看板 - 演示用模拟数据。
 *
 * 说明：
 *  - 全部数据均为前端 mock，不请求任何后端接口。
 *  - advertisers 包含 KPI、14 日趋势、智能规则与模拟执行日志。
 *  - 广告主名称、规则名称、日志文案均提供中英文（{ zh, en }），由 Demo 页按当前语言取值。
 */

/** 双语文本。 */
export interface LocalizedText {
  zh: string;
  en: string;
}

/** 单日趋势点。 */
export interface TrendPoint {
  date: string;
  gmv: number;
  spend: number;
}

/** 广告主核心指标。 */
export interface Kpi {
  gmv: number;
  roas: number;
  spend: number;
  conversions: number;
  ctr: number;
}

/** 智能规则类型。 */
export type RuleType = 'budget' | 'bid' | 'pause' | 'alert';

/** 智能规则。 */
export interface Rule {
  id: string;
  name: LocalizedText;
  type: RuleType;
  enabled: boolean;
  lastTriggered: string;
}

/** 模拟执行日志条目。 */
export interface LogEntry {
  time: string;
  rule: LocalizedText;
  action: LocalizedText;
  result: LocalizedText;
}

/** 广告主（含其 KPI / 趋势 / 规则 / 日志）。 */
export interface Advertiser {
  id: string;
  name: LocalizedText;
  kpi: Kpi;
  trend: TrendPoint[];
  rules: Rule[];
  logs: LogEntry[];
}

/** 规则模板（不含启用状态与触发时间，由各广告主定制）。 */
const RULE_TEMPLATES: Array<Omit<Rule, 'enabled' | 'lastTriggered'>> = [
  { id: 'r1', name: { zh: 'ROAS 低于 2 自动降预算', en: 'Auto-cut budget when ROAS < 2' }, type: 'budget' },
  { id: 'r2', name: { zh: 'GMV 连续 3 日增长加预算', en: 'Raise budget on 3-day GMV growth' }, type: 'budget' },
  { id: 'r3', name: { zh: 'CTR 低于 1% 暂停广告组', en: 'Pause ad group when CTR < 1%' }, type: 'pause' },
  { id: 'r4', name: { zh: '消耗达日预算 80% 告警', en: 'Alert at 80% of daily budget' }, type: 'alert' },
  { id: 'r5', name: { zh: '新客转化成本走高自动提价', en: 'Auto-bid up on rising CPA' }, type: 'bid' },
];

/** 固定的演示基准日期，保证趋势可复现。 */
const BASE_DATE = new Date(2026, 6, 25); // 2026-07-25

/**
 * 生成 14 天趋势（GMV / 消耗）。
 * 使用确定性函数（无随机数），保证每次渲染结果一致，便于演示与评审。
 */
function buildTrend(seed: number, dailyGmv: number, dailySpend: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(BASE_DATE);
    d.setDate(BASE_DATE.getDate() - i);
    const day = 13 - i; // 0..13，越靠后日期越新
    const growth = day / 13; // 0..1 的上升曲线
    const wave = Math.sin((day + 1) * (seed + 1)) * 0.06; // 轻微波动
    const gmv = Math.round(dailyGmv * (0.8 + 0.2 * growth + wave));
    const spend = Math.round(dailySpend * (0.84 + 0.16 * growth + wave * 0.5));
    points.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      gmv,
      spend,
    });
  }
  return points;
}

/** 根据模板与各广告主定制生成规则列表（id 带广告主前缀，保证唯一）。 */
function buildRules(
  advertiserId: string,
  enabledIds: string[],
  triggers: Record<string, string>,
): Rule[] {
  return RULE_TEMPLATES.map((tpl) => ({
    ...tpl,
    id: `${advertiserId}-${tpl.id}`,
    enabled: enabledIds.includes(tpl.id),
    lastTriggered: triggers[tpl.id] ?? '—',
  }));
}

/** 广告主原始配置（构建期聚合为 Advertiser）。 */
interface AdvertiserSeed {
  id: string;
  name: LocalizedText;
  seed: number;
  dailyGmv: number;
  dailySpend: number;
  conversions: number;
  ctr: number;
  enabledRuleIds: string[];
  triggers: Record<string, string>;
  logs: LogEntry[];
}

function buildAdvertiser(seed: AdvertiserSeed): Advertiser {
  const trend = buildTrend(seed.seed, seed.dailyGmv, seed.dailySpend);
  const gmv = trend.reduce((sum, p) => sum + p.gmv, 0);
  const spend = trend.reduce((sum, p) => sum + p.spend, 0);
  const roas = Number((gmv / spend).toFixed(2));
  return {
    id: seed.id,
    name: seed.name,
    kpi: { gmv, spend, roas, conversions: seed.conversions, ctr: seed.ctr },
    trend,
    rules: buildRules(seed.id, seed.enabledRuleIds, seed.triggers),
    logs: seed.logs,
  };
}

const advertiserSeeds: AdvertiserSeed[] = [
  {
    id: 'adv-toys',
    name: { zh: '潮玩旗舰店', en: 'Trendy Toys Flagship' },
    seed: 1,
    dailyGmv: 92000,
    dailySpend: 29000,
    conversions: 18432,
    ctr: 4.6,
    enabledRuleIds: ['r1', 'r2', 'r4'],
    triggers: {
      r1: '2026-07-25 09:12',
      r2: '2026-07-24 18:40',
      r3: '2026-07-22 11:05',
      r4: '2026-07-25 14:23',
      r5: '2026-07-20 08:30',
    },
    logs: [
      {
        time: '2026-07-25 15:02',
        rule: { zh: 'GMV 连续 3 日增长加预算', en: 'Raise budget on 3-day GMV growth' },
        action: { zh: '预算 +15%', en: 'Budget +15%' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-25 14:23',
        rule: { zh: '消耗达日预算 80% 告警', en: 'Alert at 80% of daily budget' },
        action: { zh: '发送告警', en: 'Sent alert' },
        result: { zh: '已通知', en: 'Notified' },
      },
      {
        time: '2026-07-25 09:12',
        rule: { zh: 'ROAS 低于 2 自动降预算', en: 'Auto-cut budget when ROAS < 2' },
        action: { zh: '预算 -20%', en: 'Budget -20%' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-24 18:40',
        rule: { zh: 'GMV 连续 3 日增长加预算', en: 'Raise budget on 3-day GMV growth' },
        action: { zh: '预算 +10%', en: 'Budget +10%' },
        result: { zh: '已生效', en: 'Applied' },
      },
    ],
  },
  {
    id: 'adv-beauty',
    name: { zh: '美妆优选', en: 'Beauty Picks' },
    seed: 3,
    dailyGmv: 60000,
    dailySpend: 25000,
    conversions: 9874,
    ctr: 3.1,
    enabledRuleIds: ['r2', 'r4', 'r5'],
    triggers: {
      r1: '2026-07-23 10:00',
      r2: '2026-07-24 20:05',
      r3: '2026-07-19 09:15',
      r4: '2026-07-25 11:18',
      r5: '2026-07-25 13:40',
    },
    logs: [
      {
        time: '2026-07-25 13:40',
        rule: { zh: '新客转化成本走高自动提价', en: 'Auto-bid up on rising CPA' },
        action: { zh: '出价 +8%', en: 'Bid +8%' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-25 11:18',
        rule: { zh: '消耗达日预算 80% 告警', en: 'Alert at 80% of daily budget' },
        action: { zh: '发送告警', en: 'Sent alert' },
        result: { zh: '已通知', en: 'Notified' },
      },
      {
        time: '2026-07-24 20:05',
        rule: { zh: 'GMV 连续 3 日增长加预算', en: 'Raise budget on 3-day GMV growth' },
        action: { zh: '预算 +12%', en: 'Budget +12%' },
        result: { zh: '已生效', en: 'Applied' },
      },
    ],
  },
  {
    id: 'adv-home',
    name: { zh: '家居生活', en: 'Home Living' },
    seed: 5,
    dailyGmv: 144000,
    dailySpend: 35000,
    conversions: 27650,
    ctr: 5.2,
    enabledRuleIds: ['r1', 'r2', 'r3', 'r4'],
    triggers: {
      r1: '2026-07-25 09:00',
      r2: '2026-07-25 10:55',
      r3: '2026-07-25 16:30',
      r4: '2026-07-24 22:12',
      r5: '2026-07-18 14:20',
    },
    logs: [
      {
        time: '2026-07-25 16:30',
        rule: { zh: 'CTR 低于 1% 暂停广告组', en: 'Pause ad group when CTR < 1%' },
        action: { zh: '暂停广告组', en: 'Paused ad group' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-25 10:55',
        rule: { zh: 'GMV 连续 3 日增长加预算', en: 'Raise budget on 3-day GMV growth' },
        action: { zh: '预算 +20%', en: 'Budget +20%' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-25 09:00',
        rule: { zh: 'ROAS 低于 2 自动降预算', en: 'Auto-cut budget when ROAS < 2' },
        action: { zh: '预算 -15%', en: 'Budget -15%' },
        result: { zh: '已生效', en: 'Applied' },
      },
      {
        time: '2026-07-24 22:12',
        rule: { zh: '消耗达日预算 80% 告警', en: 'Alert at 80% of daily budget' },
        action: { zh: '发送告警', en: 'Sent alert' },
        result: { zh: '已通知', en: 'Notified' },
      },
    ],
  },
];

/** 广告主列表（含派生 KPI / 趋势 / 规则 / 日志）。 */
export const advertisers: Advertiser[] = advertiserSeeds.map(buildAdvertiser);

/** 规则目录（取首个广告主的规则作为示例导出）。 */
export const rules: Rule[] = advertisers[0].rules;

/** 全部模拟执行日志（跨广告主汇总，供全局导出）。 */
export const logs: LogEntry[] = advertisers.flatMap((a) => a.logs);

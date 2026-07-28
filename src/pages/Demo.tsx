import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useLang } from '../i18n';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Chip from '@mui/material/Chip';
import { advertisers } from '../demo-data';
import type { Advertiser, Rule, TrendPoint, LocalizedText } from '../demo-data';

/** 数字格式化：货币（无小数，千分位）。 */
function formatCurrency(value: number): string {
  return `¥${Math.round(value).toLocaleString('en-US')}`;
}

/** 数字格式化：ROAS（一位小数 + x）。 */
function formatRoas(value: number): string {
  return `${value.toFixed(1)}x`;
}

/** 数字格式化：整数（千分位）。 */
function formatInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** 数字格式化：百分比（一位小数 + %）。 */
function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** 数字格式化：带符号百分比（用于涨跌）。 */
function formatDelta(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/** 规则类型 -> 中英文标签。 */
const RULE_TYPE_LABELS: Record<Rule['type'], LocalizedText> = {
  budget: { zh: '预算', en: 'Budget' },
  bid: { zh: '出价', en: 'Bid' },
  pause: { zh: '暂停', en: 'Pause' },
  alert: { zh: '告警', en: 'Alert' },
};

/** 单个 KPI 指标卡。 */
function KpiCard({ label, value, delta }: { label: string; value: string; delta?: number }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {delta !== undefined && (
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: delta >= 0 ? 'secondary.main' : 'error.main' }}
          >
            {formatDelta(delta)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

/** 纯 SVG 绘制的 14 日 GMV vs 消耗趋势图（响应式 viewBox，无第三方图表依赖）。 */
function TrendChart({
  trend,
  legendGmv,
  legendSpend,
}: {
  trend: TrendPoint[];
  legendGmv: string;
  legendSpend: string;
}) {
  const theme = useTheme();
  const W = 680;
  const H = 260;
  const padL = 14;
  const padR = 14;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = trend.length;
  const maxVal = Math.max(...trend.map((p) => Math.max(p.gmv, p.spend)), 1);

  const xAt = (i: number): number => padL + (innerW * i) / (n - 1);
  const yAt = (v: number): number => padT + innerH * (1 - v / maxVal);

  const gmvPoints = trend.map((p, i) => `${xAt(i)},${yAt(p.gmv)}`).join(' ');
  const spendPoints = trend.map((p, i) => `${xAt(i)},${yAt(p.spend)}`).join(' ');
  const areaPoints = `${padL},${padT + innerH} ${gmvPoints} ${padL + innerW},${padT + innerH}`;

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((f) => padT + innerH * f);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
        <Chip size="small" label={legendGmv} sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }} />
        <Chip size="small" label={legendSpend} sx={{ bgcolor: theme.palette.secondary.main, color: '#fff' }} />
      </Stack>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img" aria-label={legendGmv}>
        {gridYs.map((y, i) => (
          <line key={i} x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="#eceef4" strokeWidth={1} />
        ))}
        <polygon points={areaPoints} fill={theme.palette.primary.main} fillOpacity={0.08} />
        <polyline
          points={spendPoints}
          fill="none"
          stroke={theme.palette.secondary.main}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={gmvPoints}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {trend.map((p, i) =>
          i % 3 === 0 || i === n - 1 ? (
            <text key={i} x={xAt(i)} y={H - 8} fontSize={10} textAnchor="middle" fill="#5a6275">
              {p.date}
            </text>
          ) : null,
        )}
      </svg>
    </Box>
  );
}

/**
 * 产品演示页：可交互的 GMV Max 智能投放看板。
 *  - 切换广告主：KPI / 趋势图 / 规则 / 日志联动更新。
 *  - 规则 Switch：仅切换本地 state，不请求后端。
 *  - 全部文案来自 i18n，随语言切换更新。
 */
export default function Demo() {
  const { t, lang } = useLang();
  const d = t.demo;

  const [selectedId, setSelectedId] = useState<string>(advertisers[0].id);
  const advertiser: Advertiser = useMemo(
    () => advertisers.find((a) => a.id === selectedId) ?? advertisers[0],
    [selectedId],
  );

  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    advertisers[0].rules.forEach((r) => {
      map[r.id] = r.enabled;
    });
    return map;
  });
  useEffect(() => {
    const map: Record<string, boolean> = {};
    advertiser.rules.forEach((r) => {
      map[r.id] = r.enabled;
    });
    setEnabled(map);
  }, [advertiser]);

  const gmvDelta = useMemo(() => {
    const tr = advertiser.trend;
    if (tr.length < 2) return 0;
    const last = tr[tr.length - 1].gmv;
    const prev = tr[tr.length - 2].gmv;
    if (prev === 0) return 0;
    return ((last - prev) / prev) * 100;
  }, [advertiser]);

  const handleToggle = (ruleId: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setEnabled((prev) => ({ ...prev, [ruleId]: e.target.checked }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* 标题区 */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Chip label="DEMO" color="primary" size="small" />
        <Typography variant="h4" component="h1">
          {d.title}
        </Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {d.subtitle}
      </Typography>

      {/* 广告主切换器 */}
      <Tabs
        value={selectedId}
        onChange={(_event, value) => setSelectedId(value as string)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {advertisers.map((a) => (
          <Tab key={a.id} value={a.id} label={a.name[lang]} />
        ))}
      </Tabs>

      {/* KPI 指标卡区 */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          mb: 3,
        }}
      >
        <KpiCard label={d.kpiGmv} value={formatCurrency(advertiser.kpi.gmv)} delta={gmvDelta} />
        <KpiCard label={d.kpiRoas} value={formatRoas(advertiser.kpi.roas)} />
        <KpiCard label={d.kpiSpend} value={formatCurrency(advertiser.kpi.spend)} />
        <KpiCard label={d.kpiConversions} value={formatInt(advertiser.kpi.conversions)} />
        <KpiCard label={d.kpiCtr} value={formatPct(advertiser.kpi.ctr)} />
      </Box>

      {/* 趋势图 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {d.trendTitle}
          </Typography>
          <TrendChart trend={advertiser.trend} legendGmv={d.legendGmv} legendSpend={d.legendSpend} />
        </CardContent>
      </Card>

      {/* 智能规则列表 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {d.rulesTitle}
          </Typography>
          <List disablePadding>
            {advertiser.rules.map((r) => (
              <ListItem key={r.id} divider>
                <ListItemText
                  primary={r.name[lang]}
                  secondary={
                    <span>
                      {RULE_TYPE_LABELS[r.type][lang]} · {d.lastTriggered}: {r.lastTriggered}
                    </span>
                  }
                />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="caption"
                      sx={{ color: enabled[r.id] ? 'secondary.main' : 'text.disabled', fontWeight: 600 }}
                    >
                      {enabled[r.id] ? d.enabled : d.disabled}
                    </Typography>
                    <Switch
                      edge="end"
                      checked={!!enabled[r.id]}
                      onChange={handleToggle(r.id)}
                      inputProps={{ 'aria-label': r.name[lang] }}
                    />
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* 模拟执行日志 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {d.logsTitle}
          </Typography>
          <List disablePadding>
            {advertiser.logs.map((log, idx) => (
              <ListItem key={idx} divider={idx < advertiser.logs.length - 1}>
                <ListItemText
                  primary={
                    <span>
                      <strong>{log.rule[lang]}</strong> · {log.action[lang]}
                    </span>
                  }
                  secondary={`${log.time} · ${log.result[lang]}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* 演示数据声明 */}
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
        {d.simulatedNote}
      </Typography>
    </Container>
  );
}

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { useLang } from '../../i18n';
import {
  dashboardData,
  buildTrendSeries,
  CURRENCY_SYMBOL,
  STORE_STATUS_LABELS,
  LOG_RESULT_LABELS,
  type StoreBindingStatus,
  type LogResult,
} from '../../dashboard-data';
import { formatCurrency, formatRoas, formatInt, formatPct } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import KpiCard from '../../components/dashboard/KpiCard';
import TrendChart from '../../components/dashboard/TrendChart';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DemoBadge from '../../components/dashboard/DemoBadge';
import type { Store } from '../../dashboard-data';

function statusColor(status: StoreBindingStatus): 'success' | 'warning' | 'error' {
  if (status === 'connected') return 'success';
  if (status === 'pending') return 'warning';
  return 'error';
}

function resultColor(result: LogResult): 'success' | 'info' | 'default' | 'error' {
  if (result === 'applied') return 'success';
  if (result === 'notified') return 'info';
  if (result === 'skipped') return 'default';
  return 'error';
}

/**
 * 总览页（P0）：6 张 KPI 卡 + 双折线趋势（7/30 天切换）+ 店铺/账户概览 + 近期执行动作。
 */
export default function Overview() {
  const { t, lang } = useLang();
  const theme = useTheme();
  const d = t.dashboard;
  const [range, setRange] = useState<7 | 30>(30);

  const trendData = useMemo(() => buildTrendSeries(range), [range]);
  const xLabels = trendData.map((p) => p.date);
  const gmvSeries = trendData.map((p) => p.gmv);
  const spendSeries = trendData.map((p) => p.spend);

  const kpi = dashboardData.kpi;
  const deltas = kpi.deltas;

  const storeColumns: Column<Store>[] = [
    { key: 'name', header: d.overview.colStore, render: (s) => <strong>{s.name[lang]}</strong> },
    { key: 'advertiser', header: d.overview.colAdvertiser, render: (s) => s.advertiser[lang] },
    { key: 'region', header: d.overview.colRegion, render: (s) => s.region[lang] },
    { key: 'type', header: d.overview.colType, render: (s) => s.type[lang] },
    {
      key: 'status',
      header: d.overview.colStatus,
      render: (s) => (
        <Chip size="small" label={STORE_STATUS_LABELS[s.bindingStatus][lang]} color={statusColor(s.bindingStatus)} />
      ),
    },
    {
      key: 'gmvSummary',
      header: d.overview.colGmv,
      align: 'right',
      sortable: true,
      sortValue: (s) => s.gmvSummary,
      render: (s) => formatCurrency(s.gmvSummary, CURRENCY_SYMBOL[s.currency] ?? '¥'),
    },
  ];

  return (
    <Box>
      <PageHeader title={d.overview.title} subtitle={d.overview.subtitle} />

      {/* KPI 指标卡 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colGmv} value={formatCurrency(kpi.gmv)} delta={deltas.gmv} />
        </Grid>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colSpend} value={formatCurrency(kpi.spend)} delta={deltas.spend} />
        </Grid>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colRoas} value={formatRoas(kpi.roas)} delta={deltas.roas} />
        </Grid>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colConversions} value={formatInt(kpi.conversions)} delta={deltas.conversions} />
        </Grid>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colOrders} value={formatInt(kpi.orders)} delta={deltas.orders} />
        </Grid>
        <Grid item xs={6} md={2}>
          <KpiCard label={d.overview.colCtr} value={formatPct(kpi.ctr)} delta={deltas.ctr} />
        </Grid>
      </Grid>

      {/* 趋势图 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">{d.overview.trendTitle}</Typography>
            <ToggleButtonGroup
              size="small"
              value={range}
              exclusive
              onChange={(_e, val) => val && setRange(val)}
            >
              <ToggleButton value={7}>{d.common.range7}</ToggleButton>
              <ToggleButton value={30}>{d.common.range30}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <TrendChart
            series={[
              { label: d.overview.legendGmv, color: theme.palette.primary.main, points: gmvSeries },
              { label: d.overview.legendSpend, color: theme.palette.secondary.main, points: spendSeries },
            ]}
            xLabels={xLabels}
          />
        </CardContent>
      </Card>

      {/* 店铺概览 + 近期动作 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {d.overview.storesTitle}
              </Typography>
              <DataTable columns={storeColumns} rows={dashboardData.stores} rowKey={(s) => s.id} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {d.overview.recentTitle}
              </Typography>
              <List disablePadding>
                {dashboardData.recentActions.map((a, idx) => (
                  <Box key={a.id}>
                    {idx > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start" disableGutters>
                      <ListItemText
                        primary={
                          <span>
                            <strong>{a.ruleName[lang]}</strong> · {a.action[lang]}
                          </span>
                        }
                        secondary={
                          <span>
                            {a.time} · {a.store[lang]}
                          </span>
                        }
                      />
                      <Chip size="small" label={LOG_RESULT_LABELS[a.result][lang]} color={resultColor(a.result)} />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DemoBadge />
    </Box>
  );
}

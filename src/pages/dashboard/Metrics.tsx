import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import { useLang } from '../../i18n';
import { dashboardData, type MetricDimension, type MetricRow } from '../../dashboard-data';
import { formatCurrency, formatInt, formatPct, formatRoas } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import TrendChart from '../../components/dashboard/TrendChart';
import DemoBadge from '../../components/dashboard/DemoBadge';

/**
 * 指标分析页（P1）：创意 / 商品维度 Tab 切换 + 明细表 + 简易 SVG 趋势（Top 表现）。
 */
export default function Metrics() {
  const { t, lang } = useLang();
  const theme = useTheme();
  const d = t.dashboard.metrics;
  const [dimension, setDimension] = useState<MetricDimension>('creative');

  const rows = useMemo(
    () => dashboardData.metrics.filter((m) => m.dimension === dimension),
    [dimension],
  );

  const topRows = useMemo(
    () => [...rows].sort((a, b) => b.gmv - a.gmv).slice(0, 10),
    [rows],
  );

  const columns: Column<MetricRow>[] = [
    { key: 'name', header: d.colName, render: (m) => <strong>{m.name[lang]}</strong> },
    { key: 'parent', header: d.colParent, render: (m) => m.parent[lang] },
    { key: 'impressions', header: d.colImpressions, align: 'right', sortable: true, sortValue: (m) => m.impressions, render: (m) => formatInt(m.impressions) },
    { key: 'clicks', header: d.colClicks, align: 'right', sortable: true, sortValue: (m) => m.clicks, render: (m) => formatInt(m.clicks) },
    { key: 'ctr', header: d.colCtr, align: 'right', sortable: true, sortValue: (m) => m.ctr, render: (m) => formatPct(m.ctr) },
    { key: 'gmv', header: d.colGmv, align: 'right', sortable: true, sortValue: (m) => m.gmv, render: (m) => formatCurrency(m.gmv) },
    { key: 'orders', header: d.colOrders, align: 'right', sortable: true, sortValue: (m) => m.orders, render: (m) => formatInt(m.orders) },
    { key: 'conversions', header: d.colConversions, align: 'right', sortable: true, sortValue: (m) => m.conversions, render: (m) => formatInt(m.conversions) },
    { key: 'roas', header: d.colRoas, align: 'right', sortable: true, sortValue: (m) => m.roas, render: (m) => formatRoas(m.roas) },
  ];

  return (
    <Box>
      <PageHeader title={d.title} subtitle={d.subtitle} />

      <Tabs
        value={dimension}
        onChange={(_e, val) => setDimension(val as MetricDimension)}
        sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab value="creative" label={d.tabCreative} />
        <Tab value="product" label={d.tabProduct} />
      </Tabs>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {d.trendTitle}
          </Typography>
          <TrendChart
            series={[{ label: d.colGmv, color: theme.palette.primary.main, points: topRows.map((m) => m.gmv) }]}
            xLabels={topRows.map((m) => (m.name[lang].length > 8 ? `${m.name[lang].slice(0, 8)}…` : m.name[lang]))}
            areaFill={false}
          />
        </CardContent>
      </Card>

      <DataTable columns={columns} rows={rows} rowKey={(m) => m.id} />

      <DemoBadge />
    </Box>
  );
}

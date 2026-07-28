import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLang } from '../../i18n';
import {
  dashboardData,
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_OBJECTIVE_LABELS,
  type CampaignStatus,
  type CampaignObjective,
  type CampaignSeries,
  type Creative,
} from '../../dashboard-data';
import { formatCurrency, formatRoas, formatInt, formatPct } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DemoBadge from '../../components/dashboard/DemoBadge';

/**
 * 投放系列页（P0）：按状态 + 目标筛选；点击系列行展开创意子表，再点击创意展开商品子表（三层）。
 */
export default function Campaigns() {
  const { t, lang } = useLang();
  const d = t.dashboard.campaigns;

  const storeName = useMemo(() => {
    const map: Record<string, string> = {};
    dashboardData.stores.forEach((s) => {
      map[s.id] = s.name[lang];
    });
    return map;
  }, [lang]);

  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatus>('all');
  const [objectiveFilter, setObjectiveFilter] = useState<'all' | CampaignObjective>('all');
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [expandedCreativeId, setExpandedCreativeId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      dashboardData.campaigns.filter(
        (c) =>
          (statusFilter === 'all' || c.status === statusFilter) &&
          (objectiveFilter === 'all' || c.objective === objectiveFilter),
      ),
    [statusFilter, objectiveFilter],
  );

  const campaignColumns: Column<CampaignSeries>[] = [
    { key: 'name', header: d.colName, render: (c) => <strong>{c.name[lang]}</strong> },
    { key: 'store', header: d.colStore, render: (c) => storeName[c.storeId] ?? c.storeId },
    {
      key: 'status',
      header: d.colStatus,
      render: (c) => <Chip size="small" label={CAMPAIGN_STATUS_LABELS[c.status][lang]} color={c.status === 'active' ? 'success' : c.status === 'paused' ? 'warning' : 'default'} />,
    },
    {
      key: 'objective',
      header: d.colObjective,
      render: (c) => <Chip size="small" variant="outlined" label={CAMPAIGN_OBJECTIVE_LABELS[c.objective][lang]} />,
    },
    { key: 'budget', header: d.colBudget, align: 'right', sortable: true, sortValue: (c) => c.budget, render: (c) => formatCurrency(c.budget) },
    { key: 'spend', header: d.colSpend, align: 'right', sortable: true, sortValue: (c) => c.spend, render: (c) => formatCurrency(c.spend) },
    { key: 'gmv', header: d.colGmv, align: 'right', sortable: true, sortValue: (c) => c.gmv, render: (c) => formatCurrency(c.gmv) },
    { key: 'roas', header: d.colRoas, align: 'right', sortable: true, sortValue: (c) => c.roas, render: (c) => formatRoas(c.roas) },
    { key: 'conversions', header: d.colConversions, align: 'right', sortable: true, sortValue: (c) => c.conversions, render: (c) => formatInt(c.conversions) },
  ];

  const creativeColumns: Column<Creative>[] = [
    { key: 'name', header: d.colCreative, render: (c) => <strong>{c.name[lang]}</strong> },
    {
      key: 'status',
      header: d.colStatus,
      render: (c) => <Chip size="small" label={CAMPAIGN_STATUS_LABELS[c.status][lang]} color={c.status === 'active' ? 'success' : c.status === 'paused' ? 'warning' : 'default'} />,
    },
    { key: 'impressions', header: d.colImpressions, align: 'right', sortable: true, sortValue: (c) => c.impressions, render: (c) => formatInt(c.impressions) },
    { key: 'clicks', header: d.colClicks, align: 'right', sortable: true, sortValue: (c) => c.clicks, render: (c) => formatInt(c.clicks) },
    { key: 'ctr', header: d.colCtr, align: 'right', sortable: true, sortValue: (c) => c.ctr, render: (c) => formatPct(c.ctr) },
  ];

  const expandedCampaign = dashboardData.campaigns.find((c) => c.id === expandedCampaignId) ?? null;
  const expandedCreative = expandedCampaign?.creatives.find((cr) => cr.id === expandedCreativeId) ?? null;

  return (
    <Box>
      <PageHeader title={d.title} subtitle={d.subtitle} />

      {/* 筛选器 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="camp-status-label">{d.filterStatus}</InputLabel>
          <Select
            labelId="camp-status-label"
            label={d.filterStatus}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | CampaignStatus)}
          >
            <MenuItem value="all">{t.dashboard.common.all}</MenuItem>
            <MenuItem value="active">{d.statusActive}</MenuItem>
            <MenuItem value="paused">{d.statusPaused}</MenuItem>
            <MenuItem value="ended">{d.statusEnded}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="camp-obj-label">{d.filterObjective}</InputLabel>
          <Select
            labelId="camp-obj-label"
            label={d.filterObjective}
            value={objectiveFilter}
            onChange={(e) => setObjectiveFilter(e.target.value as 'all' | CampaignObjective)}
          >
            <MenuItem value="all">{t.dashboard.common.all}</MenuItem>
            <MenuItem value="awareness">{d.objAwareness}</MenuItem>
            <MenuItem value="consideration">{d.objConsideration}</MenuItem>
            <MenuItem value="conversion">{d.objConversion}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <DataTable
        columns={campaignColumns}
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={(c) => setExpandedCampaignId((prev) => (prev === c.id ? null : c.id))}
      />

      {/* 创意子表（二层） */}
      {expandedCampaign && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <ExpandMoreIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {d.creativesTitle} · {expandedCampaign.name[lang]}
              </Typography>
            </Stack>
            <DataTable
              columns={creativeColumns}
              rows={expandedCampaign.creatives}
              rowKey={(cr) => cr.id}
              onRowClick={(cr) => setExpandedCreativeId((prev) => (prev === cr.id ? null : cr.id))}
            />

            {/* 商品子表（三层） */}
            {expandedCreative && (
              <Box sx={{ mt: 2, pl: { sm: 3 } }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ExpandMoreIcon fontSize="small" color="secondary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {d.productsTitle} · {expandedCreative.name[lang]}
                  </Typography>
                </Stack>
                <DataTable
                  columns={[
                    { key: 'name', header: d.colProduct, render: (p) => p.name[lang] },
                    { key: 'sku', header: d.colSku, render: (p) => p.sku },
                    { key: 'price', header: d.colPrice, align: 'right', sortable: true, sortValue: (p) => p.price, render: (p) => formatCurrency(p.price) },
                    { key: 'gmv', header: d.colGmv, align: 'right', sortable: true, sortValue: (p) => p.gmv, render: (p) => formatCurrency(p.gmv) },
                    { key: 'orders', header: d.colOrders, align: 'right', sortable: true, sortValue: (p) => p.orders, render: (p) => formatInt(p.orders) },
                    { key: 'conversions', header: d.colConversions, align: 'right', sortable: true, sortValue: (p) => p.conversions, render: (p) => formatInt(p.conversions) },
                  ]}
                  rows={expandedCreative.products}
                  rowKey={(p) => p.id}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <DemoBadge />
    </Box>
  );
}

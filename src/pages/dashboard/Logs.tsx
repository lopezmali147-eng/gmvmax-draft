import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useLang } from '../../i18n';
import {
  dashboardData,
  LOG_RESULT_LABELS,
  type LogResult,
  type LogEntry,
} from '../../dashboard-data';
import { formatCurrency, formatInt } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DemoBadge from '../../components/dashboard/DemoBadge';
import ExportCsvButton from '../../components/dashboard/ExportCsvButton';

function resultColor(result: LogResult): 'success' | 'info' | 'default' | 'error' {
  if (result === 'applied') return 'success';
  if (result === 'notified') return 'info';
  if (result === 'skipped') return 'default';
  return 'error';
}

/**
 * 执行日志页（P0）：≥30 条历史记录，可按规则或结果筛选，并支持 CSV 导出（P2）。
 */
export default function Logs() {
  const { t, lang } = useLang();
  const d = t.dashboard.logs;

  const storeName = useMemo(() => {
    const map: Record<string, string> = {};
    dashboardData.stores.forEach((s) => {
      map[s.id] = s.name[lang];
    });
    return map;
  }, [lang]);

  const [ruleFilter, setRuleFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<'all' | LogResult>('all');

  const filtered = useMemo(
    () =>
      dashboardData.logs.filter(
        (l) =>
          (ruleFilter === 'all' || l.ruleId === ruleFilter) &&
          (resultFilter === 'all' || l.result === resultFilter),
      ),
    [ruleFilter, resultFilter],
  );

  const columns: Column<LogEntry>[] = [
    { key: 'time', header: d.colTime, sortable: true, sortValue: (l) => l.time, render: (l) => l.time },
    { key: 'store', header: d.colStore, render: (l) => storeName[l.storeId] ?? l.storeId },
    { key: 'rule', header: d.colRule, render: (l) => l.ruleName[lang] },
    { key: 'action', header: d.colAction, render: (l) => l.action[lang] },
    { key: 'result', header: d.colResult, render: (l) => <Chip size="small" label={LOG_RESULT_LABELS[l.result][lang]} color={resultColor(l.result)} /> },
    { key: 'impactGmv', header: d.colImpactGmv, align: 'right', sortable: true, sortValue: (l) => l.impactGmv, render: (l) => formatCurrency(l.impactGmv, '¥') },
  ];

  const csvRows: (string | number)[][] = filtered.map((l) => [
    l.time,
    storeName[l.storeId] ?? l.storeId,
    l.ruleName[lang],
    l.action[lang],
    LOG_RESULT_LABELS[l.result][lang],
    l.impactGmv,
  ]);

  return (
    <Box>
      <PageHeader
        title={d.title}
        subtitle={d.subtitle}
        action={<ExportCsvButton filename="gmvmax-logs.csv" headers={[d.colTime, d.colStore, d.colRule, d.colAction, d.colResult, d.colImpactGmv]} rows={csvRows} />}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="log-rule-label">{d.filterRule}</InputLabel>
          <Select labelId="log-rule-label" label={d.filterRule} value={ruleFilter} onChange={(e) => setRuleFilter(e.target.value)}>
            <MenuItem value="all">{t.dashboard.common.all}</MenuItem>
            {dashboardData.rules.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name[lang]}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="log-result-label">{d.filterResult}</InputLabel>
          <Select labelId="log-result-label" label={d.filterResult} value={resultFilter} onChange={(e) => setResultFilter(e.target.value as 'all' | LogResult)}>
            <MenuItem value="all">{t.dashboard.common.all}</MenuItem>
            <MenuItem value="applied">{LOG_RESULT_LABELS.applied[lang]}</MenuItem>
            <MenuItem value="notified">{LOG_RESULT_LABELS.notified[lang]}</MenuItem>
            <MenuItem value="skipped">{LOG_RESULT_LABELS.skipped[lang]}</MenuItem>
            <MenuItem value="failed">{LOG_RESULT_LABELS.failed[lang]}</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ ml: { sm: 'auto' }, alignSelf: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {formatInt(filtered.length)} / {formatInt(dashboardData.logs.length)}
          </Typography>
        </Box>
      </Stack>

      <DataTable columns={columns} rows={filtered} rowKey={(l) => l.id} />

      <DemoBadge />
    </Box>
  );
}

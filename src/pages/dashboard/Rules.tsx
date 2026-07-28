import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useLang } from '../../i18n';
import {
  dashboardData,
  FIELD_LABELS,
  OPERATOR_LABELS,
  PLAN_TYPE_LABELS,
  type Rule,
  type RuleCondition,
  type RuleConditionField,
  type RuleOperator,
  type PlanType,
} from '../../dashboard-data';
import { useRuleToggle } from '../../hooks/useRuleToggle';
import PageHeader from '../../components/dashboard/PageHeader';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DemoBadge from '../../components/dashboard/DemoBadge';

/** 将单条条件渲染为可读文本。 */
function conditionText(c: RuleCondition, lang: 'zh' | 'en'): string {
  const field = FIELD_LABELS[c.field][lang];
  const op = OPERATOR_LABELS[c.operator][lang];
  const val = Array.isArray(c.value) ? `${c.value[0]}–${c.value[1]}` : String(c.value);
  return `${field} ${op} ${val}`;
}

interface DraftCondition {
  field: RuleConditionField;
  operator: RuleOperator;
  value: number;
}

/** 条件 → 动作 逻辑可视化（纯 SVG 连线）。 */
function ConditionActionViz({
  conditions,
  planType,
  lang,
}: {
  conditions: DraftCondition[];
  planType: PlanType;
  lang: 'zh' | 'en';
}) {
  const theme = useTheme();
  const { t } = useLang();
  const W = 680;
  const H = 170;
  const boxY = 30;
  const boxH = 110;
  const leftX = 16;
  const leftW = 300;
  const rightX = 364;
  const rightW = 300;
  const arrowX1 = leftX + leftW + 8;
  const arrowX2 = rightX - 8;
  const midY = boxY + boxH / 2;

  const leftLines = conditions.slice(0, 4).map((c, i) => (
    <text key={i} x={leftX + 14} y={boxY + 42 + i * 20} fontSize={12} fill={theme.palette.text.primary}>
      {conditionText(c, lang)}
    </text>
  ));
  const moreText =
    conditions.length > 4 ? (
      <text x={leftX + 14} y={boxY + 42 + 4 * 20} fontSize={11} fill={theme.palette.text.secondary}>
        +{conditions.length - 4} …
      </text>
    ) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img" aria-label="condition-action">
      <rect x={leftX} y={boxY} width={leftW} height={boxH} rx={10} fill={theme.palette.primary.light} fillOpacity={0.12} stroke={theme.palette.primary.main} />
      <text x={leftX + 14} y={boxY + 24} fontSize={12} fontWeight={700} fill={theme.palette.primary.main}>
        {t.dashboard.rules.vizCondition}
      </text>
      {leftLines}
      {moreText}
      <line x1={arrowX1} y1={midY} x2={arrowX2 - 6} y2={midY} stroke={theme.palette.text.secondary} strokeWidth={2} />
      <polygon points={`${arrowX2},${midY} ${arrowX2 - 10},${midY - 6} ${arrowX2 - 10},${midY + 6}`} fill={theme.palette.text.secondary} />
      <rect x={rightX} y={boxY} width={rightW} height={boxH} rx={10} fill={theme.palette.secondary.light} fillOpacity={0.12} stroke={theme.palette.secondary.main} />
      <text x={rightX + 14} y={boxY + 24} fontSize={12} fontWeight={700} fill={theme.palette.secondary.main}>
        {t.dashboard.rules.vizAction}
      </text>
      <text x={rightX + 14} y={boxY + 56} fontSize={14} fontWeight={700} fill={theme.palette.text.primary}>
        {PLAN_TYPE_LABELS[planType][lang]}
      </text>
    </svg>
  );
}

/**
 * 智能规则页（P0）：规则列表（开关可切，localStorage 持久化）+ 新建规则表单（≥30 条件字段、5 种计划、可视化）。
 */
export default function Rules() {
  const { t, lang } = useLang();
  const d = t.dashboard.rules;

  const defaults = useMemo(() => {
    const m: Record<string, boolean> = {};
    dashboardData.rules.forEach((r) => {
      m[r.id] = r.enabled;
    });
    return m;
  }, []);
  const { enabledMap, toggle } = useRuleToggle(defaults);

  const [extraRules, setExtraRules] = useState<Rule[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [draftConditions, setDraftConditions] = useState<DraftCondition[]>([
    { field: 'roas', operator: 'lt', value: 2 },
  ]);
  const [draftPlan, setDraftPlan] = useState<PlanType>('budget');
  const [draftName, setDraftName] = useState('');

  const allRules = useMemo(() => [...dashboardData.rules, ...extraRules], [extraRules]);
  const storeName = useMemo(() => {
    const map: Record<string, string> = {};
    dashboardData.stores.forEach((s) => {
      map[s.id] = s.name[lang];
    });
    return map;
  }, [lang]);

  const ruleColumns: Column<Rule>[] = [
    { key: 'name', header: d.colName, render: (r) => <strong>{r.name[lang]}</strong> },
    { key: 'store', header: d.colStore, render: (r) => storeName[r.storeId] ?? r.storeId },
    {
      key: 'condition',
      header: d.colCondition,
      render: (r) => (
        <Box sx={{ maxWidth: 260 }}>
          {r.conditions.map((c, i) => (
            <Chip key={i} size="small" variant="outlined" label={conditionText(c, lang)} sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
      ),
    },
    { key: 'plan', header: d.colPlan, render: (r) => <Chip size="small" label={PLAN_TYPE_LABELS[r.planType][lang]} color="secondary" variant="outlined" /> },
    { key: 'triggers', header: d.colTriggers, align: 'right', sortable: true, sortValue: (r) => r.triggerCount, render: (r) => r.triggerCount },
    {
      key: 'status',
      header: d.colStatus,
      align: 'right',
      render: (r) => (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Typography variant="caption" sx={{ color: enabledMap[r.id] ?? r.enabled ? 'secondary.main' : 'text.disabled', fontWeight: 600 }}>
            {(enabledMap[r.id] ?? r.enabled) ? t.dashboard.common.enabled : t.dashboard.common.disabled}
          </Typography>
          <Switch
            size="small"
            edge="end"
            checked={!!(enabledMap[r.id] ?? r.enabled)}
            onChange={() => toggle(r.id)}
            inputProps={{ 'aria-label': r.name[lang] }}
          />
        </Stack>
      ),
    },
  ];

  const addCondition = () => setDraftConditions((prev) => [...prev, { field: 'gmv', operator: 'gt', value: 0 }]);
  const updateCondition = (idx: number, patch: Partial<DraftCondition>) =>
    setDraftConditions((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const removeCondition = (idx: number) => setDraftConditions((prev) => prev.filter((_c, i) => i !== idx));

  const handleCreate = () => {
    const newRule: Rule = {
      id: `new-${Date.now()}`,
      name: { zh: draftName || '新建规则', en: draftName || 'New Rule' },
      storeId: dashboardData.stores[0].id,
      conditions: draftConditions.map((c) => ({ ...c })),
      planType: draftPlan,
      planConfig: {},
      enabled: true,
      lastTriggered: '—',
      triggerCount: 0,
    };
    setExtraRules((prev) => [...prev, newRule]);
    setFormOpen(false);
    setDraftName('');
    setDraftConditions([{ field: 'roas', operator: 'lt', value: 2 }]);
    setDraftPlan('budget');
  };

  const fieldOptions = Object.keys(FIELD_LABELS) as RuleConditionField[];
  const operatorOptions = Object.keys(OPERATOR_LABELS) as RuleOperator[];
  const planOptions = Object.keys(PLAN_TYPE_LABELS) as PlanType[];

  return (
    <Box>
      <PageHeader
        title={d.title}
        subtitle={d.subtitle}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen((o) => !o)}>
            {d.newRule}
          </Button>
        }
      />

      {formOpen && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">{d.newRuleTitle}</Typography>
              <IconButton size="small" onClick={() => setFormOpen(false)} aria-label={d.cancelBtn}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <TextField
              size="small"
              label={d.colName}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              sx={{ mb: 2, minWidth: 280 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>{d.fieldLabel} / {d.operatorLabel} / {d.valueLabel}</Typography>
            <Stack spacing={1.5} sx={{ mb: 1.5 }}>
              {draftConditions.map((c, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id={`f-${idx}`}>{d.fieldLabel}</InputLabel>
                    <Select
                      labelId={`f-${idx}`}
                      label={d.fieldLabel}
                      value={c.field}
                      onChange={(e) => updateCondition(idx, { field: e.target.value as RuleConditionField })}
                    >
                      {fieldOptions.map((f) => (
                        <MenuItem key={f} value={f}>{FIELD_LABELS[f][lang]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel id={`o-${idx}`}>{d.operatorLabel}</InputLabel>
                    <Select
                      labelId={`o-${idx}`}
                      label={d.operatorLabel}
                      value={c.operator}
                      onChange={(e) => updateCondition(idx, { operator: e.target.value as RuleOperator })}
                    >
                      {operatorOptions.map((o) => (
                        <MenuItem key={o} value={o}>{OPERATOR_LABELS[o][lang]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    type="number"
                    label={d.valueLabel}
                    value={c.value}
                    onChange={(e) => updateCondition(idx, { value: Number(e.target.value) })}
                    sx={{ width: 140 }}
                  />
                  <IconButton size="small" onClick={() => removeCondition(idx)} aria-label="remove">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Button size="small" startIcon={<AddIcon />} onClick={addCondition} sx={{ mb: 2 }}>
              {d.addCondition}
            </Button>

            <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel id="plan-type">{d.planTypeLabel}</InputLabel>
              <Select labelId="plan-type" label={d.planTypeLabel} value={draftPlan} onChange={(e) => setDraftPlan(e.target.value as PlanType)}>
                {planOptions.map((p) => (
                  <MenuItem key={p} value={p}>{PLAN_TYPE_LABELS[p][lang]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>{d.vizTitle}</Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1, mb: 2 }}>
              <ConditionActionViz conditions={draftConditions} planType={draftPlan} lang={lang} />
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleCreate}>{d.createBtn}</Button>
              <Button variant="text" onClick={() => setFormOpen(false)}>{d.cancelBtn}</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <DataTable columns={ruleColumns} rows={allRules} rowKey={(r) => r.id} />

      <DemoBadge />
    </Box>
  );
}

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useLang } from '../../i18n';
import { dashboardData, PLAN_TYPE_LABELS, type PlanCatalogItem } from '../../dashboard-data';
import { formatInt } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import DemoBadge from '../../components/dashboard/DemoBadge';

function ConfigFieldRow({ field, lang }: { field: PlanCatalogItem['configFields'][number]; lang: 'zh' | 'en' }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {field.label[lang]}
      </Typography>
      {field.kind === 'select' ? (
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
          {(field.options ?? []).map((opt, i) => (
            <Chip key={i} size="small" variant="outlined" label={opt[lang]} />
          ))}
        </Stack>
      ) : (
        <TextField
          size="small"
          type={field.kind === 'number' ? 'number' : 'text'}
          placeholder={field.kind === 'number' ? '0' : '—'}
          disabled
          sx={{ mt: 0.5, width: 160 }}
        />
      )}
    </Box>
  );
}

/**
 * 自动化页（P0）：5 种执行计划卡片，各含配置项示意与触发统计。
 */
export default function Automation() {
  const { t, lang } = useLang();
  const d = t.dashboard.automation;

  return (
    <Box>
      <PageHeader title={d.title} subtitle={d.subtitle} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        }}
      >
        {dashboardData.planCatalog.map((item) => (
          <Card key={item.type} sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.title[lang]}
                  </Typography>
                  <Chip size="small" color="secondary" variant="outlined" label={PLAN_TYPE_LABELS[item.type][lang]} sx={{ mt: 0.5 }} />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {formatInt(item.triggerCount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {d.triggerCount}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 48 }}>
                {item.desc[lang]}
              </Typography>

              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{d.configTitle}</Typography>
              {item.configFields.map((f) => (
                <ConfigFieldRow key={f.key} field={f} lang={lang} />
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      <DemoBadge />
    </Box>
  );
}

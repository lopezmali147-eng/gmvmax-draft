import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { useLang } from '../../i18n';
import {
  dashboardData,
  CURRENCY_SYMBOL,
  STORE_STATUS_LABELS,
  type StoreBindingStatus,
  type Store,
} from '../../dashboard-data';
import { formatCurrency } from '../../format';
import PageHeader from '../../components/dashboard/PageHeader';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DemoBadge from '../../components/dashboard/DemoBadge';

function statusColor(status: StoreBindingStatus): 'success' | 'warning' | 'error' {
  if (status === 'connected') return 'success';
  if (status === 'pending') return 'warning';
  return 'error';
}

function initials(name: { zh: string; en: string }, lang: 'zh' | 'en'): string {
  const s = name[lang];
  return lang === 'zh' ? s.slice(0, 1) : s.slice(0, 1).toUpperCase();
}

/**
 * 账户管理页（P1）：多店铺 / 账户列表，含绑定状态、GMV 汇总与成员头像组。
 */
export default function Accounts() {
  const { t, lang } = useLang();
  const theme = useTheme();
  const d = t.dashboard.accounts;

  const avatarColors = [theme.palette.primary.main, theme.palette.secondary.main, '#7e57c2', '#ef6c00', '#00838f'];

  const columns: Column<Store>[] = [
    { key: 'name', header: d.colName, render: (s) => <strong>{s.name[lang]}</strong> },
    { key: 'advertiser', header: d.colAdvertiser, render: (s) => s.advertiser[lang] },
    { key: 'type', header: d.colType, render: (s) => s.type[lang] },
    { key: 'region', header: d.colRegion, render: (s) => s.region[lang] },
    {
      key: 'status',
      header: d.colStatus,
      render: (s) => <Chip size="small" label={STORE_STATUS_LABELS[s.bindingStatus][lang]} color={statusColor(s.bindingStatus)} />,
    },
    { key: 'gmv', header: d.colGmv, align: 'right', sortable: true, sortValue: (s) => s.gmvSummary, render: (s) => formatCurrency(s.gmvSummary, CURRENCY_SYMBOL[s.currency] ?? '¥') },
    {
      key: 'members',
      header: d.colMembers,
      render: (s) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
            {s.members.map((m, i) => (
              <Tooltip key={m.id} title={`${m.name[lang]} · ${m.role[lang]}`}>
                <Avatar sx={{ bgcolor: avatarColors[i % avatarColors.length] }}>{initials(m.name, lang)}</Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
          <Typography variant="caption" color="text.secondary">
            {s.members.length} {d.membersCount}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title={d.title} subtitle={d.subtitle} />

      <DataTable columns={columns} rows={dashboardData.stores} rowKey={(s) => s.id} />

      <DemoBadge />
    </Box>
  );
}

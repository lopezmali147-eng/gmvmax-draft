import { NavLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import RuleIcon from '@mui/icons-material/Rule';
import AutomationIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import HistoryIcon from '@mui/icons-material/History';
import AccountIcon from '@mui/icons-material/AccountBalance';
import { useLang } from '../../i18n';

const ICONS: Record<string, ReactNode> = {
  overview: <DashboardIcon fontSize="small" />,
  campaigns: <CampaignIcon fontSize="small" />,
  rules: <RuleIcon fontSize="small" />,
  automation: <AutomationIcon fontSize="small" />,
  metrics: <InsightsIcon fontSize="small" />,
  logs: <HistoryIcon fontSize="small" />,
  accounts: <AccountIcon fontSize="small" />,
};

/**
 * 左侧 7 子路由入口。桌面端为固定竖向侧栏，移动端为横向滚动导航。
 * 高亮逻辑：精确匹配 pathname。/dashboard 仅在其自身高亮。
 */
export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t } = useLang();
  const items = t.dashboard.nav;

  const isActive = (to: string): boolean => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const renderItem = (item: (typeof items)[number]) => (
    <ListItemButton
      key={item.key}
      component={NavLink}
      to={item.to}
      selected={isActive(item.to)}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        mx: isMobile ? 0.5 : 1,
        minWidth: isMobile ? 'auto' : undefined,
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{ICONS[item.key]}</ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
    </ListItemButton>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: 1,
          py: 1,
        }}
      >
        {items.map((item) => renderItem(item))}
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: 248,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        py: 2,
      }}
    >
      <List disablePadding>{items.map((item) => renderItem(item))}</List>
    </Box>
  );
}

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import BoltIcon from '@mui/icons-material/Bolt';
import { useLang } from '../../i18n';

/**
 * 看板页底部「演示数据」标识，提示当前数据为模拟生成。
 */
export default function DemoBadge() {
  const { t } = useLang();
  return (
    <Box
      sx={{
        mt: 4,
        pt: 2,
        borderTop: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Chip
        icon={<BoltIcon />}
        label="DEMO"
        color="primary"
        size="small"
        variant="outlined"
      />
      <Typography variant="caption" color="text.secondary">
        {t.dashboard.common.demoData}
      </Typography>
    </Box>
  );
}

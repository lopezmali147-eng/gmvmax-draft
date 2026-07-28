import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';
import { useLang } from '../../i18n';

export interface StateViewProps {
  variant: 'loading' | 'empty';
}

/**
 * 空态 / Loading 态占位（P2）。根据 variant 展示加载动画或空数据提示。
 */
export default function StateView({ variant }: StateViewProps) {
  const { t } = useLang();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 8,
        color: 'text.secondary',
      }}
    >
      {variant === 'loading' ? (
        <CircularProgress size={36} />
      ) : (
        <InboxIcon sx={{ fontSize: 40, opacity: 0.6 }} />
      )}
      <Typography variant="body2">
        {variant === 'loading' ? t.dashboard.common.loading : t.dashboard.common.empty}
      </Typography>
    </Box>
  );
}

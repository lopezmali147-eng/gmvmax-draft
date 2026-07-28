import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/**
 * 看板统一页头：标题 + 副标题 + 右侧操作位（如导出按钮）。
 */
export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Stack>
  );
}

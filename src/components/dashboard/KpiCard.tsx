import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import { formatDelta } from '../../format';

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  icon?: ReactNode;
}

/**
 * 复用型 KPI 指标卡：标签 + 主数值 + 涨跌（带符号、绿涨红跌）。
 */
export default function KpiCard({ label, value, delta, icon }: KpiCardProps) {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {icon && (
            <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {delta !== undefined && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: delta >= 0 ? theme.palette.secondary.main : theme.palette.error.main,
            }}
          >
            {formatDelta(delta)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

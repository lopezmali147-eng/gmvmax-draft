import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

export interface TrendSeries {
  label: string;
  color: string;
  points: number[];
}

export interface TrendChartProps {
  series: TrendSeries[];
  xLabels: string[];
  height?: number;
  areaFill?: boolean;
}

/**
 * 复用型纯 SVG 折线图（支持 1–2 条 series）。
 * 响应式 viewBox="0 0 680 H"，无第三方图表依赖。
 */
export default function TrendChart({ series, xLabels, height = 260, areaFill = true }: TrendChartProps) {
  const theme = useTheme();
  const W = 680;
  const H = height;
  const padL = 16;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = xLabels.length || 1;

  const allValues = series.flatMap((s) => s.points);
  const maxVal = Math.max(1, ...allValues);
  const minVal = Math.min(0, ...allValues);

  const xAt = (i: number): number => padL + (innerW * i) / Math.max(1, n - 1);
  const yAt = (v: number): number => {
    const span = maxVal - minVal || 1;
    return padT + innerH * (1 - (v - minVal) / span);
  };

  const toPoints = (pts: number[]): string => pts.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ');
  const areaPoints = (pts: number[]): string =>
    `${padL},${padT + innerH} ${toPoints(pts)} ${padL + innerW},${padT + innerH}`;

  const gridFractions = [0, 0.25, 0.5, 0.75, 1];
  const gridYs = gridFractions.map((f) => padT + innerH * f);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
        {series.map((s) => (
          <Chip
            key={s.label}
            size="small"
            label={s.label}
            sx={{ bgcolor: s.color, color: '#fff', fontWeight: 600 }}
          />
        ))}
      </Stack>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img" aria-label={series[0]?.label ?? 'trend'}>
        {gridYs.map((y, i) => (
          <line key={i} x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="#eceef4" strokeWidth={1} />
        ))}
        {series.map((s, idx) => (
          <g key={`g-${idx}`}>
            {areaFill && idx === 0 && (
              <polygon points={areaPoints(s.points)} fill={s.color} fillOpacity={0.08} />
            )}
            <polyline
              points={toPoints(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth={idx === 0 ? 2.5 : 2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        ))}
        {xLabels.map((label, i) =>
          i % Math.ceil(n / 7) === 0 || i === n - 1 ? (
            <text key={i} x={xAt(i)} y={H - 8} fontSize={10} textAnchor="middle" fill={theme.palette.text.secondary}>
              {label}
            </text>
          ) : null,
        )}
      </svg>
    </Box>
  );
}

import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '../../i18n';

export interface ExportCsvButtonProps {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

/**
 * CSV 导出示意（P2）：纯前端通过 Blob 生成下载，不接后端。
 * 仅用于演示数据导出交互。
 */
export default function ExportCsvButton({ filename, headers, rows }: ExportCsvButtonProps) {
  const { t } = useLang();

  const handleExport = () => {
    const escape = (val: string | number): string => {
      const s = String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))];
    const csv = '﻿' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} size="small">
      {t.dashboard.common.exportCsv}
    </Button>
  );
}

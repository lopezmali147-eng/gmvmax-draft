import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';

/**
 * 看板外壳：左侧 Sidebar + 右侧 Outlet 内容区。
 * 响应式：桌面端左右分栏，移动端 Sidebar 顶部横向滚动。
 */
export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          maxWidth: isMobile ? '100%' : 'calc(100% - 248px)',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

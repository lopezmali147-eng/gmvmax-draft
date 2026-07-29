import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLang } from '../i18n';
import { TIKTOK_OAUTH_DEMO_URL } from '../oauth';

/**
 * 仿真 TikTok 官方 OAuth 授权页（演示用）。
 *
 * 该页面用于「项 9：Screen Recordings」录屏材料，纯前端模拟 TikTok 授权界面：
 *  - 顶部为仿真浏览器地址栏，展示真实形态的授权 URL 与 client_id（DEMO 字面量）；
 *  - 主体为模拟 TikTok 授权登录卡片；
 *  - 「授权并连接」写入 localStorage 标记后返回 Accounts 页；「取消」直接返回。
 *
 * 注意：地址栏为纯展示组件，不发起任何真实导航或网络请求。
 */
export default function OAuthTikTokDemo() {
  const { t } = useLang();
  const navigate = useNavigate();
  const theme = useTheme();
  const o = t.oauth;

  /** 授权并连接：跳转到 OAuth callback 落地页（演示用，由 callback 页写入连接标记）。 */
  const handleAuthorize = () => {
    navigate('/oauth/callback?code=demo_code_1785&state=demo123');
  };

  /** 取消：不写入任何标记，直接返回系统账户页。 */
  const handleCancel = () => {
    navigate('/accounts');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#eef0f4',
        py: { xs: 3, md: 6 },
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 640, width: '100%', mx: 'auto' }}>
        <Card sx={{ overflow: 'hidden', boxShadow: 3 }}>
          {/* 仿真浏览器地址栏：锁形图标 + tiktok.com 标注 + 授权 URL */}
          <Box
            sx={{
              bgcolor: '#eceef1',
              borderRadius: 0,
              p: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ flexShrink: 0, pt: 0.5 }}
            >
              <LockIcon sx={{ fontSize: 16, color: '#5a6275' }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#5a6275', whiteSpace: 'nowrap' }}
              >
                tiktok.com
              </Typography>
            </Stack>
            <Box
              sx={{
                flex: 1,
                bgcolor: '#ffffff',
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: '#1a1f36',
                  wordBreak: 'break-all',
                }}
              >
                {TIKTOK_OAUTH_DEMO_URL}
              </Typography>
            </Box>
          </Box>

          {/* 地址栏附近的演示标注，避免误导审核方 */}
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#888', px: 2, pt: 1 }}
          >
            {o.demoNote}
          </Typography>

          {/* 仿真 TikTok 授权登录卡片 */}
          <Box sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
            <Chip
              label={o.simulatedBanner}
              size="small"
              color="default"
              variant="outlined"
              sx={{ mb: 2, color: '#5a6275' }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#fe2c55' }}
            >
              TikTok
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {o.pageHeading}
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 3, fontWeight: 700, lineHeight: 1.45 }}
            >
              {o.authPrompt}
            </Typography>

            <Box
              sx={{
                mt: 3,
                textAlign: 'left',
                bgcolor: '#f7f8fb',
                borderRadius: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              >
                {o.scopeTitle}
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.25 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: theme.palette.success.main }}
                  />
                  <Typography variant="body2">{o.scopeBasic}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: theme.palette.success.main }}
                  />
                  <Typography variant="body2">{o.scopeAd}</Typography>
                </Stack>
              </Stack>
            </Box>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAuthorize}
                sx={{
                  bgcolor: '#fe2c55',
                  '&:hover': { bgcolor: '#e0214a' },
                  fontWeight: 700,
                }}
              >
                {o.authorize}
              </Button>
              <Button
                variant="text"
                size="large"
                onClick={handleCancel}
                sx={{ color: 'text.secondary' }}
              >
                {o.cancel}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

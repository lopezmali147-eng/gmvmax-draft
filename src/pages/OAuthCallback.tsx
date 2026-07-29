import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLang } from '../i18n';
import { setTikTokConnected, DEMO_USERNAME } from '../oauth';

/**
 * OAuth callback 落地页（演示用）。
 *
 * 纯前端 mock：模拟 TikTok 授权后回调控牌换码成功的落地页。
 *  - 读取 URL query 中的 code / state（演示场景可不依赖真实值）；
 *  - 写入 localStorage 演示连接标记，使返回 Accounts 页后展示「已连接」；
 *  - 展示成功反馈，数秒后自动返回控制台，并提供手动返回按钮。
 *  - 顶部标注「演示授权逻辑」，避免误导审核方。
 */
export default function OAuthCallback() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const o = t.oauth;
  const code = params.get('code');

  useEffect(() => {
    setTikTokConnected(DEMO_USERNAME);
    const timer = setTimeout(() => navigate('/accounts'), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#eef0f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '100%',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>
          {o.authorized}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {o.returning}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: '#888', mt: 2 }}>
          {o.demoNote}
        </Typography>
        {code && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#888',
              mt: 0.5,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            }}
          >
            code={code}
          </Typography>
        )}
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/accounts')}>
          {o.backToConsole}
        </Button>
      </Card>
    </Box>
  );
}

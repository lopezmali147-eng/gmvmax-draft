import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useLang } from '../i18n';

/**
 * 页面底部：版权信息 + 隐私/条款链接（文案随全局语言切换）。
 */
export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ bgcolor: '#0f1630', color: 'rgba(255,255,255,0.78)', py: 5 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>
              GMVMAX
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
              {t.footer.tagline}
            </Typography>
          </Box>
          <Stack direction="row" spacing={3}>
            <Link
              component={RouterLink}
              to="/privacy"
              underline="hover"
              sx={{ color: 'rgba(255,255,255,0.78)' }}
            >
              {t.nav.links[1].label}
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              underline="hover"
              sx={{ color: 'rgba(255,255,255,0.78)' }}
            >
              {t.nav.links[2].label}
            </Link>
          </Stack>
        </Stack>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 3 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © {year} {t.footer.copyright}
        </Typography>
      </Container>
    </Box>
  );
}

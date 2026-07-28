import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import GroupIcon from '@mui/icons-material/Group';
import { useLang } from '../i18n';

/** 核心能力图标（与文案解耦，语言无关）。 */
const CAPABILITY_ICONS = [
  <AutoAwesomeIcon key="auto" />,
  <InsightsIcon key="insights" />,
  <SmartButtonIcon key="smart" />,
  <GroupIcon key="group" />,
];

/**
 * 产品介绍落地页：Hero、核心能力、工作流程、常见问题与底部 CTA。
 * 全部文案来自全局 i18n，切换语言即时更新。
 */
export default function Landing() {
  const { t } = useLang();
  const l = t.landing;

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(180deg,#ffffff 0%, #eef1fb 100%)',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: '0.12em' }}
            >
              {l.eyebrow}
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{ maxWidth: 800, fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {l.heroTitle}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 680, fontWeight: 400 }}>
              {l.heroSub}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
              <Button variant="contained" size="large" component={RouterLink} to="/">
                {l.ctaPrimary}
              </Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/privacy">
                {l.ctaSecondary}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 核心能力 */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={1} textAlign="center" sx={{ mb: 5 }}>
          <Typography variant="h4" component="h2">
            {l.capabilitiesTitle}
          </Typography>
          <Typography color="text.secondary">{l.capabilitiesSub}</Typography>
        </Stack>
        <Grid container spacing={3}>
          {l.capabilities.map((c, idx) => (
            <Grid item xs={12} sm={6} md={3} key={c.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'primary.light', mb: 2, color: 'primary.dark' }}>
                    {CAPABILITY_ICONS[idx]}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {c.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {c.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 工作流程 */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1} textAlign="center" sx={{ mb: 5 }}>
            <Typography variant="h4" component="h2">
              {l.workflowTitle}
            </Typography>
            <Typography color="text.secondary">{l.workflowSub}</Typography>
          </Stack>
          <Grid container spacing={3}>
            {l.workflow.map((w) => (
              <Grid item xs={12} sm={6} md={3} key={w.step}>
                <Stack
                  spacing={1.5}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  textAlign={{ xs: 'center', md: 'left' }}
                >
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 800, opacity: 0.85 }}>
                    {w.step}
                  </Typography>
                  <Typography variant="h6">{w.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {w.desc}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 常见问题 */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={1} textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2">
            {l.faqTitle}
          </Typography>
          <Typography color="text.secondary">{l.faqSub}</Typography>
        </Stack>
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          {l.faqs.map((f) => (
            <Accordion
              key={f.q}
              elevation={0}
              sx={{ bgcolor: 'background.paper', border: '1px solid #eceef4', mb: 1.5 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* 底部 CTA */}
      <Box
        sx={{
          background: 'linear-gradient(135deg,#2e3d8c 0%, #3f51b5 100%)',
          color: '#fff',
          py: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" component="h2" sx={{ color: '#fff' }}>
              {l.ctaTitle}
            </Typography>
            <Typography sx={{ maxWidth: 600, color: 'rgba(255,255,255,0.85)' }}>{l.ctaSub}</Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#f0f2ff' } }}
              component={RouterLink}
              to="/"
            >
              {l.ctaButton}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

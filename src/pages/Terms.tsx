import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useLang } from '../i18n';

/**
 * 服务条款页：说明使用资格、账户责任、服务范围与限制、免责声明、终止条款与法律适用。
 * 全部文案来自全局 i18n，覆盖 6 个合规要点，中英文案齐全。
 */
export default function Terms() {
  const { t } = useLang();
  const tm = t.terms;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {tm.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {tm.updatedLabel}
        {tm.updatedAt}
      </Typography>
      <Typography variant="body1" paragraph>
        {tm.intro}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {tm.sections.map((section) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            {section.title}
          </Typography>
          {section.paragraphs.map((para, idx) => (
            <Typography
              key={idx}
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ lineHeight: 1.8 }}
            >
              {para}
            </Typography>
          ))}
        </Box>
      ))}

      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color="text.secondary">
        {tm.draftNote}
      </Typography>
    </Container>
  );
}

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useLang } from '../i18n';

/**
 * 隐私政策页：说明数据收集、使用、共享、用户权利、保留与联系方式，内容合规、可用于 TikTok 开发者平台申请。
 * 全部文案来自全局 i18n，覆盖 7 个合规要点，中英文案齐全，联系邮箱已统一为 hali@paofou.vip。
 */
export default function Privacy() {
  const { t } = useLang();
  const p = t.privacy;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {p.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {p.updatedLabel}
        {p.updatedAt}
      </Typography>
      <Typography variant="body1" paragraph>
        {p.intro}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {p.sections.map((section) => (
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
        {p.draftNote}
      </Typography>
    </Container>
  );
}

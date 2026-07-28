import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import BoltIcon from '@mui/icons-material/Bolt';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useLang } from '../i18n';

/**
 * 语言切换分段控件：中文 / EN，高亮当前语言。
 * 使用 MUI 原生按钮，无需额外依赖。
 */
function LangToggle() {
  const { lang, setLang } = useLang();
  const segmentStyle = {
    minWidth: 'auto',
    px: 1.5,
    py: 0.5,
    fontSize: '0.8rem',
    borderRadius: 1.5,
  } as const;

  return (
    <Box
      role="group"
      aria-label="Language switch"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Button
        onClick={() => setLang('zh')}
        aria-pressed={lang === 'zh'}
        sx={{
          ...segmentStyle,
          color: lang === 'zh' ? 'primary.main' : 'text.secondary',
          fontWeight: lang === 'zh' ? 700 : 500,
          bgcolor: lang === 'zh' ? 'primary.light' : 'transparent',
        }}
      >
        中文
      </Button>
      <Button
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        sx={{
          ...segmentStyle,
          color: lang === 'en' ? 'primary.main' : 'text.secondary',
          fontWeight: lang === 'en' ? 700 : 500,
          bgcolor: lang === 'en' ? 'primary.light' : 'transparent',
        }}
      >
        EN
      </Button>
    </Box>
  );
}

/**
 * 顶部导航栏：Logo、导航链接与“申请试用”CTA，移动端折叠为菜单。
 * 导航文案与语言切换均来自全局 i18n，保持现有响应式行为。
 */
export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t, lang } = useLang();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
          >
            <BoltIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              GMVMAX
            </Typography>
          </Box>

          {/* 右侧操作区：桌面端导航 + CTA + 语言切换；移动端语言切换 + 菜单 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                {t.nav.links.map((link) => (
                  <Button
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    color={location.pathname === link.to ? 'primary' : 'inherit'}
                    sx={{ fontWeight: 600 }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  component={RouterLink}
                  to="/demo"
                  color={location.pathname === '/demo' ? 'primary' : 'inherit'}
                  sx={{ fontWeight: 600 }}
                >
                  {t.nav.demo[lang]}
                </Button>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  color={location.pathname.startsWith('/dashboard') ? 'primary' : 'inherit'}
                  sx={{ fontWeight: 600 }}
                >
                  {t.nav.dashboard[lang]}
                </Button>
                <Button variant="contained" color="primary" sx={{ ml: 1 }} component={RouterLink} to="/">
                  {t.nav.cta}
                </Button>
              </>
            )}

            <LangToggle />

            {isMobile && (
              <IconButton edge="end" aria-label="菜单" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* 移动端菜单 */}
          {isMobile && (
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {t.nav.links.map((link) => (
                <MenuItem
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  onClick={handleMenuClose}
                  selected={location.pathname === link.to}
                >
                  {link.label}
                </MenuItem>
              ))}
              <MenuItem
                component={RouterLink}
                to="/demo"
                onClick={handleMenuClose}
                selected={location.pathname === '/demo'}
              >
                {t.nav.demo[lang]}
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleMenuClose}
                selected={location.pathname.startsWith('/dashboard')}
              >
                {t.nav.dashboard[lang]}
              </MenuItem>
              <MenuItem component={RouterLink} to="/" onClick={handleMenuClose}>
                {t.nav.cta}
              </MenuItem>
            </Menu>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

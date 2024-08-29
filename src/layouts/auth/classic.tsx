import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import Footer from 'src/layouts/dashboard/footer';
// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Stack direction={"row"} marginTop={2} marginLeft={3} marginBottom={1} zIndex={-5}>
      <Logo
      />
      <Stack>
        <Typography variant="subtitle2" color={"grey"}>UrsaTech</Typography>
        <Typography variant="subtitle1" marginTop={-0.5}>成绩单数据管理系统</Typography>
      </Stack>
  </Stack>
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center'}} marginTop={1}>
        {title || '登录系统'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/login/data_analytics.png'}
        sx={{
          maxWidth: {
            xs: 480,
            lg: 500,
            xl: 600,
          },
        }}
      />

    </Stack>
  );

  return (
    <>
    {renderLogo}
    <Stack>
      <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '65vh',
      }}
    >
      

      {mdUp && renderSection}

      {renderContent}
    </Stack>
     <Footer></Footer>
    </Stack>
    </>
  );
}

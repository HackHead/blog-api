import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const { id, createdAt, updatedAt, thumbnail, pubDate, name, author, category } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  
  // const POST_INFO = [
  //   { number: comment, icon: 'eva:message-circle-fill' },
  //   { number: view, icon: 'eva:eye-fill' },
  //   { number: share, icon: 'eva:share-fill' },
  // ];

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
            }}
          />
          <StyledAvatar
            alt={author.full_name}
            src={author.avatarUrl}
          />

          <StyledCover alt={'title'} src={thumbnail} />
        </StyledCardMedia>

        <CardContent
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)} by {author.full_name}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
          >
            {name}
          </StyledTitle>

          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              // ml: index === 0 ? 0 : 1.5,
              // ...((latestPostLarge || latestPost) && {
              //   color: 'grey.500',
              // }),
            }}
          >
            {/* <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} /> */}
            <Typography variant="caption">{category.name}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

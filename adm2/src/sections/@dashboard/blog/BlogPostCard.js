import { useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import LocaleContext from '../../../contexts/LocaleContext';

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
  const { id, createdAt, thumbnail, author, category, name } = post;
  const {selectedLanguage} = useContext(LocaleContext);

  const categoryName = post?.category.locale[selectedLanguage.code]?.name;
  const postTitle = post?.locale[selectedLanguage.code]?.title;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia
        >
          <StyledCover alt={thumbnail.alt} src={thumbnail?.url || '/assets/images/covers/image-placeholder.svg'} />
        </StyledCardMedia>

        <CardContent
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)} by {author.full_name}
          </Typography>
            <Link to={`/article/${id}`} style={{cursor: 'pointer', color: 'black', textDecoration: 'none'}}>{name}</Link>

          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption">{category.name}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

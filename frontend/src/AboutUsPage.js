import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box, Link } from '@mui/material';

import candice from './assets/images/profile-pics/candice.jpg';
import colin from './assets/images/profile-pics/colin.png';
import jie from './assets/images/profile-pics/jie.jpg';
import letian from './assets/images/profile-pics/letian.jpg';
import linyuan from './assets/images/profile-pics/linyuan.jpg';
import sahil from './assets/images/profile-pics/sahil.jpg';
import alvin from './assets/images/profile-pics/alvin.jpg';

import { disclaimerText } from './constants';

const contributors = [
  { name: 'Candice Yang', image: candice },
  { name: 'Colin Cai', image: colin },
  { name: 'Jie Qiu', image: jie },
  { name: 'Letian Cheng', image: letian },
  { name: 'Linyuan Gong', image: linyuan },
  { name: 'Sahil Bhatia', image: sahil },
  { name: 'Alvin Cheung', image: alvin },
];

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      {/* Short description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to LMCode! Get instant solutions to your programming questions from multiple language models, each offering unique insights and approaches. Compare answers, explore different perspectives, and find the best fit for your needs—all without waiting for human replies.
        </Typography>
      </Box>

      {/* Contributors section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Meet the Team
        </Typography>
        <Grid container spacing={4}>
          {contributors.map((contributor, index) => (
            <Grid item xs={8} sm={5} md={3} key={index}>
              <Card sx={{ textAlign: 'center' }}>
                <CardMedia
                  component="img"
                  image={contributor.image}
                  alt={`${contributor.name}`}
                  sx={{ width: 175, height: 175, borderRadius: '50%', margin: '20px auto' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h4">
                    {contributor.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact us section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          If you have any questions or feedback, please feel free to reach out to us at{' '}
          <Link href="mailto:lmcode@berkeley.edu" underline="hover">
            lmcode@berkeley.edu
          </Link>.
        </Typography>
      </Box>

      {/* Footer with disclaimer */}
      <Box component="footer" sx={{ mt: 2, pt: 4, mb: 8, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="textSecondary" align="center" >
          <strong>Disclaimer:</strong> {disclaimerText}.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;

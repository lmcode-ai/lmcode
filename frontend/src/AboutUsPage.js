import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box, Link } from '@mui/material';

import alvin from './assets/images/profile-pics/alvin.jpg';
import sahil from './assets/images/profile-pics/sahil.jpg';
import colin from './assets/images/profile-pics/colin.png';
import { disclaimerText } from './constants';

// Sample images for contributors
const contributors = [
  { name: 'Candice Yang', image: 'https://via.placeholder.com/100' },
  { name: 'Colin Cai', image: colin },
  { name: 'Jie Qiu', image: 'https://via.placeholder.com/100' },
  { name: 'Letian Cheng', image: 'https://via.placeholder.com/100' },
  { name: 'Linyuan Gong', image: 'https://via.placeholder.com/100' },
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
          Welcome to LMCode! LMCode is a platform for evaluating different large language models (LLMs) on various coding tasks.
          If you have any questions or feedback, we'd love to hear from you!
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

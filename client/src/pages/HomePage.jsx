

import { Box, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `Welcome ${user.name}` : 'Welcome to Mini CRM'}
      </Typography>

      {!user ? (
        <Typography variant="body1" paragraph>
          Please <Link to="/login">login</Link> to manage your campaigns and customer segments.
        </Typography>
      ) : (
        <>
          <Typography variant="body1" paragraph>
            Manage your customer segments and marketing campaigns in one place.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {/* Create Campaign Box */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Create Campaign
                </Typography>
                <Typography variant="body2" paragraph>
                  Design and send targeted marketing campaigns.
                </Typography>
                <Button variant="contained" component={Link} to="/campaigns" sx={{ mt: 2 }}>
                  Go to Campaigns
                </Button>
              </Box>
            </Grid>

            {/* Build Segments Box */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Build Segments
                </Typography>
                <Typography variant="body2" paragraph>
                  Create customer segments based on demographics, etc.
                </Typography>
                <Button variant="contained" component={Link} to="/segments" sx={{ mt: 2 }}>
                  Go to Segments
                </Button>
              </Box>
            </Grid>


            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  View Customers
                </Typography>
                <Typography variant="body2" paragraph>
                  Track the customer
                </Typography>
                <Button variant="contained" component={Link} to="/customers" sx={{ mt: 2 }}>
                  View Customer Details
                </Button>
              </Box>
            </Grid>

            {/* View History Box */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  View History
                </Typography>
                <Typography variant="body2" paragraph>
                  Track the performance of your past campaigns.
                </Typography>
                <Button variant="contained" component={Link} to="/history" sx={{ mt: 2 }}>
                  View Campaigns
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default HomePage;

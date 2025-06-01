import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getCampaigns, getSegments, getCustomers } from '../utils/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    campaigns: 0,
    segments: 0,
    customers: 0,
    sentMessages: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [campaignsRes, segmentsRes, customersRes] = await Promise.all([
          getCampaigns(),
          getSegments(),
          getCustomers()
        ]);
        
        const sentMessages = campaignsRes.data.reduce(
          (acc, campaign) => acc + campaign.sentCount, 0
        );
        
        setStats({
          campaigns: campaignsRes.data.length,
          segments: segmentsRes.data.length,
          customers: customersRes.data.length,
          sentMessages,
          isLoading: false
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchStats();
  }, []);

  if (stats.isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card component={Link} to="/campaigns" sx={{ textDecoration: 'none' }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Campaigns
              </Typography>
              <Typography variant="h4">
                {stats.campaigns}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card component={Link} to="/segments" sx={{ textDecoration: 'none' }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Segments
              </Typography>
              <Typography variant="h4">
                {stats.segments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card component={Link} to="/customers" sx={{ textDecoration: 'none' }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Customers
              </Typography>
              <Typography variant="h4">
                {stats.customers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Messages Sent
              </Typography>
              <Typography variant="h4">
                {stats.sentMessages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={Link} 
            to="/campaigns" 
            sx={{ 
              textDecoration: 'none',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                Create New Campaign
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={Link} 
            to="/segments" 
            sx={{ 
              textDecoration: 'none',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                Build New Segment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            component={Link} 
            to="/customers" 
            sx={{ 
              textDecoration: 'none',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                View Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
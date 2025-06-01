import { useState,useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import CampaignForm from '../components/CampaignForm';
import CampaignHistory from '../components/CampaignHistory';
import { useParams } from 'react-router-dom';
import CampaignDetails from '../components/CampaignDetails';
import { useLocation } from 'react-router-dom';

const CampaignPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = parseInt(queryParams.get('tab')) || 0;

  const [tabValue, setTabValue] = useState(defaultTab);
  const { id } = useParams();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setTabValue(defaultTab); // Ensure it's updated on navigation
  }, [defaultTab]);

  if (id) {
    return <CampaignDetails />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Campaign Management
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Create Campaign" />
        <Tab label="Campaign History" />
      </Tabs>
      
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <CampaignForm onSuccess={() => setTabValue(1)} />
        )}
        
        {tabValue === 1 && (
          <CampaignHistory />
        )}
      </Box>
    </Box>
  );
};

export default CampaignPage;
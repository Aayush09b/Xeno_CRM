import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import SegmentBuilder from '../components/SegmentBuilder';
import SegmentPreview from '../components/SegmentPreview';
import { createSegment } from '../utils/api';
import { useNavigate } from 'react-router-dom';


const SegmentPage = () => {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [segments, setSegments] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateSegment = async (segmentData) => {
    try {
      const response = await createSegment(segmentData);
      setSegments([...segments, response.data]);
      navigate('/campaigns?tab=1');
      // setTabValue(1); // Switch to preview tab
    } catch (err) {
      console.error('Failed to create segment:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Audience Segmentation
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Builder" />
        <Tab label="My Segments" />
      </Tabs>
      
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <SegmentBuilder onSave={handleCreateSegment} />
        )}
        
        {tabValue === 1 && (
          <SegmentPreview segments={segments} />
        )}
      </Box>
    </Box>
  );
};

export default SegmentPage;
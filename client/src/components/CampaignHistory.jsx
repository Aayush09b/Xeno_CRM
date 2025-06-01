import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Chip
} from '@mui/material';
import { getCampaigns, sendCampaign } from '../utils/api';
import { Link } from 'react-router-dom';

const statusColors = {
  draft: 'default',
  sending: 'info',
  sent: 'success',
  failed: 'error'
};

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();
        // setCampaigns(response.data);
        setCampaigns(response.data.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)));

      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleSend = async (id) => {
    try {
      console.log(id)
      setSendingId(id);
      await sendCampaign(id);
      const response = await getCampaigns();
      // setCampaigns(response.data);
      setCampaigns(response.data.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)));

    } catch (err) {
      console.error('Failed to send campaign:', err);
    } finally {
    setSendingId(null);
  }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Campaign History
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Sent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell>
                  <Link to={`/campaigns/${campaign._id}`}>{campaign.name}</Link>
                </TableCell>
                <TableCell>{campaign.segment?.name}</TableCell>
                <TableCell>{campaign.totalCount}</TableCell>
                <TableCell>{campaign.sentCount}</TableCell>
                <TableCell>
                  <Chip 
                    label={campaign.status} 
                    color={statusColors[campaign.status]} 
                  />
                </TableCell>
                <TableCell>
                  {campaign.status === 'draft' && (
                    <Button 
                      size="small" 
                      onClick={() => handleSend(campaign._id)}
                      disabled={sendingId === campaign._id}
                    >
                      {sendingId === campaign._id ? 'Sending...' : 'Send'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignHistory;

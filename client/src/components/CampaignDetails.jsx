

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
  Chip,
  Divider
} from '@mui/material';
import { getCampaign, retryFailed } from '../utils/api';
import { useParams } from 'react-router-dom';

const statusColors = {
  sent: 'success',
  failed: 'error'
};

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaign(id);
        setCampaign(response.data);
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleRetry = async () => {
    try {
      await retryFailed(id);
      const response = await getCampaign(id);
      setCampaign(response.data);
    } catch (err) {
      console.error('Failed to retry campaign:', err);
    }
  };

  if (!campaign) return <Typography>Loading...</Typography>;

  const failedLogs = campaign.logs.filter(log => log.status === 'failed');
  const sentLogs = campaign.logs.filter(log => log.status === 'sent');

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {campaign.name}
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Segment: {campaign.segment?.name}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip label={`Total: ${campaign.totalCount}`} variant="outlined" />
        <Chip label={`Sent: ${sentLogs.length}`} color="success" variant="outlined" />
        <Chip label={`Failed: ${failedLogs.length}`} color="error" variant="outlined" />
      </Box>
      
      <Typography variant="body1" paragraph>
        {campaign.message}
      </Typography>

      {failedLogs.length > 0 && campaign.status !== 'sending' && (
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleRetry}
          >
            Retry Failed ({failedLogs.length})
          </Button>
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Communication Logs
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Error</TableCell>
              <TableCell>Delivery Time</TableCell>
              <TableCell>Message</TableCell> {/* 🆕 Added header for Message */}
            </TableRow>
          </TableHead>
          <TableBody>
            {campaign.logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.customer?.name || 'Unknown'}</TableCell>
                <TableCell>{log.customer?.email || 'Unknown'}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.status} 
                    color={statusColors[log.status]} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.error || '-'}</TableCell>
                <TableCell>
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {log.message || '-'}
                </TableCell> {/* 🆕 Display individual message */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignDetails;

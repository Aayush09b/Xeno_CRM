
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box, Typography, Button, Grid, Paper, Divider } from '@mui/material';
import { getCampaigns } from '../utils/api';

export default function History() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    getCampaigns()
      .then(res => {
        console.log('Fetched campaigns:', res.data);
        setCampaigns(res.data);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err.response?.data || err.message);
      });
  }, []);

  const handleCompare = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparedCampaigns = campaigns.filter(c => selectedIds.includes(c._id));

  const chartData = {
    labels: comparedCampaigns.map(c => c.name),
    datasets: [
      {
        label: 'Sent',
        backgroundColor: '#22c55e',
        data: comparedCampaigns.map(c => c.sentCount),
      },
      {
        label: 'Total',
        backgroundColor: '#3b82f6',
        data: comparedCampaigns.map(c => c.totalCount),
      },
    ],
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Campaign History
      </Typography>

      <Grid container spacing={3}>
        {campaigns.map(campaign => (
          <Grid item xs={12} md={6} key={campaign._id}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{campaign.name}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleCompare(campaign._id)}
                  sx={{
                    bgcolor: selectedIds.includes(campaign._id) ? '#ef4444' : '#0ea5e9',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: selectedIds.includes(campaign._id) ? '#dc2626' : '#0284c7'
                    }
                  }}
                >
                  {selectedIds.includes(campaign._id) ? 'Remove' : 'Compare'}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {campaign.message}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Status:</strong>{' '}
                <span style={{ color: campaign.status === 'sent' ? '#16a34a' : '#f59e0b' }}>
                  {campaign.status}
                </span>
              </Typography>

              <Typography variant="body2">
                <strong>Sent:</strong> {campaign.sentCount} / {campaign.totalCount}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Created At:</strong> {new Date(campaign.createdAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Logs:
              </Typography>
              <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>
                {campaign.logs.map(log => (
                  <Box
                    key={log._id}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: '#f1f5f9',
                      fontSize: 14
                    }}
                  >
                    Customer ID: <code>{log.customer}</code> —
                    <strong
                      style={{
                        marginLeft: 8,
                        color: log.status === 'sent' ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {log.status}
                    </strong>
                    {log.error && (
                      <span style={{ color: '#ef4444', marginLeft: 8 }}>
                        (Error: {log.error})
                      </span>
                    )}
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedIds.length > 0 && (
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            Campaign Comparison
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
            <Bar data={chartData} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}

// import { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Button, 
//   TextField, 
//   Typography, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel, 
//   Paper 
// } from '@mui/material';
// import { getSegments, createCampaign } from '../utils/api';

// const CampaignForm = ({ onSuccess }) => {
//   const [name, setName] = useState('');
//   const [message, setMessage] = useState('');
//   const [segment, setSegment] = useState('');
//   const [segments, setSegments] = useState([]);

//   useEffect(() => {
//     const fetchSegments = async () => {
//       try {
//         const response = await getSegments();
//         setSegments(response.data);
//       } catch (err) {
//         console.error('Failed to fetch segments:', err);
//       }
//     };
//     fetchSegments();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createCampaign({ name, message, segment });
//       onSuccess();
//     } catch (err) {
//       console.error('Failed to create campaign:', err);
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Create Campaign
//       </Typography>
      
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Campaign Name"
//           fullWidth
//           margin="normal"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
        
//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Segment</InputLabel>
//           <Select
//             value={segment}
//             onChange={(e) => setSegment(e.target.value)}
//             label="Segment"
//           >
//             {segments.map((seg) => (
//               <MenuItem key={seg._id} value={seg._id}>
//                 {seg.name} ({seg.customerCount} customers)
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
        
//         <TextField
//           label="Message"
//           fullWidth
//           margin="normal"
//           multiline
//           rows={4}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           required
//         />
        
//         <Box sx={{ mt: 2 }}>
//           <Button type="submit" variant="contained" color="primary">
//             Create Campaign
//           </Button>
//         </Box>
//       </form>
//     </Paper>
//   );
// };

// export default CampaignForm;


import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { getSegments, createCampaign } from '../utils/api';
import {generateMessageWithAI} from '../utils/ai'

const CampaignForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [segment, setSegment] = useState('');
  const [segments, setSegments] = useState([]);

  // Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await getSegments();
        setSegments(response.data);
      } catch (err) {
        console.error('Failed to fetch segments:', err);
      }
    };
    fetchSegments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCampaign({ name, message, segment });
      onSuccess();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    try {
      setLoading(true);
      const res = await generateMessageWithAI( aiPrompt );
      // setMessage(res.data.message); // assuming response contains message field
      setMessage(res);
      setAiModalOpen(false);
      setAiPrompt('');
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Campaign
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Campaign Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Segment</InputLabel>
          <Select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            label="Segment"
          >
            {segments.map((seg) => (
              <MenuItem key={seg._id} value={seg._id}>
                {seg.name} ({seg.customerCount} customers)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Message
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setAiModalOpen(true)}
            sx={{ mt: 2 }}
          >
            Generate with AI
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='use ${user} to represt user so we can change it from username'
          required
        />

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Create Campaign
          </Button>
        </Box>
      </form>

      {/* AI Prompt Modal */}
      <Dialog open={aiModalOpen} onClose={() => setAiModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Generate Message with AI</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter prompt"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiModalOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerateAI} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CampaignForm;

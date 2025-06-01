

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper
} from '@mui/material';
import { previewSegment } from '../utils/api';

const fieldOptions = [
  { value: 'city', label: 'City' },
  { value: 'country', label: 'Country' },
  { value: 'age', label: 'Age' },
  { value: 'gender', label: 'Gender' },
  { value: 'orders.amount', label: 'Order Amount' }
];

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  // { value: 'contains', label: 'Contains' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' }
];

const logicOptions = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' }
];

const SegmentBuilder = ({ onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }]);
  const [logics, setLogics] = useState([]); // logic between rules
  const [preview, setPreview] = useState(null);

  const handleAddRule = () => {
    setRules([...rules, { field: '', operator: '', value: '' }]);
    if (rules.length >= 1) {
      setLogics([...logics, 'AND']); // Default logic between new rule and previous one
    }
  };

  const handleRemoveRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);

    if (index > 0) {
      // Remove the logic before this rule
      const newLogics = [...logics];
      newLogics.splice(index - 1, 1);
      setLogics(newLogics);
    } else if (logics.length > 0) {
      // Remove the first logic if first rule is removed
      const newLogics = [...logics];
      newLogics.splice(0, 1);
      setLogics(newLogics);
    }
  };

  const handleRuleChange = (index, field, value) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const handleLogicChange = (index, value) => {
    const newLogics = [...logics];
    newLogics[index] = value;
    setLogics(newLogics);
  };

  const handlePreview = async () => {
    try {
      const payload = {
        rules,
        logic: logics // Send per-rule logic array
      };
      console.log(logics)
      const response = await previewSegment(payload);
      setPreview(response.data);
    } catch (err) {
      console.error('Preview failed:', err);
    }
  };

  const handleSave = () => {
    onSave({ name, description, rules, logic: logics });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Segment
      </Typography>

      <TextField
        label="Segment Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Rules
      </Typography>

      {rules.map((rule, index) => (
        <Box key={index}>
          {index > 0 && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Logic between Rule {index} and {index + 1}</InputLabel>
              <Select
                value={logics[index - 1]}
                label={`Logic between Rule ${index} and ${index + 1}`}
                onChange={(e) => handleLogicChange(index - 1, e.target.value)}
              >
                {logicOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Field</InputLabel>
                <Select
                  value={rule.field}
                  onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                  label="Field"
                >
                  {fieldOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={rule.operator}
                  onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                  label="Operator"
                >
                  {operatorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Value"
                fullWidth
                value={rule.value}
                onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveRule(index)}
                disabled={rules.length <= 1}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleAddRule}>
          Add Rule
        </Button>
        <Button variant="contained" onClick={handlePreview}>
          Preview
        </Button>
      </Box>

      {preview && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">
            Preview: {preview.count} customers match these rules
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!name || rules.some(r => !r.field || !r.operator || !r.value)}
        >
          Save Segment
        </Button>
      </Box>
    </Paper>
  );
};

export default SegmentBuilder;

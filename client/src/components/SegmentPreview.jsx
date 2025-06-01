

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
import { getSegments, deleteSegment, getSegmentCustomers } from '../utils/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SegmentPreview = ({ segments: initialSegments }) => {
  const [segments, setSegments] = useState([]);
  const [expandedSegmentId, setExpandedSegmentId] = useState(null);
  const [segmentCustomers, setSegmentCustomers] = useState({});

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = initialSegments?.length
          ? { data: initialSegments }
          : await getSegments();

        const sorted = [...response.data].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSegments(sorted);
      } catch (err) {
        console.error('Failed to fetch segments:', err);
      }
    };

    fetchSegments();
  }, [initialSegments]);

  const handleDelete = async (id) => {
    try {
      await deleteSegment(id);
      setSegments(segments.filter(segment => segment._id !== id));
      setSegmentCustomers(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete segment:', err);
    }
  };

  const toggleSegment = async (id) => {
    if (expandedSegmentId === id) {
      setExpandedSegmentId(null);
      return;
    }

    setExpandedSegmentId(id);

    if (!segmentCustomers[id]) {
      try {
        const response = await getSegmentCustomers(id);
        setSegmentCustomers(prev => ({
          ...prev,
          [id]: response.data
        }));
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      }
    }
  };

  const renderCustomerFields = (customer) => (
    <>
      <TableRow key={customer._id}>
        <TableCell>{customer.name}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.phone || '-'}</TableCell>
        <TableCell>{customer.address || '-'}</TableCell>
        <TableCell>{customer.city || '-'}</TableCell>
        <TableCell>{customer.country || '-'}</TableCell>
        <TableCell>{customer.age || '-'}</TableCell>
        <TableCell>{customer.gender || '-'}</TableCell>
        <TableCell>{customer.orders?.length || 0}</TableCell>
      </TableRow>
      {customer.orders?.map((order, index) => (
        <TableRow key={index}>
          <TableCell colSpan={9} sx={{ pl: 6, fontSize: '0.85rem', color: 'gray' }}>
            📦 <strong>Order:</strong> {order.orderId} — ₹{order.amount} — {new Date(order.date).toLocaleDateString()}<br/>
            🛒 <strong>Products:</strong> {order.products.join(', ')}
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Segments
      </Typography>
      
      {segments.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No segments created yet. Create your first segment using the builder.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Customer Count</TableCell>
                <TableCell>Rules</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {segments.map((segment) => (
                <>
                  <TableRow 
                    key={segment._id}
                    hover
                    onClick={() => toggleSegment(segment._id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                        {segment.name}
                    </TableCell>
                    <TableCell>{segment.description || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={segment.customerCount} 
                        color="primary" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {segment.rules.map((rule, i) => (
                        <Typography key={i} variant="body2" fontWeight="bold">
                          {i !== 0 && <span style={{ marginRight: 4 }}>{segment.logic[i-1] || 'AND'}</span>}
                          {rule.field} {rule.operator} {String(rule.value)}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(segment._id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedSegmentId === segment._id && segmentCustomers[segment._id] && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ backgroundColor: '#f9f9f9' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Customers in this Segment
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Phone</TableCell>
                              <TableCell>Address</TableCell>
                              <TableCell>City</TableCell>
                              <TableCell>Country</TableCell>
                              <TableCell>Age</TableCell>
                              <TableCell>Gender</TableCell>
                              <TableCell>Orders</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentCustomers[segment._id].map(renderCustomerFields)}
                          </TableBody>
                        </Table>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Total Customers: <strong>{segmentCustomers[segment._id].length}</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SegmentPreview;


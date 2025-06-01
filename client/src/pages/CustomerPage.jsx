
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Button
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { getCustomers, addCustomer } from '../utils/api';
import { useState, useEffect } from 'react';
import CustomerForm from '../components/CustomerForm';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (customerData) => {
    try {
      const response = await addCustomer(customerData);
      setCustomers([...customers, response.data]);
      setOpenForm(false);
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
    setSortConfig({ key, direction: isAsc ? 'desc' : 'asc' });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    const { key, direction } = sortConfig;
    const aVal = key === 'orders' ? (a.orders?.length || 0) : (a[key] || '');
    const bVal = key === 'orders' ? (b.orders?.length || 0) : (b[key] || '');
    
    if (typeof aVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const filteredCustomers = sortedCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Add Customer
        </Button>
      </Box>

      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          placeholder="Search customers..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <Search sx={{ color: 'action.active', mr: 1 }} />
            ),
          }}
        />
      </Box>

      <CustomerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddCustomer}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['name', 'email', 'phone', 'city', 'orders'].map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || '-'}</TableCell>
                <TableCell>{customer.city || '-'}</TableCell>
                <TableCell>{customer.orders?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerPage;



import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton
} from '@mui/material';
import { useState } from 'react';
import { Add, Delete } from '@mui/icons-material';

const CustomerForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    age: '',
    gender: '',
    orders: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderChange = (index, e) => {
    const { name, value } = e.target;
    const newOrders = [...formData.orders];
    newOrders[index][name] = name === 'amount' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, orders: newOrders }));
  };

  const addOrder = () => {
    setFormData(prev => ({
      ...prev,
      orders: [...prev.orders, { orderId: '', amount: '', date: '', products: [] }]
    }));
  };

  const removeOrder = (index) => {
    const newOrders = [...formData.orders];
    newOrders.splice(index, 1);
    setFormData(prev => ({ ...prev, orders: newOrders }));
  };

  const handleProductChange = (orderIndex, e) => {
    const productList = e.target.value.split(',').map(p => p.trim());
    const newOrders = [...formData.orders];
    newOrders[orderIndex].products = productList;
    setFormData(prev => ({ ...prev, orders: newOrders }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      age: '',
      gender: '',
      orders: []
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Basic Fields */}
            {['name', 'email', 'phone', 'age', 'address', 'city', 'country', 'gender'].map((field, idx) => (
              <Grid item xs={12} sm={field === 'address' ? 12 : 6} key={idx}>
                <TextField
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={field === 'age' ? 'number' : 'text'}
                  fullWidth
                  margin="normal"
                  value={formData[field]}
                  onChange={handleChange}
                  required={field === 'name' || field === 'email'}
                  select={field === 'gender'}
                  SelectProps={field === 'gender' ? { native: true } : undefined}
                >
                  {field === 'gender' && (
                    <>
                      <option value=""></option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </>
                  )}
                </TextField>
              </Grid>
            ))}

            {/* Orders Section */}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={addOrder} startIcon={<Add />}>
                Add Order
              </Button>
            </Grid>

            {formData.orders.map((order, index) => (
              <Grid container spacing={2} key={index} style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Order ID"
                    name="orderId"
                    value={order.orderId}
                    onChange={(e) => handleOrderChange(index, e)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={order.amount}
                    onChange={(e) => handleOrderChange(index, e)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={order.date}
                    onChange={(e) => handleOrderChange(index, e)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Products (comma-separated)"
                    name="products"
                    value={order.products.join(', ')}
                    onChange={(e) => handleProductChange(index, e)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => removeOrder(index)} color="error">
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerForm;

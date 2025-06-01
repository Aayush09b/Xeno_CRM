const Customer = require('../models/Customer');

// Add a new customer
exports.addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add customer' });
  }
};

// Add multiple customers
exports.addCustomers = async (req, res) => {
  try {
    const customers = await Customer.insertMany(req.body);
    res.status(201).json(customers);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add customers' });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

// Add order to customer
exports.addOrder = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.orders.push(req.body);
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add order' });
  }
};
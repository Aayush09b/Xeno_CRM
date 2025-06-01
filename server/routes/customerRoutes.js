const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');

// router.post('/', auth, customerController.addCustomer);
// router.post('/batch', customerController.addCustomers);
// router.get('/', auth, customerController.getCustomers);
// router.post('/:id/orders', auth, customerController.addOrder);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Add a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, customerController.addCustomer);


/**
 * @swagger
 * /api/customers/batch:
 *   post:
 *     summary: Add multiple customers (batch import)
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 country:
 *                   type: string
 *                 age:
 *                   type: number
 *                 gender:
 *                   type: string
 *     responses:
 *       201:
 *         description: Customers added successfully
 *       400:
 *         description: Invalid input
 */
router.post('/batch', customerController.addCustomers);


/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, customerController.getCustomers);

/**
 * @swagger
 * /api/customers/{id}/orders:
 *   post:
 *     summary: Add a new order to a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *               - date
 *             properties:
 *               orderId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Order added to customer
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/orders', auth, customerController.addOrder);


module.exports = router;
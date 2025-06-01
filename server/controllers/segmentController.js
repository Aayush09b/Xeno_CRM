

const Segment = require('../models/Segment');
const Customer = require('../models/Customer');

// Create a segment
exports.createSegment = async (req, res) => {
  try {
    const segment = new Segment({ ...req.body, user: req.user.id });
    await segment.save();

    const customers = await this.evaluateSegment(segment.rules, segment.logic);
    segment.customerCount = customers.length;
    await segment.save();

    res.status(201).json(segment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create segment' });
  }
};



// Get all segments for a user
exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.find({ user: req.user.id });
    res.json(segments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch segments' });
  }
};

// Get segment by ID
exports.getSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch segment' });
  }
};

// // 🔁 Updated evaluateSegment with logic support
// exports.evaluateSegment = async (rules = [], logic = []) => {
//   if (!Array.isArray(rules) || rules.length === 0) {
//     throw new Error('Rules must be a non-empty array');
//   }

//   const buildCondition = (rule) => {
//     let condition = {};
//     switch (rule.operator) {
//       case 'equals':
//         condition[rule.field] = rule.value;
//         break;
//       case 'contains':
//         condition[rule.field] = { $regex: rule.value, $options: 'i' };
//         break;
//       case 'greaterThan':
//         condition[rule.field] = { $gt: rule.value };
//         break;
//       case 'lessThan':
//         condition[rule.field] = { $lt: rule.value };
//         break;
//       default:
//         throw new Error(`Unsupported operator: ${rule.operator}`);
//     }
//     return condition;
//   };
//   let queryTree = buildCondition(rules[0]);

//   for (let i = 1; i < rules.length; i++) {
//     const logicOp = logic[i - 1] || 'AND'; // logic[0] applies between rules[0] and rules[1]
//     const nextCondition = buildCondition(rules[i]);

//     if (logicOp === 'AND') {
//       queryTree = { $and: [queryTree, nextCondition] };
//     } else if (logicOp === 'OR') {
//       queryTree = { $or: [queryTree, nextCondition] };
//     } else {
//       throw new Error(`Unsupported logic operator: ${logicOp}`);
//     }
//   }

 

//   try {
//     return await Customer.find(queryTree);
//   } catch (err) {
//     console.error('MongoDB query failed:', err);
//     throw new Error('Failed to fetch customers based on rules');
//   }
// };
exports.evaluateSegment = async (rules = [], logic = []) => {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error('Rules must be a non-empty array');
  }

  // Known field types (non-nested only)
  const stringFields = ['city', 'country', 'gender'];
  const numberFields = ['age'];
  const nestedFields = {
    'order amount': 'orders.amount',
  };

  const escapeRegex = (str) =>
    String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const buildCondition = (rule) => {
    const field = nestedFields[rule.field.toLowerCase()] || rule.field.toLowerCase();
    const isStringField = stringFields.includes(field);
    const isNumberField = numberFields.includes(field) || field === 'orders.amount';

    if (!isStringField && !isNumberField) {
      throw new Error(`Unsupported field: ${field}`);
    }

    let condition = {};

    switch (rule.operator) {
      case 'equals':
        if (isStringField) {
          condition[field] = {
            $regex: `^${escapeRegex(rule.value)}$`,
            $options: 'i',
          };
        } else if (isNumberField) {
          const val = Number(rule.value);
          if (isNaN(val)) throw new Error(`'equals' value must be a number for field ${field}`);
          condition[field] = val;
        }
        break;

      case 'contains':
        if (!isStringField) {
          throw new Error(`'contains' operator is only valid for string fields`);
        }
        condition[field] = {
          $regex: escapeRegex(rule.value),
          $options: 'i',
        };
        break;

      case 'greaterThan':
        if (!isNumberField) throw new Error(`'greaterThan' only valid for numeric fields`);
        if (isNaN(Number(rule.value))) throw new Error(`Invalid number: ${rule.value}`);
        condition[field] = { $gt: Number(rule.value) };
        break;

      case 'lessThan':
        if (!isNumberField) throw new Error(`'lessThan' only valid for numeric fields`);
        if (isNaN(Number(rule.value))) throw new Error(`Invalid number: ${rule.value}`);
        condition[field] = { $lt: Number(rule.value) };
        break;

      default:
        throw new Error(`Unsupported operator: ${rule.operator}`);
    }

    return condition;
  };

  // Combine all conditions using logic chain
  let queryTree = buildCondition(rules[0]);

  for (let i = 1; i < rules.length; i++) {
    const logicOp = logic[i - 1] || 'AND';
    const nextCondition = buildCondition(rules[i]);

    if (logicOp === 'AND') {
      queryTree = { $and: [queryTree, nextCondition] };
    } else if (logicOp === 'OR') {
      queryTree = { $or: [queryTree, nextCondition] };
    } else {
      throw new Error(`Unsupported logic operator: ${logicOp}`);
    }
  }

  try {
    return await Customer.find(queryTree);
  } catch (err) {
    console.error('MongoDB query failed:', err);
    throw new Error('Failed to fetch customers based on rules');
  }
};



// Preview segment (get matching customers)
exports.previewSegment = async (req, res) => {
  try {
    const { rules = [], logic = [] } = req.body;
    const customers = await this.evaluateSegment(rules, logic);
    res.json({ count: customers.length, customers });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to preview segment' });
  }
};



// Delete segment
exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json({ message: 'Segment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete segment' });
  }
};


exports.getSegmentCustomers = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    const customers = await this.evaluateSegment(segment.rules, segment.logic);
    res.json(customers);
  } catch (err) {
    console.error('Failed to fetch segment customers:', err);
    res.status(500).json({ message: 'Failed to fetch segment customers' });
  }
};


import prisma from '../../config/db.js';

// @desc    Get all medicines (Inventory)
// @route   GET /api/medicines
// @access  Private (Admin only)
export const getMedicines = async (req, res, next) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(medicines);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new medicine
// @route   POST /api/medicines
// @access  Private (Admin only)
export const addMedicine = async (req, res, next) => {
  try {
    const { name, category, stockQuantity, unitPrice, description } = req.body;

    const existingMedicine = await prisma.medicine.findUnique({
      where: { name }
    });

    if (existingMedicine) {
      res.status(400);
      throw new Error('Medicine already exists');
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        category,
        stockQuantity: Number(stockQuantity),
        unitPrice: Number(unitPrice),
        description
      }
    });

    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine stock
// @route   PUT /api/medicines/:id
// @access  Private (Admin only)
export const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockQuantity, unitPrice } = req.body;

    const medicine = await prisma.medicine.update({
      where: { id },
      data: {
        ...(stockQuantity !== undefined && { stockQuantity: Number(stockQuantity) }),
        ...(unitPrice !== undefined && { unitPrice: Number(unitPrice) })
      }
    });

    res.json(medicine);
  } catch (error) {
    next(error);
  }
};

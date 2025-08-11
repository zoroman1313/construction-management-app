import { Schema, model, models } from 'mongoose'

const ExpenseSchema = new Schema(
  {
    userId: { type: String, required: true },
    projectId: { type: String, default: null },
    category: {
      type: String,
      enum: [
        'InitialVisit',
        'Fuel',
        'Food',
        'Material',
        'Transport',
        'Labor',
        'Management',
        'Misc',
      ],
      required: true,
    },
    vendor: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'GBP' },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'BankTransfer', 'Unknown'],
      default: 'Unknown',
    },
    bank: { type: String, default: null },
    vat: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    items: [{ name: String, qty: Number, unit_price: Number, total: Number }],
    expenseAt: { type: Date, required: true },
    receiptImageUrl: { type: String, default: '' },
    rawText: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

export default models.Expense || model('Expense', ExpenseSchema)



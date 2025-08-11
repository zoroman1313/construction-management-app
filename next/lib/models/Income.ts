import { Schema, model, models } from 'mongoose'

const IncomeSchema = new Schema(
  {
    userId: { type: String, required: true },
    projectId: { type: String, default: null },
    payerName: { type: String, required: true },
    method: { type: String, enum: ['Cash', 'BankTransfer'], required: true },
    bank: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'GBP' },
    accountTarget: { type: String, default: '' },
    receivedAt: { type: Date, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

export default models.Income || model('Income', IncomeSchema)



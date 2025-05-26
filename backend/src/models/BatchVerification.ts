import mongoose, { Schema, Document } from "mongoose";

export interface IBatchVerification extends Document {
  accounts: Array<{
    accountNumber: string;
    bankCode: string;
    status: string;
    data?: any;
    error?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BatchVerificationSchema = new Schema(
  {
    accounts: [
      {
        accountNumber: { type: String, required: true },
        bankCode: { type: String, required: true },
        status: { type: String, required: true },
        data: { type: Schema.Types.Mixed },
        error: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const BatchVerification = mongoose.model<IBatchVerification>(
  "BatchVerification",
  BatchVerificationSchema
);

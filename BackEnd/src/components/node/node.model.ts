import { Schema, model, Document } from 'mongoose';

export interface INode extends Document {
  prev: Schema.Types.ObjectId | null;
  next: Schema.Types.ObjectId | null;
}

const NodeSchema = new Schema<INode>({
  prev: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Node',
  },
  next: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Node',
  },
});

NodeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

const NodeModel = model<INode>('Node', NodeSchema);

export default NodeModel;

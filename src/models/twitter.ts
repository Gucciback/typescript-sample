import * as mongoose from'mongoose';
const Schema = mongoose.Schema;

const TwitterSchema = new Schema({
    message_id: { type: String, required: true },
});

export default mongoose.model('Twitter', TwitterSchema);
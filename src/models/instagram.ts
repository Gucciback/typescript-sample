import * as mongoose from'mongoose';
const Schema = mongoose.Schema;

const InstagramSchema = new Schema({
    message_id: { type: String, required: true },
});

export default mongoose.model('Instagram', InstagramSchema);
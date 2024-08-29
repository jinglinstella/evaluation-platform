import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise=global.Promise;

const topicSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;


// await Topic.create({ title, description });
// const topics = await Topic.find();
// await Topic.findByIdAndDelete(id);

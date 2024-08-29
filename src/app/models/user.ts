import mongoose, { Schema, models } from "mongoose";

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise=global.Promise;

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  const User = models.User || mongoose.model("User", userSchema);

export default User;


// await Topic.create({ title, description });
// const topics = await Topic.find();
// await Topic.findByIdAndDelete(id);

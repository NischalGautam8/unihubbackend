import mongoose from "mongoose";
const refreshtoken = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Types.ObjectId,
  },
});

const refreshTokenModel = mongoose.model("refreshtoken", refreshtoken);
export default refreshTokenModel;

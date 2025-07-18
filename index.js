const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  phone: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

app.get("/auth/:identifier", async (req, res) => {
  const { identifier } = req.params;

  try {
    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });

    if (user) {
      return res.json({ success: true, message: "Authenticated user ✅" });
    } else {
      return res.status(404).json({ success: false, message: "User not found ❌" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

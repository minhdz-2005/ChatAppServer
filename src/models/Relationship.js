import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Loại mối quan hệ hiện tại
  type: {
    type: String,
    enum: ["friend", "pending", "blocked", "none"],
    default: "none",
    required: true,
  },

  // Nếu là pending, lưu người gửi yêu cầu
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Nếu là block, lưu người block
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🔹 Index để đảm bảo chỉ có 1 document giữa mỗi cặp user
relationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

// 🔹 Middleware: cập nhật `updatedAt` mỗi khi save
relationshipSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// 🔹 Middleware: tự sắp xếp user1 < user2 để tránh trùng ngược chiều
relationshipSchema.pre("validate", function (next) {
  if (this.user1 && this.user2 && this.user1.toString() > this.user2.toString()) {
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

const Relationship = mongoose.model("Relationship", relationshipSchema);
export default Relationship;

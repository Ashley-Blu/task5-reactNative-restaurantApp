import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import adminAnalyticsRoutes from "./routes/admin.analytics.routes";
import authRoutes from "./routes/auth.routes";
import paymentRoutes from "./routes/payment.routes";
import passwordRoutes from "./routes/password.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Backend running successfully");
});

// Routes/API Endpoints
app.use("/menu", menuRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes)
app.use("/admin/analytics", adminAnalyticsRoutes);
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/password", passwordRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

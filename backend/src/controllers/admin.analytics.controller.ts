import { Request, Response } from "express";
import { pool } from "../db";

export const getTodayAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_price), 0) AS total_revenue
      FROM orders
      WHERE status IN ('paid', 'delivered')
        AND DATE(created_at) = CURRENT_DATE
      `
    );

    res.json({
      totalOrders: Number(result.rows[0].total_orders),
      totalRevenue: Number(result.rows[0].total_revenue),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

// Daily revenue analytics
export const getDailyRevenue = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        DATE(created_at) AS day,
        COUNT(*) AS orders,
        SUM(total_price) AS revenue
      FROM orders
      WHERE status IN ('paid', 'delivered')
      GROUP BY day
      ORDER BY day ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load daily revenue" });
  }
};

// Revenue by date range
export const getRevenueByRange = async (
  req: Request,
  res: Response
) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      message: "from and to dates are required",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        DATE(created_at) AS day,
        COUNT(*) AS orders,
        SUM(total_price) AS revenue
      FROM orders
      WHERE status IN ('paid', 'delivered')
        AND DATE(created_at) BETWEEN $1 AND $2
      GROUP BY day
      ORDER BY day ASC
      `,
      [from, to]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};



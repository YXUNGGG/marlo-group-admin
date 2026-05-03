import { CustomerAggregateArgs, CustomerFindManyArgs, ProductFindManyArgs } from "@/generated/prisma/models";
import { prisma } from "./prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { MONTH } from "./constants";
import { auth } from "./auth/auth";

// user \\
export const getUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

// dashboard \\
export const getRevenue = async () => {
  const weekTime = new Date();
  weekTime.setDate(weekTime.getDate() - 7);

  const totalRevenueArgs = {
    _sum: { total_revenue: true }
  } satisfies CustomerAggregateArgs<DefaultArgs>;

  const weekRevenueArgs = {
    where: {
      created_at: {
        gte: weekTime
      }
    },
    _sum: { total_revenue: true }
  } satisfies CustomerAggregateArgs<DefaultArgs>;

  const [
    {
      _sum: { total_revenue }
    },
    {
      _sum: { total_revenue: week_revenue }
    }
  ] = await Promise.all([
    prisma.customer.aggregate(totalRevenueArgs),
    prisma.customer.aggregate(weekRevenueArgs)
  ]);

  return {
    totalRevenue: total_revenue,
    weekRevenue: week_revenue
  };
};

export const getRecentOrders = async () => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);

  const recentOrders = await prisma.order.findMany({
    where: { created_at: { gte: twoMonthsAgo } },
    select: {
      created_at: true,
      product: { select: { price: true } }
    }
  });

  const ordersPerMonth = recentOrders.filter(({ created_at }) => created_at.getTime() > Date.now() - MONTH);
  const percentDifference = Math.round((recentOrders.length / ordersPerMonth.length) * 100);

  return { recentOrders, ordersPerMonth, percentDifference };
};

export const getTopPositions = async () => {
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 2);

  const topCustomersArgs = {
    orderBy: { total_revenue: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      total_revenue: true
    }
  } satisfies CustomerFindManyArgs<DefaultArgs>;

  const topProductsArgs = {
    orderBy: { orders: { _count: "desc" } },
    take: 4,
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { created_at: { gte: fourMonthsAgo } },
        select: { created_at: true }
      }
    }
  } satisfies ProductFindManyArgs;

  const [topCustomers, topProducts] = await Promise.all([
    prisma.customer.findMany(topCustomersArgs),
    prisma.product.findMany(topProductsArgs)
  ]);

  return { topCustomers, topProducts };
};

// users \\
export const getUsers = async () => {
  const users = await prisma.user.findMany();

  return { users, usersCount: users.length };
};

// orders \\

export const getCreateOrderData = async () => {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true
    }
  });

  return { customers, products };
};

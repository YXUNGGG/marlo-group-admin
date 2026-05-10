import { prisma } from "./prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { MONTH } from "./constants";
import { auth } from "./auth/auth";
import { CardParamsType } from "../components/ui/.custom/card-filters";
import { Prisma } from "@prisma/client";

// [user] \\
export const getUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

// dashboard \\
export const getRevenue = async () => {
  const weekTime = new Date();
  weekTime.setDate(weekTime.getDate() - 7);

  const [
    {
      _sum: { total_revenue }
    },
    weekOrders
  ] = await Promise.all([
    prisma.customer.aggregate({
      _sum: { total_revenue: true }
    }),
    prisma.order.findMany({
      where: {
        created_at: {
          gte: weekTime
        }
      },
      include: {
        product: true
      }
    })
  ]);

  const week_revenue = weekOrders.reduce((acc, { product }) => (acc += product.price), 0);

  return {
    totalRevenue: total_revenue,
    weekRevenue: week_revenue ?? 0
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
  } satisfies Prisma.CustomerFindManyArgs<DefaultArgs>;

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
  } satisfies Prisma.ProductFindManyArgs;

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
      title: true,
      price: true
    }
  });

  return { customers, products };
};

export const getOrderById = async (id: string) => {
  return await prisma.order.findFirstOrThrow({
    where: { id },
    include: {
      customer: { select: { name: true } },
      product: { select: { price: true } }
    }
  });
};

export const getOrders = async () => {
  return await prisma.order.findMany({
    include: {
      customer: { select: { name: true } },
      product: { select: { price: true } }
    }
  });
};

// customers \\
export const getCustomers = async (params?: CardParamsType) => {
  const order = params?.sort?.split("=");
  const orderBy = order && ({ [order[0]]: order[1] } as Prisma.CustomerOrderByWithRelationInput);

  return await prisma.customer.findMany({
    orderBy: orderBy,
    where: { name: { contains: params?.query, mode: "insensitive" } }
  });
};

export const getCustomerById = async (id: string) => {
  return await prisma.customer.findFirstOrThrow({
    where: { id },
    include: {
      orders: {
        include: {
          customer: { select: { name: true } },
          product: { select: { price: true } }
        }
      }
    }
  });
};

// content \\
export const getProducts = async (params?: CardParamsType) => {
  const order = params?.sort?.split("=");
  const orderBy = order && ({ [order[0]]: order[1] } as Prisma.CustomerOrderByWithRelationInput);

  return await prisma.product.findMany({
    orderBy: orderBy,
    where: { title: { contains: params?.query, mode: "insensitive" } }
  });
};

export const getProductByTitle = async (title: string) => {
  return await prisma.product.findFirstOrThrow({ where: { title } });
};

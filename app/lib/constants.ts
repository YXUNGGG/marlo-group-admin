/**
 * month in milliseconds
 */
export const MONTH = 1000 * 60 * 60 * 24 * 30;

/**
 * week in milliseconds
 */
export const WEEK = 1000 * 60 * 60 * 24 * 7;

import { GaugeIcon, HeadsetIcon, MessageCircleMoreIcon, Package2Icon, UsersRoundIcon } from "lucide-react";

export type CategoryType = "Управление" | "Главная";

export type PagesType = {
  category: CategoryType;
  name: string;
  icon: any;
  href: string;
}[];

export const PAGES: PagesType = [
  { category: "Главная" as CategoryType, name: "Дашборд", icon: GaugeIcon, href: "/dashboard" },
  { category: "Главная" as CategoryType, name: "Заказы", icon: MessageCircleMoreIcon, href: "/orders" },
  { category: "Главная" as CategoryType, name: "Клиенты", icon: UsersRoundIcon, href: "/customers" },
  { category: "Управление" as CategoryType, name: "Контент", icon: Package2Icon, href: "/content" },
  { category: "Управление" as CategoryType, name: "Пользователи", icon: HeadsetIcon, href: "/users" }
];

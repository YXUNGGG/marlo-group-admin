import "dotenv/config";
import { OrderStatus, PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const productTitles = [
  "Поло Марло Груп (Мерч)",
  "Организация Киберспортивного турнира (Valorant)",
  "Футболка Марло Груп (Мерч)",
  "Организация Киберспортивного турнира (Dota2)",
  "Носки Марло Груп (Мерч)",
  "Худи Марло Груп (Мерч)",
  "Продвижение в музыке",
  "Организация Хакатона на IT тематику",
  "Организация Киберспортивного турнира (CS2)",
  "Продвижение в медиа"
];

const customerNames = [
  "Иванов Иван Иванович",
  "Ромашка",
  "Кузнецов Дмитрий Сергеевич",
  "ТехноПром Лтд",
  "Смирнов Алексей Дмитриевич",
  "АльфаГрупп",
  "БетаСтрой Лтд",
  "Соколов Максим Андреевич",
  "ГаммаТорг",
  "Попов Евгений Николаевич",
  "ОмегаСервис Лтд",
  "ВегаЛогистик",
  "Лебедев Владимир Алексеевич",
  "ДельтаСофт",
  "Козлов Павел Максимович",
  "ЗетаМедиа Лтд",
  "Новиков Сергей Евгеньевич",
  "СигмаИнвест",
  "Морозов Андрей Павлович",
  "Ромашка Лтд"
];

const customerMails = [
  "example@mail.ru",
  "myself@mail.ru",
  "placeholder@mail.ru",
  "example@yandex.ru",
  "myself@yandex.ru",
  "placeholder@yandex.ru",
  "example@google.com",
  "myself@google.com",
  "placeholder@google.com"
];

const statuses = [OrderStatus.Создан, OrderStatus.В_работе, OrderStatus.Выполнен, OrderStatus.Проблема];

async function seed() {
  await prisma.user.create({
    data: {
      login: "marlo_admin",
      name: "Sergey",
      role: "editor"
    }
  });

  const productData = productTitles.map((title, i) => ({
    title,
    price: Math.floor(getRandomInt(3000, 10000) / 50) * 50,
    quantity: getRandomInt(1, 4) > 1 ? getRandomInt(4, 150) : null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 2))
  }));

  const customerData = customerNames.map((name, i) => ({
    name,
    note: getRandomInt(1, 5) > 2 ? "Это заметка о клиенте" : null,
    total_revenue: Math.floor(getRandomInt(10000, 49000) / 50) * 50,
    orders_quantity: getRandomInt(4, 15),
    email: customerMails[getRandomInt(0, customerMails.length - 1)],
    phone_number: getRandomInt(1, 5) > 2 ? "+7(123)456-78-90" : null,
    telegram_username: "@AronSrg",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 3))
  }));

  await prisma.product.createMany({ data: productData });
  await prisma.customer.createMany({ data: customerData });

  const ordersData = async (): Promise<Prisma.OrderCreateManyInput[]> => {
    const orders = [];

    for (let i = 0; i < 20; i++) {
      const product = await prisma.product.findFirst({ skip: i % 10 });
      const customer = await prisma.customer.findFirst({ skip: i });

      orders.push({
        note: getRandomInt(1, 5) > 2 ? "Это заметка о заказе" : null,
        status: statuses[getRandomInt(0, statuses.length)],
        customer_id: customer!.id,
        product_title: product!.title,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 23 * (i * getRandomInt(0, 6)))
      });
    }

    return orders;
  };

  await prisma.order.createMany({ data: await ordersData() });
}

seed()
  .then(() => console.log("Seeding database was successful"))
  .catch(console.error);

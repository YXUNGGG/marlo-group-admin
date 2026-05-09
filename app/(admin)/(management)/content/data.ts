import { HandshakeIcon, MilestoneIcon, RocketIcon, ScrollTextIcon, TrophyIcon } from "lucide-react";

type IconType = typeof HandshakeIcon;

type PublicationTypeType = "tournament" | "hackathon" | "info" | "collaboration" | "launch";

export type PublicationType = {
  href: string;
  title: string;
  provider: "ВКонтакте" | "Телеграм";
  date: Date;
  icon: IconType;
};

const publicationIcons: Record<PublicationTypeType, IconType> = {
  collaboration: HandshakeIcon,
  hackathon: MilestoneIcon,
  info: ScrollTextIcon,
  tournament: TrophyIcon,
  launch: RocketIcon
};

export const PublicationData: PublicationType[] = [
  {
    href: "https://vk.com/wall-234686078_12",
    title: "Анонс хакатона по разработке игр",
    provider: "ВКонтакте",
    icon: publicationIcons.hackathon,
    date: new Date("12/30/2025")
  },
  {
    href: "https://vk.com/wall-234686078_11",
    title: "Открытие Minecraft-сервера",
    provider: "ВКонтакте",
    icon: publicationIcons.launch,
    date: new Date("12/29/2025")
  },
  {
    href: "https://vk.com/wall-234686078_9",
    title: "Старт сотрудничества с 7angelinka",
    provider: "ВКонтакте",
    icon: publicationIcons.collaboration,
    date: new Date("12/28/2025")
  },
  {
    href: "https://vk.com/wall-234686078_7",
    title: "Анонс нового направления: гейминг",
    provider: "ВКонтакте",
    icon: publicationIcons.launch,
    date: new Date("12/25/2025")
  },
  {
    href: "https://vk.com/wall-234686078_4",
    title: "Cотрудничество с «В точке роста»",
    provider: "ВКонтакте",
    icon: publicationIcons.collaboration,
    date: new Date("12/23/2025")
  },
  {
    href: "https://vk.com/wall-234686078_13",
    title: "Поздравление с Новым Годом",
    provider: "ВКонтакте",
    icon: publicationIcons.info,
    date: new Date("12/31/2025")
  },
  {
    href: "https://vk.com/wall-234686078_14",
    title: "Завершение хакатона",
    provider: "ВКонтакте",
    icon: publicationIcons.hackathon,
    date: new Date("01/25/2026")
  },
  {
    href: "https://t.me/MarloGroup/98",
    title: "Розыгрыш совместно с Auralith",
    provider: "Телеграм",
    icon: publicationIcons.collaboration,
    date: new Date("05/05/2026")
  },
  {
    href: "https://t.me/MarloGroup/97",
    title: "Новости о турнире по Dota 2",
    provider: "Телеграм",
    icon: publicationIcons.info,
    date: new Date("04/26/2026")
  },
  {
    href: "https://t.me/MarloGroup/94",
    title: "Запуск турнира по Dota 2",
    provider: "Телеграм",
    icon: publicationIcons.tournament,
    date: new Date("04/19/2026")
  },
  {
    href: "https://t.me/MarloGroup/93",
    title: "Запуск нового направления",
    provider: "Телеграм",
    icon: publicationIcons.launch,
    date: new Date("04/19/2026")
  }
];

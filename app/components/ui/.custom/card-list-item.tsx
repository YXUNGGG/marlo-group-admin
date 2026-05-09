"use client";

import { useRouter } from "next/navigation";

type CardListItemProps = {
  href: string;
  title: string;
  description: React.ReactNode;
  action: { title: string; value: number };
};

export function CardListItem({ description, href, title, action }: CardListItemProps) {
  const { replace } = useRouter();

  const getShortName = (name: string) => {
    const wordArr = name.split(" ", 2);
    if (wordArr.length === 1) return wordArr[0][0] + wordArr[0][1];
    return wordArr.map(word => word[0]).join("");
  };

  return (
    <div
      onClick={() => replace(href)}
      className="px-6 py-4 flex justify-between items-center rounded-2xl bg-muted hover:bg-muted/70 duration-150 cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="size-12 flex justify-center items-center border border-border rounded-xl text-lg font-medium">
          {getShortName(title)}
        </div>

        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <div className="flex gap-2 text-muted-foreground">{description}</div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-muted-foreground">{action.title}</p>
        <p className="font-semibold">₽{action.value}</p>
      </div>
    </div>
  );
}

import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, MessageCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type BugCardType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
  framework?: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "SOLVED" | "CLOSED";
  views: number;
  createdAt: Date;
  images?: string[];
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    reputation: number;
  };
  _count?: {
    solutions: number;
    comments: number;
    votes: number;
  };
};

const BugCard = ({ bug }: { bug: BugCardType }) => {
  const {
    title,
    slug,
    description,
    language,
    framework,
    severity,
    status,
    views,
    createdAt,
    images,
    author,
    _count,
  } = bug;

  const severityColors = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  };

  const statusColors = {
    OPEN: "bg-green-100 text-green-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    SOLVED: "bg-purple-100 text-purple-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <div className="flex gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              severityColors[severity]
            )}
          >
            {severity}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              statusColors[status]
            )}
          >
            {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
            {status === "SOLVED" && <CheckCircle2 className="inline ml-1 size-3" />}
          </span>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4 text-primary" />
            <span>{views}</span>
          </div>
          {_count && (
            <div className="flex items-center gap-1">
              <MessageCircle className="size-4 text-primary" />
              <span>{_count.solutions + _count.comments}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author.id}`}>
            <p className="text-16-medium line-clamp-1">
              {author.name} (@{author.username})
            </p>
          </Link>
          <Link href={`/bug/${slug}`}>
            <h3 className="text-26-semibold line-clamp-1 mt-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author.id}`}>
          <Image
            src={author.image || "/default-avatar.png"}
            alt={author.name || "User"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/bug/${slug}`}>
        <p className="startup-card_desc">{description}</p>

        {images && images.length > 0 && (
          <img
            src={images[0]}
            alt="Bug screenshot"
            className="startup-card_img"
          />
        )}

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="category-tag">{language}</span>
          {framework && (
            <span className="category-tag bg-secondary">{framework}</span>
          )}
        </div>
      </Link>

      <div className="flex-between gap-3 mt-5">
        <p className="text-14-normal text-black-300">
          {formatDate(createdAt.toString())}
        </p>
        <Button className="startup-card_btn" asChild>
          <Link href={`/bug/${slug}`}>
            {status === "SOLVED" ? "View Solution" : "Help Solve"}
          </Link>
        </Button>
      </div>
    </li>
  );
};

export const BugCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default BugCard;

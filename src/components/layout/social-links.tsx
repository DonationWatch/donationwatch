import { Bluesky } from "@/components/icons/Bluesky";
import { Github } from "@/components/icons/Github";
import { Twitter } from "@/components/icons/Twitter";
import { BSKY_URL, GITHUB_URL, TWITTER_URL } from "@/utils/config";

export function SocialLinks({ className = "" }: { className?: string }) {
  const defaultClass = "flex items-center self-center sm:justify-center";
  const combinedClass = className
    ? `${defaultClass} ${className}`
    : defaultClass;

  const links = [
    { href: BSKY_URL, title: "Bluesky", icon: Bluesky },
    { href: TWITTER_URL, title: "Twitter", icon: Twitter },
    { href: GITHUB_URL, title: "GitHub", icon: Github },
  ];

  return (
    <div className={combinedClass}>
      {links.map(({ href, title, icon: Icon }) => (
        <a
          key={title}
          className="hover:text-primary-800 dark:hover:text-primary-400 inline-block p-2 text-gray-500"
          target="_blank"
          title={title}
          href={href}
          rel="noreferrer"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

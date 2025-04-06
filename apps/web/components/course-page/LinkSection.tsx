"use client";

import { ResourceLink } from "../../app/dashboard/courses/[courseid]/page";
import {
  ExternalLink,
  FileText,
  Book,
  Code,
  Youtube,
  Database,
  Globe,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkSectionProps {
  links?: ResourceLink[];
}

export default function LinkSection({ links }: LinkSectionProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const getLinkDetails = (type?: string, url?: string) => {
    // Default style
    let icon = <ExternalLink className="h-5 w-5 mr-2" />;
    let bgClass =
      "bg-gradient-to-r from-blue-600/15 to-blue-800/15 hover:from-blue-600/25 hover:to-blue-800/25";
    let iconClass = "text-blue-600";

    const urlLower = url?.toLowerCase() || "";
    let detectedType = type?.toLowerCase() || "";

    if (!detectedType) {
      if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
        detectedType = "youtube";
      } else if (urlLower.includes("github.com")) {
        detectedType = "code";
      } else if (
        urlLower.includes("docs.") ||
        urlLower.includes("documentation")
      ) {
        detectedType = "documentation";
      } else if (
        urlLower.includes("medium.com") ||
        urlLower.includes("blog.")
      ) {
        detectedType = "article";
      } else if (urlLower.includes("stackoverflow.com")) {
        detectedType = "forum";
      }
    }

    switch (detectedType) {
      case "documentation":
        icon = <FileText className={cn("h-5 w-5 mr-2", "text-amber-600")} />;
        bgClass =
          "bg-gradient-to-r from-amber-600/15 to-amber-700/15 hover:from-amber-600/25 hover:to-amber-700/25";
        iconClass = "text-amber-600";
        break;
      case "article":
        icon = <BookOpen className={cn("h-5 w-5 mr-2", "text-emerald-600")} />;
        bgClass =
          "bg-gradient-to-r from-emerald-600/15 to-emerald-700/15 hover:from-emerald-600/25 hover:to-emerald-700/25";
        iconClass = "text-emerald-600";
        break;
      case "code":
        icon = <Code className={cn("h-5 w-5 mr-2", "text-violet-600")} />;
        bgClass =
          "bg-gradient-to-r from-violet-600/15 to-violet-700/15 hover:from-violet-600/25 hover:to-violet-700/25";
        iconClass = "text-violet-600";
        break;
      case "youtube":
        icon = <Youtube className={cn("h-5 w-5 mr-2", "text-red-600")} />;
        bgClass =
          "bg-gradient-to-r from-red-600/15 to-red-700/15 hover:from-red-600/25 hover:to-red-700/25";
        iconClass = "text-red-600";
        break;
      case "database":
        icon = <Database className={cn("h-5 w-5 mr-2", "text-cyan-600")} />;
        bgClass =
          "bg-gradient-to-r from-cyan-600/15 to-cyan-700/15 hover:from-cyan-600/25 hover:to-cyan-700/25";
        iconClass = "text-cyan-600";
        break;
      case "website":
        icon = <Globe className={cn("h-5 w-5 mr-2", "text-indigo-600")} />;
        bgClass =
          "bg-gradient-to-r from-indigo-600/15 to-indigo-700/15 hover:from-indigo-600/25 hover:to-indigo-700/25";
        iconClass = "text-indigo-600";
        break;
      case "book":
        icon = <Book className={cn("h-5 w-5 mr-2", "text-pink-600")} />;
        bgClass =
          "bg-gradient-to-r from-pink-600/15 to-pink-700/15 hover:from-pink-600/25 hover:to-pink-700/25";
        iconClass = "text-pink-600";
        break;
      case "forum":
        icon = (
          <ExternalLink className={cn("h-5 w-5 mr-2", "text-orange-600")} />
        );
        bgClass =
          "bg-gradient-to-r from-orange-600/15 to-orange-700/15 hover:from-orange-600/25 hover:to-orange-700/25";
        iconClass = "text-orange-600";
        break;
    }

    return { icon, bgClass, iconClass };
  };

  return (
    <div className="mt-8 animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <ExternalLink className="h-5 w-5 mr-2 text-primary" />
        Additional Resources
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, index) => {
          const { icon, bgClass, iconClass } = getLinkDetails(
            link.type,
            link.url
          );

          return (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "h-auto py-3 px-4 flex justify-start text-left",
                "border border-border/40 rounded-lg transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-lg",
                bgClass
              )}
              onClick={() => window.open(link.url, "_blank")}
            >
              <div className="flex items-center mr-2">{icon}</div>
              <div className="flex flex-col items-start overflow-hidden">
                <span
                  className={cn(
                    "text-sm font-medium truncate w-full",
                    iconClass
                  )}
                >
                  {link.title}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {new URL(link.url).hostname.replace("www.", "")}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

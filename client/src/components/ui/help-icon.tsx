import { HelpCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { getHelpContent } from "@/lib/help-content";

interface HelpIconProps {
  helpKey: string;
  className?: string;
}

export function HelpIcon({ helpKey, className = "" }: HelpIconProps) {
  const helpContent = getHelpContent(helpKey);

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={`text-slate-400 hover:text-slate-600 transition-colors ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{helpContent.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {helpContent.description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
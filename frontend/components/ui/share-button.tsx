"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface ShareButtonProps
  extends Omit<ButtonProps, "onClick" | "children"> {
  /** Title passed to the Web Share API. */
  title: string;
  /** Optional body text; defaults to the title. */
  text?: string;
  /** Absolute or relative URL. Defaults to the current page. */
  url?: string;
  /** Visible label in the idle state. */
  label?: string;
  /** Visible label after a successful clipboard copy. */
  copiedLabel?: string;
}

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share button with a Web Share API fast path and a clipboard fallback.
 *
 * Cancelling the native share sheet is treated as a no-op; any other share
 * failure falls through to copying the link so the action still succeeds.
 */
export function ShareButton({
  title,
  text,
  url,
  label = "Share",
  copiedLabel = "Copied",
  ...buttonProps
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title, text: text ?? title, url: shareUrl });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        // Fall through to the clipboard path.
      }
    }

    const didCopy = await copyToClipboard(shareUrl);
    if (!didCopy) {
      toast.error("Could not copy the link. Please copy it from the address bar.");
      return;
    }

    setCopied(true);
    toast.success("Link copied to clipboard");
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={copied ? copiedLabel : label}
      {...buttonProps}
      onClick={() => void handleShare()}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </Button>
  );
}

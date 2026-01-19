import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Resource } from "@/types";

interface VideoPlayerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null;
}

export function VideoPlayerSheet({
  open,
  onOpenChange,
  resource,
}: VideoPlayerSheetProps) {
  const getVideoUrl = (resource: Resource | null): string => {
    if (!resource) return "";

    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
  };

  const handleDownload = () => {
    if (!resource) return;

    const videoUrl = getVideoUrl(resource);
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${resource.name}.mp4`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[1120px] w-[90vw] sm:!max-w-[1120px] p-6"
        style={{ maxWidth: "1120px" }}
      >
        <DialogHeader className="pb-4 pr-20">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">
                {resource.name}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {resource.description || "Sem descrição"}
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2 shrink-0 mr-16"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="w-full">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full h-full object-contain"
              autoPlay={false}
              preload="metadata"
            >
              <source src={getVideoUrl(resource)} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

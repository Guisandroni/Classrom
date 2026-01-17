import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	itemName?: string;
	onConfirm: () => void;
	isLoading?: boolean;
}

export function DeleteConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	itemName,
	onConfirm,
	isLoading,
}: DeleteConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-600" />
						<DialogTitle>{title}</DialogTitle>
					</div>
					<DialogDescription className="pt-2">
						{description}
						{itemName && (
							<div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-900 font-medium">
								{itemName}
							</div>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

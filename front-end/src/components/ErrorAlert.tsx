import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
	title?: string;
	message: string;
	onClose?: () => void;
}

export function ErrorAlert({
	title = "Erro",
	message,
	onClose,
}: ErrorAlertProps) {
	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-4">
			<div className="flex items-start">
				<div className="flex-shrink-0">
					<AlertCircle className="h-5 w-5 text-red-600" />
				</div>
				<div className="ml-3 flex-1">
					<h3 className="text-sm font-medium text-red-800">{title}</h3>
					<div className="mt-2 text-sm text-red-700">
						<p>{message}</p>
					</div>
				</div>
				{onClose && (
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-600 hover:bg-red-100"
								onClick={onClose}
							>
								<span className="sr-only">Fechar</span>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

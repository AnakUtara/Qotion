import { Trash } from "lucide-react";
import { Button } from "../shadcn-ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../shadcn-ui/dialog";
import type { MouseEvent, ReactNode } from "react";

type Props = {
	onConfirm: (e: MouseEvent<HTMLButtonElement>) => void;
	render?: ReactNode;
	customDescription?: string;
};

const ConfirmationDialog = ({
	onConfirm,
	render,
	customDescription = "This action cannot be undone.",
}: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{render ? render : <Button variant="outline">Open</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>{customDescription}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button variant={"destructive"} type="submit" onClick={onConfirm}>
						<Trash />
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationDialog;

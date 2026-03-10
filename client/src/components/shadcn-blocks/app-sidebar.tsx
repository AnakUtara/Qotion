import * as React from "react";

import { SearchForm } from "@/components/shadcn-blocks/search-form";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/shadcn-ui/sidebar";
import SidebarUserDisplay from "../sidebar/user-display";
// import sidebarNavData from "@/data/sidebar-nav.data";
import useAllNotesQuery from "@/hooks/queries/use-notes.query";
import { Link, useNavigate, useParams } from "react-router";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { Spinner } from "../shadcn-ui/spinner";
import ConfirmationDialog from "../dialogs/confirmation.dialog";
import useNoteMutation from "@/hooks/mutations/use-notes.mutation";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [searchTerm, setSearchTerm] = useState<string>("");

	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const { id } = useParams();

	const navigate = useNavigate();

	const { data, isLoading, error } = useAllNotesQuery(debouncedSearchTerm);

	const { erase } = useNoteMutation();

	const handleDeleteNote = async (noteId: number) => {
		try {
			await erase.mutateAsync(noteId);
			toast.success("Note deleted successfully!");
			// If the deleted note is currently open, navigate to the main notes page
			if (id === noteId.toString()) {
				navigate("/notes");
			}
		} catch (error) {
			console.error("Failed to delete note:", error);
			toast.error(
				error instanceof Error
					? error.message
					: error instanceof AxiosError && error.response?.data?.message
						? error.response.data.message
						: "Failed to delete note. Please try again.",
			);
		}
	};

	if (error) throw error;

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarUserDisplay />
				<SearchForm value={searchTerm} handleChange={handleSearchChange} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarSeparator />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/notes">
								<Plus /> New Note
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarSeparator />
				{isLoading ? (
					<Spinner />
				) : !error && data && data.length > 0 ? (
					<SidebarGroup>
						<SidebarGroupLabel>Your Notes</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{data.map((item) => (
									<SidebarMenuItem
										key={item.title}
										className="flex justify-between items-center"
									>
										<SidebarMenuButton
											asChild
											isActive={id === item.id.toString()}
										>
											<Link to={`/notes/${item.id}`}>{item.title}</Link>
										</SidebarMenuButton>
										<SidebarMenuAction
											showOnHover
											asChild
											className="cursor-pointer"
										>
											<ConfirmationDialog
												render={<Trash size={16} />}
												onConfirm={async () => await handleDeleteNote(item.id)}
											/>
										</SidebarMenuAction>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : null}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

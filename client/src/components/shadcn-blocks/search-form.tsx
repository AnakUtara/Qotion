import { Search } from "lucide-react";

import { Label } from "@/components/shadcn-ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/shadcn-ui/sidebar";

export function SearchForm({
	value,
	handleChange,
	...props
}: React.ComponentProps<"form"> & {
	value: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<form {...props}>
			<SidebarGroup className="py-0">
				<SidebarGroupContent className="relative">
					<Label htmlFor="search" className="sr-only">
						Search
					</Label>
					<SidebarInput
						id="search"
						placeholder="Search..."
						className="pl-8"
						value={value}
						onChange={handleChange}
					/>
					<Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}

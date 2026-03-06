import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "../shadcn-ui/field";
import { Input } from "../shadcn-ui/input";
import type { InputHTMLAttributes } from "react";

type TextFieldProps<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	control: Control<T>;
	placeholder?: string;
	description?: string;
	type?: InputHTMLAttributes<HTMLInputElement>["type"];
	disabled?: boolean;
};

const TextField = <T extends FieldValues>({
	name,
	label,
	control,
	placeholder = "",
	description = "",
	type = "text",
	disabled = false,
}: TextFieldProps<T>) => {
	return (
		<Controller
			{...{ name, control }}
			render={({ field, fieldState }) => {
				const { invalid, error } = fieldState;
				return (
					<Field data-invalid={invalid}>
						<FieldLabel htmlFor={name}>{label}</FieldLabel>
						<Input
							{...field}
							id={name}
							aria-invalid={invalid}
							{...{ placeholder, type, disabled }}
						/>

						{invalid && <FieldError errors={[error]} />}

						{description ? (
							<FieldDescription>{description}</FieldDescription>
						) : null}
					</Field>
				);
			}}
		/>
	);
};

export default TextField;

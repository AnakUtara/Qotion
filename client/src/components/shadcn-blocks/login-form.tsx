import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldSeparator,
} from "@/components/shadcn-ui/field";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import TextField from "../fields/text.field";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthSchema } from "@/validators/auth.validation";
import { NavLink, useNavigate } from "react-router";
import { Spinner } from "../shadcn-ui/spinner";
import { useAuth } from "@/hooks/auth/use-auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function LoginForm({ className, ...props }: ComponentProps<"form">) {
	const { signIn } = useAuth();
	const navigator = useNavigate();

	const { control, handleSubmit, formState, reset } = useForm<AuthSchema>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(authSchema),
	});

	const { isSubmitting } = formState;

	const submitHandler = async (data: AuthSchema) => {
		const { email, password } = data;
		try {
			await signIn(email, password);
			toast.success("Welcome! You have logged in successfully!");
			navigator("/dashboard");
		} catch (error) {
			toast.error(
				error instanceof AxiosError && error.response?.data?.message
					? error.response.data.message
					: "Login failed! Please check your credentials and try again.",
			);
		} finally {
			reset();
		}
	};

	return (
		<form
			className={cn("flex flex-col gap-6", className)}
			{...props}
			onSubmit={handleSubmit(submitHandler)}
		>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<TextField<AuthSchema>
					name="email"
					label="Email"
					control={control}
					placeholder="m@example.com"
					disabled={isSubmitting}
				/>
				<TextField<AuthSchema>
					name="password"
					label="Password"
					control={control}
					placeholder="Enter your password"
					type="password"
					disabled={isSubmitting}
				/>
				<Field>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? <Spinner /> : null}
						{isSubmitting ? "Logging in..." : "Login"}
					</Button>
				</Field>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<NavLink to={"/register"} className="underline underline-offset-4">
							Sign up
						</NavLink>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}

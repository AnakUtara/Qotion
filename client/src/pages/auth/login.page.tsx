import { LoginForm } from "@/components/shadcn-blocks/login-form";
import SEO from "@/components/seo/seo";

const LoginPage = () => {
	return (
		<>
			<SEO title="Login - Qotion" description="Login to your Qotion account" />

			<LoginForm />
		</>
	);
};

export default LoginPage;

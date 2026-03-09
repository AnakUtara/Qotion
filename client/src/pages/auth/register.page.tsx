import SEO from "@/components/seo/seo";
import { SignupForm } from "@/components/shadcn-blocks/signup-form";

const RegisterPage = () => {
	return (
		<>
			<SEO
				title="Register - Qotion"
				description="Create a new Qotion account"
			/>
			<SignupForm />
		</>
	);
};

export default RegisterPage;

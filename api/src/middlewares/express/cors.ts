import { CorsOptions } from "cors";
import { clientOrigin } from "../../config/env.config";

const corsOptions: CorsOptions = {
	origin: clientOrigin,
	credentials: true,
};

export default corsOptions;

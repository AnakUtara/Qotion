class AppError extends Error {
	status?: number;
	object?: unknown;
	constructor(message?: string, status?: number, object?: unknown) {
		super(message);
		this.status = status;
		this.object = object;
	}
}

export default AppError;

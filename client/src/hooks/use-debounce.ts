import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

// const useDebounceCallback = <T extends (...args: any[]) => void>(
//     callback: T,
//     deps: Parameters<typeof useEffect>[1],
//     delay: number,
// ) => {
//     const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback);

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedCallback(() => callback);
//         }, delay);
//         return () => {
//             clearTimeout(handler);
//         };
//     }, [...deps, delay]);

//     return debouncedCallback;
// };

// export { useDebounceCallback };
export default useDebounce;

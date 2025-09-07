import React from "react";

export function useDebounceCallback<TArgs extends unknown[], TReturn = void>(
	func: (...args: TArgs) => TReturn,
	delay: number
): (...args: TArgs) => void {
	const funcRef = React.useRef(func);
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	React.useEffect(() => {
		funcRef.current = func;
	}, [func]);

	return React.useCallback(
		(...args: TArgs) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				funcRef.current(...args);
			}, delay);
		},
		[delay]
	);
}

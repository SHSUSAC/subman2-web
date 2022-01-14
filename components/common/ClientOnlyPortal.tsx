import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ClientOnlyPortal({
	children,
	selector,
}: {
	children: React.ReactNode;
	selector: string;
}): JSX.Element | null {
	const ref = useRef<Element | null>(null);
	// const [mounted, setMounted] = useState(false);

	useEffect(() => {
		ref.current = document.querySelector(selector);
		// setMounted(true);
	}, [selector]);

	return ref.current !== null ? createPortal(children, ref.current) : null;
}

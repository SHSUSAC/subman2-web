import { useLog } from "../../components/common/LogProvider";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useAnalytics } from "reactfire";

export function useRouterLogging() {
	const router = useRouter();
	const log = useLog();
	// const analytics = useAnalytics();

	const handlerComplete = useCallback(
		(url: string, { shallow }: { shallow: boolean }) => {
			log.debug(`Router completed ${shallow ? "shallow" : "deep"} change to %s`, url);
			// logEvent(analytics, "page_view", {
			// 	page_location: url,
			// 	page_title: document?.title,
			// 	page_referer: "",
			// });
		},
		[log]
	);
	const handlerStart = useCallback(
		(url: string, { shallow }: { shallow: boolean }) => {
			log.debug(`Router starting ${shallow ? "shallow" : "deep"} change to %s`, url);
		},
		[log]
	);
	const handlerError = useCallback(
		(url: string, { shallow }: { shallow: boolean }) => {
			log.error(`Router errored during ${shallow ? "shallow" : "deep"} change to %s`, url);
		},
		[log]
	);

	useEffect(() => {
		router.events.on("routeChangeStart", handlerStart);
		router.events.on("routeChangeComplete", handlerComplete);
		router.events.on("routeChangeError", handlerError);

		return function () {
			router.events.off("routeChangeStart", handlerStart);
			router.events.off("routeChangeComplete", handlerComplete);
			router.events.off("routeChangeError", handlerError);
		};
	}, [router, log, handlerStart, handlerComplete, handlerError]);
}

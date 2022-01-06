import { ClaimsValidator, useAuth, useObservable, useSigninCheck, useUser } from "reactfire";
import Error from "../../pages/_error";
import { useLog } from "../../components/common/LogProvider";
import { user } from "rxfire/auth";
import { combineLatest, filter, from, map, mergeMap } from "rxjs";

export type roles = "EquipmentRole" | "CalenderRole" | "ChatRole" | "StorageRole" | "SystemRole";
type accessLevels = "Reader" | "Writer" | "Admin";

export function useAuthErrorPages(roleName: roles, minimum: accessLevels): JSX.Element | undefined {
	const signInCheck = usePermission(roleName, minimum);

	if (signInCheck?.data?.signedIn) {
		if (signInCheck.data.hasRequiredClaims) {
			return undefined;
		} else {
			return <Error statusCode={403} />;
		}
	} else {
		return <Error statusCode={401} />;
	}
}

export function usePermission(roleName: roles, minimum: accessLevels) {
	const log = useLog("PermissionGate");

	const permissionObserver = user(useAuth())
		.pipe(filter((x) => !!x))
		.pipe(
			mergeMap((user) =>
				from(
					// @ts-ignore
					user.getIdTokenResult()
				)
			)
		);

	const signInObserver = user(useAuth()).pipe(map((x) => x != null));

	const finalObserver = combineLatest([permissionObserver, signInObserver]).pipe(
		map((x) => {
			return {
				signedIn: x[1],
				hasRequiredClaims: claimsValidator(x[0].claims).hasRequiredClaims,
			};
		})
	);

	const claimsValidator: ClaimsValidator = (claims) => {
		const hasAdmin = claims?.[roleName] === "admin";
		const hasWriter = claims?.[roleName] === "writer";
		const hasReader = claims?.[roleName] === "reader";

		let hasPermission = false;

		if (minimum === "Admin") {
			hasPermission = hasAdmin;
		}
		if (minimum === "Writer") {
			hasPermission = hasAdmin || hasWriter;
		}
		if (minimum === "Reader") {
			hasPermission = hasAdmin || hasWriter || hasReader;
		}
		log.debug("Permission check for %s level on %s %s", minimum, roleName, hasPermission ? "passed" : "failed");
		return {
			hasRequiredClaims: hasPermission,
			errors: {},
		};
	};

	return useObservable<{
		signedIn: boolean;
		hasRequiredClaims: boolean;
	}>("CustomsPermissionsChecker-" + roleName, finalObserver);

	// // noinspection JSUnusedGlobalSymbols
	// const result = useSigninCheck({
	// 	forceRefresh: true,
	// 	validateCustomClaims: claimsValidator,
	// 	suspense: true,
	// });
	//
	// return {
	// 	hasRequiredClaims: result.data.hasRequiredClaims,
	// 	signedIn: result.data.signedIn,
	// };
}

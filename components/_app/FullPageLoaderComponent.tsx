import ThemeProvider from "../../lib/contexts/theme";
import { Favicons, Footer, ThemeModeController } from "../../pages/_app";
import SquaresLoader from "../common/SquaresLoader";
import { ReactNode } from "react";

export function FullPageWrapper({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<ThemeModeController>
				<Favicons />
				<div className="flex antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
					<div className="flex flex-col flex-1 min-h-screen overflow-x-hidden overflow-y-auto">
						<>
							<header className="relative flex-shrink-0 bg-white dark:bg-darker fixed top-0">
								<div className="flex items-center justify-between p-2 border-b dark:border-primary-darker">
									<p className="inline-block text-2xl font-bold tracking-wider uppercase text-primary-dark dark:text-light">
										SubMan2
									</p>
								</div>
							</header>
						</>
						<div className="flex flex-1 flex-col h-full p-4">
							<div className="flex flex-col flex-1 items-center justify-center">{children}</div>
						</div>
						<Footer />
					</div>
				</div>
			</ThemeModeController>
		</ThemeProvider>
	);
}

export default function FullPageLoaderComponent({ message }: { message: string }) {
	return (
		<FullPageWrapper>
			<>
				<SquaresLoader />
				<p className="text-center m-4">{message}</p>
			</>
		</FullPageWrapper>
	);
}

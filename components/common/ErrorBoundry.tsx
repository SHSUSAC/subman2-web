import React, { ErrorInfo } from "react";
import Error from "../../pages/_error";
import { ConstructLog, LogContext } from "./LogProvider";
import { FullPageWrapper } from "../_app/FullPageLoaderComponent";

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; generateRawShell?: boolean },
	{ error: Error | null; errorInfo: React.ErrorInfo | null }
> {
	constructor(props: { children: React.ReactNode; generateRawShell?: boolean }) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	static contextType = LogContext;

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const log = ConstructLog(this.context, "ErrorBoundary");
		log.error(
			{ error: error, componentStack: errorInfo.componentStack },
			"An error has been caught by this error boundary. %s",
			error.message
		);
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
		// You can also log error messages to an error reporting service here
	}

	render() {
		if (this.state.errorInfo) {
			if (this.props.generateRawShell) {
				return (
					<FullPageWrapper>
						<Error error={this.state.error ?? undefined} />
					</FullPageWrapper>
				);
			}

			// Error path
			return <Error error={this.state.error ?? undefined} />;
		}
		// Normally, just render children
		return this.props.children;
	}
}

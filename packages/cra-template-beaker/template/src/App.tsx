import React from "react";
import { ThemeProvider } from "@fluentui/react";
import { StoreProvider } from "easy-peasy";

import { store } from "./Store";
import { Shell } from "./Components";

export function App(): JSX.Element {
	return <StoreProvider store={store}>
		<ThemeProvider>
			<Shell />
		</ThemeProvider>
	</StoreProvider>;
}
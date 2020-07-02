import React from "react";
import { DefaultButton } from "@fluentui/react";

import { Blade, useBlade } from "./lib";

export function OtherBlade(): JSX.Element {

	const { showDialog } = useBlade();

	return <Blade title="Other Blade">
		<DefaultButton onClick={openDialog}>Open Dialog</DefaultButton>
	</Blade>

	function openDialog() {
		showDialog({
			title: "Title",
			message: "This is a dialog",
			buttons: [
				{ text: "Ok" },
				{ text: "Cancel" }
			]
		});
	}
}


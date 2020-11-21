import { HookRouter } from "hookrouter";

import { LoremPage } from "./Pages";


export const routes: HookRouter.RouteObject = {
	"/": _ => <LoremPage />
}
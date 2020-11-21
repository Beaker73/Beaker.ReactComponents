import { createStore, createTypedHooks, persist } from "easy-peasy";

export interface StoreModel {
}

const storeState: StoreModel = {
}

// https://easy-peasy.now.sh/docs/api/persist.html
export const store = createStore(persist(storeState));


// typed hooks
// https://easy-peasy.now.sh/docs/tutorials/typescript.html#typing-the-hooks
const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;


// support for hot-reloading
// https://easy-peasy.now.sh/docs/recipes/hot-reloading.html
if (process.env.NODE_ENV === "development") {
    if (module.hot) {
        module.hot.accept(".", () => {
            store.reconfigure(storeState);  // 👈 Here is the magic
        });
    }
}



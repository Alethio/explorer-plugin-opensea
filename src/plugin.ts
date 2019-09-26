import { IPlugin } from "plugin-api";
import { IPluginConfig } from "./IPluginConfig";
import { OpenSeaApi } from "./opensea/OpenSeaApi";
import { HttpRequest } from "@puzzl/browser/lib/network/HttpRequest";
import { OpenSeaAssetsAdapter } from "./OpenSeaAssetsAdapter";
import { assetsOverviewModule } from "./module/assetsOverviewModule";
import { OpenSeaCollectionsAdapter } from "./OpenSeaCollectionsAdapter";

const plugin: IPlugin = {
    init(config: IPluginConfig, api, logger, publicPath) {
        __webpack_public_path__ = publicPath;

        // Add module, page definitions and others here
        let openSeaApi = new OpenSeaApi(new HttpRequest(), {
            apiBaseUrl: config.apiBaseUrl,
            apiKey: config.apiKey
        });
        api.addDataAdapter("adapter://aleth.io/opensea/assets", new OpenSeaAssetsAdapter(openSeaApi));
        api.addDataAdapter("adapter://aleth.io/opensea/collections", new OpenSeaCollectionsAdapter(openSeaApi));
        api.addModuleDef("module://aleth.io/opensea/assets/overview", assetsOverviewModule(config));
    },

    getAvailableLocales() {
        return ["en-US", "zh-CN"];
    },

    async loadTranslations(locale: string) {
        return await import("./translation/" + locale + ".json");
    }
};

// tslint:disable-next-line:no-default-export
export default plugin;

export const manifest = __plugin_manifest__;

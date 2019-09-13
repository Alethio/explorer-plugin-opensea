import { IDataAdapter } from "plugin-api";
import { IOpenSeaAsset } from "./opensea/IOpenSeaAsset";
import { IAccountContext } from "./IAccountContext";
import { OpenSeaApi } from "./opensea/OpenSeaApi";

export class OpenSeaAssetsAdapter implements IDataAdapter<IAccountContext, IOpenSeaAsset[]> {
    contextType = {
        accountHash: "string"
    } as const;

    constructor(private openSeaApi: OpenSeaApi) {

    }

    async load(context: IAccountContext) {
        return (await this.openSeaApi.getAssets({
            owner: "0x" + context.accountHash.replace(/^0x/, "")
        })).assets;
    }
}

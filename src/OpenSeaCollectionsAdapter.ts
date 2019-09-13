import { IDataAdapter } from "plugin-api";
import { IAccountContext } from "./IAccountContext";
import { OpenSeaApi } from "./opensea/OpenSeaApi";
import { IOpenSeaCollection } from "./opensea/IOpenSeaCollection";

export class OpenSeaCollectionsAdapter implements IDataAdapter<IAccountContext, IOpenSeaCollection[]> {
    contextType = {
        accountHash: "string"
    } as const;

    constructor(private openSeaApi: OpenSeaApi) {

    }

    async load(context: IAccountContext) {
        return await this.openSeaApi.getCollections({
            asset_owner: "0x" + context.accountHash.replace(/^0x/, "")
        });
    }
}

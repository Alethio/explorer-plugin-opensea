import { IOpenSeaAssetContract } from "./IOpenSeaAssetContract";
import { IOpenSeaAssetCollection } from "./IOpenSeaAssetCollection";

export interface IOpenSeaAsset {
    token_id: string;
    image_url?: string;
    background_color: string;
    name: string;
    external_link: string;
    asset_contract: IOpenSeaAssetContract;
    collection: IOpenSeaAssetCollection;
}

import { HttpRequest } from "@puzzl/browser/lib/network/HttpRequest";
import { IOpenSeaAssetQuery } from "./IOpenSeaAssetQuery";
import { IOpenSeaAssetResponse } from "./IOpenSeaAssetResponse";
import { IOpenSeaCollectionQuery } from "./IOpenSeaCollectionQuery";
import { IOpenSeaCollection } from "./IOpenSeaCollection";

interface IOpenSeaApiConfig {
    apiBaseUrl: string;
    apiKey: string;
}

/**
 * OpenSea HTTP API wrapper. Replicates the functionality of the OpenSea.js SDK, but without the unneeded dependencies
 */
export class OpenSeaApi {
    constructor(private httpRequest: HttpRequest, private config: IOpenSeaApiConfig) {

    }

    async get<T>(apiPath: string, query: any) {
        return await this.httpRequest.fetchJson<T>(
            this.config.apiBaseUrl + apiPath + (query ? "?" + this.buildQueryString(query) : ""),
            {
                headers: {
                    "X-API-KEY": this.config.apiKey
                }
            }
        );
    }

    private buildQueryString(queryObj: any) {
        return Object.keys(queryObj).map(k => `${k}=${encodeURIComponent(queryObj[k])}`).join("&");
    }

    getAssets(query: IOpenSeaAssetQuery) {
        return this.get<IOpenSeaAssetResponse>("/api/v1/assets", query);
    }

    getCollections(query: IOpenSeaCollectionQuery) {
        return this.get<IOpenSeaCollection[]>("/api/v1/collections", query);
    }
}

import * as React from "react";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import { SpinnerRegular } from "@alethio/ui/lib/fx/SpinnerRegular";
import { IModuleDef } from "plugin-api";
import { IAccountContext } from "../IAccountContext";
import { IAssetsOverviewProps } from "./AssetsOverview";
import { IOpenSeaAsset } from "../opensea/IOpenSeaAsset";
import { IPluginConfig } from "../IPluginConfig";
import { IOpenSeaCollection } from "../opensea/IOpenSeaCollection";
import { LayoutRow } from "@alethio/ui/lib/layout/content/LayoutRow";
import { LayoutRowItem } from "@alethio/ui/lib/layout/content/LayoutRowItem";
import { Label } from "@alethio/ui/lib/data/Label";

export const assetsOverviewModule: (config: IPluginConfig) => IModuleDef<IAssetsOverviewProps, IAccountContext> =
({ assetUrlMask, accountUrlMask }) => ({
    contextType: {
        accountHash: "string"
    } as const,

    dataAdapters: [{
        ref: "adapter://aleth.io/opensea/assets",
        alias: "assets"
    }, {
        ref: "adapter://aleth.io/opensea/collections",
        alias: "collections"
    }],

    getContentComponent: async () => import("./AssetsOverview").then(({ AssetsOverview }) => AssetsOverview),

    getContentProps: ({ asyncData, context, translation, locale, logger }) => {
        let collections = asyncData.get("collections")!.data as IOpenSeaCollection[];

        let totalItems = collections.reduce((prev, v) => v.owned_asset_count + prev, 0);

        let props: IAssetsOverviewProps = {
            assets: asyncData.get("assets")!.data as IOpenSeaAsset[],
            assetUrlMask,
            accountUrlMask,
            accountHash: context.accountHash,
            totalItems,
            translation,
            locale,
            logger
        };
        return props;
    },

    getLoadingPlaceholder: ({ translation: tr }) => <LayoutRow>
        <LayoutRowItem>
            <Label>{tr.get("accordion.label")}</Label>
            <ValueBox>
                <SpinnerRegular />
            </ValueBox>
        </LayoutRowItem>
    </LayoutRow>
});

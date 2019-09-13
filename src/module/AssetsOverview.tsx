import * as React from "react";
import styled from "@alethio/ui/lib/styled-components";
import { IOpenSeaAsset } from "../opensea/IOpenSeaAsset";
import { ExternalLink } from "plugin-api/component/ExternalLink";
import { ITranslation, ILogger } from "plugin-api";
import { AccordionVertical } from "@alethio/ui/lib/control/accordion/AccordionVertical";
import { AccordionItem } from "@alethio/ui/lib/control/accordion/AccordionItem";
import { Expander } from "@alethio/ui/lib/control/expander/Expander";
import { LayoutRow } from "@alethio/ui/lib/layout/content/LayoutRow";
import { LayoutRowItem } from "@alethio/ui/lib/layout/content/LayoutRowItem";
import { Label } from "@alethio/ui/lib/data/Label";
import { IAccordionItemConfig } from "@alethio/ui/lib/control/accordion/IAccordionItemConfig";

const StyledExternalLink = styled(ExternalLink)`
    color: inherit;
`;

const AccordionContentWrapper = styled.div`
    margin-top: 16px;
`;

const CARD_WIDTH = 120;
const CARD_SPACING = 16;
const MAX_CARDS_PER_ROW = 5;

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: ${CARD_WIDTH * MAX_CARDS_PER_ROW + CARD_SPACING * MAX_CARDS_PER_ROW}px;
`;

const Card = styled.div`
    margin-right: ${CARD_SPACING}px;
    margin-bottom: ${CARD_SPACING}px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.04);
    &:hover {
        box-shadow: 0 4px 8px 5px rgba(0,0,0,0.04);
    }
    border-radius: 4px;
    background-color: ${props => props.theme.colors.base.bg.alt};
    width: ${CARD_WIDTH}px;
    height: 186px;
    flex-shrink: 0;
`;

const IMAGE_CONTAINER_PADDING = 4;

interface IImageContainerProps {
    backgroundColor?: string;
}

const ImageContainer = styled.div<IImageContainerProps>`
    padding: ${IMAGE_CONTAINER_PADDING}px;
    box-sizing: border-box;
    background-color: ${props => props.backgroundColor};
    width: ${CARD_WIDTH}px;
    height: ${CARD_WIDTH}px;
`;

const TextContainer = styled.div`
    border-top: 1px solid ${props => props.theme.colors.separator};
    padding: 8px;
    font-size: 12px;
    line-height: 14px;
`;

const Image = styled.img`
    width: 100%;
    max-height: 100%;
`;

const ContractIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 6px;
`;

const ContractContainer = styled.div`
    display: flex;
    margin-bottom: 4px;
`;

const ContractName = styled.span`
    max-width: ${CARD_WIDTH * 0.75}px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${props => props.theme.colors.link};
`;

const AssetName = styled.div`
    overflow: hidden;
    max-height: 28px;
`;

interface IItemConfig extends IAccordionItemConfig {
    value: number;
    label: string;
}

export interface IAssetsOverviewProps {
    assets: IOpenSeaAsset[];
    assetUrlMask: string;
    accountUrlMask: string;
    accountHash: string;
    totalItems: number;
    translation: ITranslation;
    locale: string;
    logger: ILogger;
}

export class AssetsOverview extends React.Component<IAssetsOverviewProps> {
    render() {
        let { locale, translation: tr, totalItems, logger } = this.props;

        return <AccordionVertical<IItemConfig>
            errorText=""
            label={tr.get("accordion.label")}
            loadingText=""
            noDataContent={<div />}
            onContentError={e => logger.error(e)}
            renderExpander={item =>
                <Expander label={item.config.label} value={item.config.value} locale={locale}
                    open={item.isOpen} onClick={item.onClick} disabled={!totalItems} />
            }
            renderContent={({ content }) => {
                return <AccordionContentWrapper><LayoutRow>
                    <LayoutRowItem autoHeight>
                        <Label></Label>
                        {content}
                    </LayoutRowItem>
                </LayoutRow></AccordionContentWrapper>;
            }}
        >
            <AccordionItem<IItemConfig> label={tr.get("accordionItem.label")} value={totalItems} content={async () => (
                <CardContainer>
                    { this.props.assets.slice(0, 10).map((asset, i) => this.renderAsset(asset, i)) }
                    { this.props.assets.length > 10 ?
                    <ExternalLink href={this.getExternalAccountUrl(this.props.accountHash)}>
                        { tr.get("viewAll.label") }
                    </ExternalLink>
                    : null }
                </CardContainer>
            )} />
        </AccordionVertical>;
    }

    private getExternalAssetUrl(asset: IOpenSeaAsset) {
        return this.props.assetUrlMask
            .replace("{contractAddress}", asset.asset_contract.address)
            .replace("{tokenId}", asset.token_id);
    }

    private getExternalAccountUrl(accountHash: string) {
        return this.props.accountUrlMask.replace("{accountAddress}", "0x" + accountHash.replace(/^0x/, ""));
    }

    private renderAsset(asset: IOpenSeaAsset, idx: number) {
        return <StyledExternalLink key={idx} href={this.getExternalAssetUrl(asset)}>
            <Card>
                <ImageContainer backgroundColor={asset.background_color ? "#" + asset.background_color : void 0}>
                    <Image src={asset.image_url} alt={asset.name} />
                </ImageContainer>
                <TextContainer>
                    <ContractContainer>
                        <ContractIcon src={asset.collection.image_url} alt={asset.collection.name} />
                        <ContractName>{ asset.collection.name}</ContractName>
                    </ContractContainer>
                    <AssetName>{ asset.name }</AssetName>
                </TextContainer>
            </Card>
        </StyledExternalLink>;
    }
}

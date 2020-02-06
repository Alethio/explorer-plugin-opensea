import * as React from "react";
import styled from "@alethio/ui/lib/styled-components";
import { IOpenSeaAsset } from "../opensea/IOpenSeaAsset";
import { ExternalLink } from "@alethio/ui/lib/control/ExternalLink";
import { ITranslation, ILogger } from "plugin-api";
import { AccordionVertical } from "@alethio/ui/lib/control/accordion/AccordionVertical";
import { AccordionItem } from "@alethio/ui/lib/control/accordion/AccordionItem";
import { Expander } from "@alethio/ui/lib/control/expander/Expander";
import { LayoutRow } from "@alethio/ui/lib/layout/content/LayoutRow";
import { LayoutRowItem } from "@alethio/ui/lib/layout/content/LayoutRowItem";
import { Label } from "@alethio/ui/lib/data/Label";
import { IAccordionItemConfig } from "@alethio/ui/lib/control/accordion/IAccordionItemConfig";
import openSeaLogo from "../assets/opensea-logo-flat-colored-blue.svg";
import placeholderImg from "../assets/placeholder.svg";

const StyledExternalLink = styled(ExternalLink)`
    color: inherit;
`;

const AccordionContentWrapper = styled.div`
    margin-top: 16px;
`;

const CARD_WIDTH = 200;
const CARD_SPACING = 16;
const MAX_CARDS_PER_ROW = 5;
const MAX_SHOWN_ITEMS = 10;

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
    height: ${CARD_WIDTH + 66}px;
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
    height: ${CARD_WIDTH}px;
    text-align: center;
`;

const TextContainer = styled.div`
    border-top: 1px solid ${props => props.theme.colors.separator};
    padding: 8px;
    font-size: 12px;
    line-height: 14px;
`;

const Image = styled.img`
    height: 100%;
    width: 100%;
    object-fit: contain;
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

const Separator = styled.div`
    border: 1px solid ${props => props.theme.colors.separator};
    width: 100%;
    height: 0;
    margin-right: ${CARD_SPACING}px;
    margin-bottom: 16px;
    margin-top: ${24 - CARD_SPACING}px;
`;

const OPENSEA_LOGO_SIZE = 25;

const ViewAll = styled.div`
    display: flex;
    font-size: 18px;

    & > a {
        font-size: 0; /* Prevents whitespaces from adding to the image height */
        margin-left: 8px;
        margin-right: 8px;
    }
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

        let preLink: string;
        let postLink: string;
        if (totalItems > MAX_SHOWN_ITEMS) {
            [preLink, postLink] = tr.get("viewMore.label")
                .replace("{count}", String(totalItems - MAX_SHOWN_ITEMS))
                .split("{openSeaLink}");
        } else {
            [preLink, postLink] = tr.get("view.label").split("{openSeaLink}");
        }

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
                return <AccordionContentWrapper><LayoutRow responsive={{ignoreFirstLabel: "forMobile"}}>
                    <LayoutRowItem autoHeight fullRow>
                        <Label></Label>
                        {content}
                    </LayoutRowItem>
                </LayoutRow></AccordionContentWrapper>;
            }}
        >
            <AccordionItem<IItemConfig> label={tr.get("accordionItem.label")} value={totalItems} content={async () => (
                <CardContainer>
                    { this.props.assets.slice(0, MAX_SHOWN_ITEMS).map((asset, i) => this.renderAsset(asset, i)) }
                    <Separator />
                    <ViewAll>
                        <span>{ preLink }</span>
                        <ExternalLink href={this.getExternalAccountUrl(this.props.accountHash)}>
                            <img alt="OpenSea" src={openSeaLogo}
                                width={83 / 25 * OPENSEA_LOGO_SIZE}
                                height={OPENSEA_LOGO_SIZE}
                            />
                        </ExternalLink>
                        <span>{ postLink }</span>
                    </ViewAll>
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
                    <Image src={asset.image_url || asset.collection.image_url || placeholderImg} alt={asset.name} />
                </ImageContainer>
                <TextContainer>
                    <ContractContainer>
                        { asset.collection.image_url ?
                        <ContractIcon src={asset.collection.image_url} alt={asset.collection.name} />
                        : null }
                        <ContractName>{ asset.collection.name}</ContractName>
                    </ContractContainer>
                    <AssetName>{ asset.name || (asset.collection.name + " #" + asset.token_id )}</AssetName>
                </TextContainer>
            </Card>
        </StyledExternalLink>;
    }
}

export interface IOpenSeaAssetQuery {
    owner?: string;
    asset_contract_address?: string;
    token_ids?: (number | string)[];
    search?: string;
    order_by?: string;
    order_direction?: string;
    limit?: number;
    offset?: number;
  }

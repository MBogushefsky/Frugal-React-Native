export default interface SearchProductFilter {
    keyword: string;
    stores: Store[];
    pageNum: number;
    sortBy: SortBy;
}

export enum Store {
    AMAZON = "AMAZON",
    EBAY = "EBAY",
    WALMART = "WALMART",
    GOOGLE_SHOPPING = "GOOGLE_SHOPPING"
}

export enum SortBy {
    RELEVANCE = "RELEVANCE",
    PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
    PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
    RATING_HIGH_TO_LOW = "RATING_HIGH_TO_LOW"
}
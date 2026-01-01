export interface IRegion {
    id: string;
    uniqId?: string;
    name: string;
    country?: string;
    season?: string;
    link?: string;
    updatedAt?: Date;
    children?: IRegionNode[];
}

export type IRegionNode = IRegion & {
  isOpen?: boolean;
};
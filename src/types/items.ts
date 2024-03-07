export type TarkovItem = {
    id: string;
    name: string;
    shortname: string;
    image: string;
};

export type TarkovItemWithQuantity = TarkovItem & {
    quantity: number;
};

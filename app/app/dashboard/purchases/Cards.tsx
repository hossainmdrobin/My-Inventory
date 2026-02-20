import { Product } from "@/types/product";

export function SearchCard({ name,costPrice }: Product) {
    return (
        <div className="flex p-2">
            <div>{name}</div>
            <div>Cost Price(BDT): {costPrice}</div>
            <div></div>
        </div>
    )
}


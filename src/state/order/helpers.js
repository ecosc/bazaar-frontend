import { getBazaarContract } from "hooks/useContracts";
import { AddressZero } from '@ethersproject/constants'
import { orderStates } from "utils/order";

export const DEFAULT_PAGE_SIZE = 10;

const parseOrders = (_orders) => {
    return _orders.map(o => ({
        id: o.id.toNumber(),
        seller: o.seller,
        buyer: o.buyer,
        createdAt: o.createdAt.toNumber(),
        deadline: o.deadline.toNumber(),
        state: o.state,
        sourceAsset: o.sourceAsset.toNumber(),
        targetAsset: o.targetAsset,
        sourceAmount: o.sourceAmount,
        targetAmount: o.targetAmount,
    }));
}

export const fetchOrdersList = async ({
    fromID = -1,
    maxLength = DEFAULT_PAGE_SIZE,
    buyer = AddressZero,
    seller = AddressZero,
    states = [orderStates.Placed],
    sourceAssets = [],
    fromDate = 0,
    toDate = 0,
    withExpireds = true
}) => {
    const bazaarContract = getBazaarContract();

    try {
        const orders = await bazaarContract.fetchOrders(
            fromID,
            maxLength,
            buyer,
            seller,
            states,
            sourceAssets,
            fromDate,
            toDate,
            withExpireds
        );

        return parseOrders(orders);
    } catch (e) {
        console.error(e);
        return null;
    }
}

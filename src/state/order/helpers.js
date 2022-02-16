import { getBazaarContract } from "hooks/useContracts";
import { AddressZero } from '@ethersproject/constants'
import { orderStates } from "utils/order";

const parseOrders = (_orders) => {
    return _orders.map(o => ({
        id: o.id.toNumber(),
        seller: o.seller,
        buyer: o.buyer,
        createdAt: o.createdAt.toNumber(),
        deadline: o.deadline.toNumber(),
        state: o.state,
        sourceAsset: o.sourceAsset,
        targetAsset: o.targetAsset,
        sourceAmount: o.sourceAmount,
        targetAmount: o.targetAmount,
    }));
}

export const fetchOrdersList = async ({
    fromID = 0,
    maxLength = 30,
    buyer = AddressZero,
    seller = AddressZero,
    states = [orderStates.Placed],
    fromDate = 0,
    toDate = 0
}) => {
    const bazaarContract = getBazaarContract();

    try {
        const orders = await bazaarContract.fetchOrders(
            fromID,
            maxLength,
            buyer,
            seller,
            states,
            fromDate,
            toDate
        );

        return parseOrders(orders);
    } catch (e) {
        console.error(e);
        return null;
    }
}

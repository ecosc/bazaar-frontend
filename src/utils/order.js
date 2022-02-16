import { t } from "i18next";

export const maxDeliveryTime = 8 * 60 * 60;

export const orderStates = {
    Placed: 0,
    Soled: 1,
    Finished: 2,
    Closed: 3,
    Withdrew: 4,
    CancelledBySeller: 5,
    CancelledByBuyer: 6
};

export const orderStateNames = {
    [orderStates.Placed]: 'Placed',
    [orderStates.Soled]: 'Soled',
    [orderStates.Finished]: 'Finished',
    [orderStates.Closed]: 'Closed',
    [orderStates.Withdrew]: 'Withdrew',
    [orderStates.Expired]: 'Expired',
    [orderStates.CancelledBySeller]: 'Cancelled By Seller',
    [orderStates.CancelledByBuyer]: 'Cancelled By Buyer'
};

export const orderStateInString = (state) => {
    return t(orderStateNames[state]);
}
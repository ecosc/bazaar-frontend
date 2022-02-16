import { t } from "i18next";

export const orderStates = {
    Placed: 0,
    Soled: 1,
    Conflict: 2,
    Finished: 3,
    Closed: 4,
    Withdrew: 5
};

export const orderStateNames = {
    [orderStates.Placed]: 'Placed',
    [orderStates.Soled]: 'Soled',
    [orderStates.Conflict]: 'Conflict',
    [orderStates.Finished]: 'Finished',
    [orderStates.Closed]: 'Closed',
    [orderStates.Withdrew]: 'Withdrew',
};

export const orderStateInString = (state) => {
    return t(orderStateNames[state]);
}
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from "state/order";
import useRefresh from "./useRefresh";

export const useFetchOrders = (initialAutoRefresh = true, filters = {}) => {
    const dispatch = useDispatch();
    const { slowRefresh } = useRefresh();
    const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);

    useEffect(() => {
        if (!autoRefresh) {
            return;
        }

        dispatch(fetchOrders(filters));
    }, [dispatch, slowRefresh, autoRefresh]);

    const refresh = () => {
        dispatch(fetchOrders(filters));
    }

    const toggleAutoRefresh = () => {
        setAutoRefresh(prev => !prev);
    }

    return { toggleAutoRefresh, setAutoRefresh, autoRefresh, refresh };
}

export const useOrders = () => {
    const { isLoading, orders } = useSelector((state) => state.order);

    return { isLoading, orders };
}
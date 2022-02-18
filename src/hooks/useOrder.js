import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, loadMoreOrders } from "state/order";
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

    const loadMore = () => {
        dispatch(loadMoreOrders(filters));
    }

    const toggleAutoRefresh = () => {
        setAutoRefresh(prev => !prev);
    }

    return { toggleAutoRefresh, setAutoRefresh, autoRefresh, refresh, loadMore };
}

export const useOrders = () => {
    const { isLoading, orders, lastID, isLoadingMore } = useSelector((state) => state.order);

    return { isLoading, orders, lastID, isLoadingMore };
}
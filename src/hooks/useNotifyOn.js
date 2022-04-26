import { useWeb3React } from "@web3-react/core";
import { notification } from "antd";
import { BAZAAR_ADDRESS } from "constants/addresses";
import { utils } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { notifySuccess } from "utils/notification";
import { useBazaarContract } from "./useContracts";

function baseFilter(method, account) {
  if (!account) return null;

  return {
    address: BAZAAR_ADDRESS,
    topics: [
      utils.id(method),
      null,
      hexZeroPad(account, 32)
    ]
  };
}

function useNotifyOn(filter, callback) {
  const { account } = useWeb3React();
  const bazaar = useBazaarContract();

  useEffect(() => {
    if (!account) {
      return;
    }

    bazaar.on(filter, callback);

    return () => bazaar.removeAllListeners(filter);
  }, [account]);
}

export function useNotifyOnOrderPlaced(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderPlaced(uint256,address)', account);

  useNotifyOn(filter, (orderID, seller) => {
    notifySuccess(
      t('New order placed'),
      t('A new order with id ({{id}}) placed for you just right now', { id: orderID })
    );

    callback && callback(orderID, seller);
  })
}

export function useNotifyOnOrderClosed(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderClosed(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Order closed'),
      t('order closed successfully')
    );

    callback && callback();
  })
}

export function useNotifyOnOrderCancelledBySeller(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderCancelledBuySeller(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Order cancelled'),
      t('order was cancelled successfully')
    );

    callback && callback();
  })
}

export function useNotifyOnOrderCancelledByBuyer(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderCancelledBuyBuyer(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Order cancelled'),
      t('order was cancelled successfully')
    );

    callback && callback();
  })
}

export function useNotifyOnOrderWithdrew(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderWithdrew(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Order withdrew'),
      t('order was withdrew successfully')
    );

    callback && callback();
  })
}

export function useNotifyOnOrderSold(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('OrderSold(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Order bought'),
      t('order was bought successfully')
    );

    callback && callback();
  })
}

export function useNotifyOnDeliveryApproved(callback = null) {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const filter = baseFilter('DeliveryApproved(uint256,address)', account);

  useNotifyOn(filter, () => {
    notifySuccess(
      t('Delivery approved'),
      t('delivery of order was approved successfully')
    );

    callback && callback();
  })
}

import { useDispatch, useSelector } from "react-redux";
import { openWalletConnectModal, closeWalletConnectModal } from "state/general";

export function useConnectWallet() {
    const { walletConnectVisible } = useSelector((state) => state.general);
    const dispatch = useDispatch();

    const openModal = () => {
        dispatch(openWalletConnectModal())
    }

    const closeModal = () => {
        dispatch(closeWalletConnectModal())
    }

    return { visible: walletConnectVisible, openModal, closeModal };
}

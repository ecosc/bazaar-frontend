import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from "state/profile";
import { getProfile } from "state/profile/helpers";

export const useFetchProfile = () => {
    const { account } = useWeb3React()
    const dispatch = useDispatch();

    useEffect(() => {
        if (account) {
            dispatch(fetchProfile(account))
        }
    }, [account, dispatch])
}

export const useProfile = () => {
    const { isLoading, data, hasRegistered } = useSelector((state) => state.profile);

    return { profile: data, hasProfile: !isLoading && hasRegistered, isLoading };
}

export const useGetProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    const getProfileInfo = async (address) => {
        setIsLoading(true);

        return getProfile(address).then(r => {
            setData(r);
            setIsLoading(false);
        })
    }


    return { profile: data, isLoading, getProfile: getProfileInfo };
}

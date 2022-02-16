import { getProfileContract } from "hooks/useContracts"

export const getProfile = async (address) => {
    const profileContract = getProfileContract();

    try {
        const hasRegistered = await profileContract.registered(address);
        if (!hasRegistered) {
            return null;
        }

        const profileResponse = await profileContract.accounts(address);

        return {
            name: profileResponse.name,
            contact: profileResponse.contact,
            state: profileResponse.state
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

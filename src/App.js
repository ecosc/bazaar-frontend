import Layout from './layout';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Bazaar from 'pages/Bazaar';
import Purchases from 'pages/Purchases';
import Sales from 'pages/Sales';
import useEagerConnect from 'hooks/useEagerConnect';
import Profile from 'pages/Profile';
import CreateProfile from 'pages/Profile/CreateProfile';
import { useFetchProfile, useProfile } from 'hooks/useProfile';
import EditProfile from 'pages/Profile/EditProfile';
import CreateOrder from 'pages/Sales/CreateOrder';
import Splash from 'components/Splash';
import { useWeb3React } from '@web3-react/core';

function App() {
  useEagerConnect();
  useFetchProfile();
  const { isLoading: isProfileLoading } = useProfile();
  const {account} = useWeb3React();

  return (
    <Layout>
      {isProfileLoading && account ? <Splash /> :
        <Routes>
          <Route path="/" element={<Bazaar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/create" element={<CreateProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/new" element={<CreateOrder />} />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      }
    </Layout>
  );
}

export default App;

import { Layout, Menu, Dropdown } from "antd";
import Icon from '@ant-design/icons';
import {
    GlobalOutlined,
    UserOutlined,
    UserAddOutlined,
    CaretDownOutlined,
    LogoutOutlined,
    ShopOutlined,
    AppstoreAddOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    SwapOutlined
} from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { changeLanguage } from '../localization';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { Wallet } from 'components/Svg/Icons';
import { useProfile } from "hooks/useProfile";
import { accountEllipsis } from "utils/transforms";
import logoURL from 'assets/images/logo.png';
import ConnectWalletButton from "components/ConnectWalletButton";

const StyledHeader = styled(Layout.Header)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  zIndex: 1;
  position: fixed;
  color: ${({ theme }) => theme.colors.headerText};
  height: 44px !important;
  padding: 32px 48px;

  & > ul {
    background: ${({ theme }) => theme.colors.headerBackground} !important;
    height: 44px !important;
    align-items: center !important;
  }

  & > ul > li > .ant-menu-title-content > a {
    color: ${({ theme }) => theme.colors.headerText};
  }

  & > ul > li {
    color: ${({ theme }) => theme.colors.headerText};
    height: 35px !important;
    display: flex !important;
    align-items: center !important;
    border-radius: 40px !important;
  }
`

const Logo = styled.img`
  display: inline-block;
  height: auto;
  ${({ theme }) => theme.dir == 'rtl' && `
    margin-left: 25px;
  `}

  ${({ theme }) => theme.dir == 'ltr' && `
    margin-right: 25px;
  `}
`;

const HeaderOptions = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.dir == 'rtl' && `
    left: 48px;
  `}

  ${({ theme }) => theme.dir == 'ltr' && `
    right: 48px;
  `}
`

const GlobIcon = styled(GlobalOutlined)`
  font-size: 1.2rem;
  margin: 1rem;
  cursor: pointer;
  outline: 7px solid ${({ theme }) => theme.colors.headerIconOutline};
  border-radius: 50%;
`

const LanguageMenuItem = styled(Menu.Item)`
    padding: 0.3rem 2rem;
`

const WalletIcon = styled(Wallet)`
    position: absolute;
    font-size: 1.2rem;
    cursor: pointer;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    border-style: solid;
    border-width: 2px;
    display: flex;
    padding: 2px;
    justify-content: center;
    position: absolute;
    left: 0;
    top: -4px;
    width: 40px;
    z-index: 102;
`;

const WalletIconWrapper = styled.div`
    align-items: center;
    background: ${({ theme }) => theme.colors.connectWalletBackground};
    border-radius: 16px;
    box-shadow: rgb(0 0 0 / 10%) 0px -2px 0px inset;
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    padding-left: 40px;
    padding-right: 8px;
    position: relative;
    font-weight: bold;
`;

const AccountEllipsis = styled.div`
    display: block;
    margin: 0 8px;
    color: white;
`;

function AppHeader() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { logout } = useAuth();
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const { hasProfile, profile, isLoading: isProfileLoading } = useProfile();

    const languageSelectMenu = () => (
        <Menu>
            {
                Object.entries(i18n.options.resources).map(([lang]) => (
                    <LanguageMenuItem key={lang} onClick={() => changeLanguage(lang)}>{t(lang)}</LanguageMenuItem>
                ))
            }
        </Menu>
    );

    const profileMenu = () => (
        <Menu>
            {!hasProfile &&
                <LanguageMenuItem
                    key="create_profile"
                    onClick={() => navigate('profile/create')}
                    icon={<UserAddOutlined />}
                    disabled={isProfileLoading}
                >
                    {t('Create Profile')}
                </LanguageMenuItem>
            }
            {hasProfile &&
                <LanguageMenuItem
                    key="profile"
                    onClick={() => navigate('profile')}
                    icon={<UserOutlined />}
                >
                    {t('Profile')}
                </LanguageMenuItem>
            }
            <LanguageMenuItem
                key="disconnect"
                onClick={logout}
                icon={<LogoutOutlined />}
            >
                {t('Disconnect')}
            </LanguageMenuItem>
        </Menu>
    );

    return (
        <StyledHeader>
            <Logo src={logoURL} />
            <Menu mode="horizontal" selectedKeys={[location.pathname]} style={{ width: '100%' }}>
                <Menu.Item key="/" icon={<ShopOutlined />}><Link to={'/'}>{t('Market')}</Link></Menu.Item>
                <Menu.Item
                    // disabled={!account || !profile}
                    key="/sales/new"
                    icon={<AppstoreAddOutlined />}
                >
                    <Link to={'/sales/new'}>{t('New Order')}</Link>
                </Menu.Item>
                {
                    (account && profile) &&
                    <Menu.Item
                        key="/sales"
                        icon={<ShoppingOutlined />}
                    >
                        <Link to={'/sales'}>{t('My Sales')}</Link>
                    </Menu.Item>

                }
                {
                    (account && profile) &&
                    <Menu.Item
                        key="/purchases"
                        icon={<ShoppingCartOutlined />}
                    >
                        <Link to={'/purchases'}>{t('My Purchases')}</Link>
                    </Menu.Item>
                }
                <Menu.Item
                    key="/swap"
                    icon={<SwapOutlined />}
                >
                    <a target="_blank" href={'https://defa.finance/swap'}>{t('Swap')}</a>
                </Menu.Item>
            </Menu>
            <HeaderOptions>
                <Dropdown overlay={languageSelectMenu} arrow placement="bottomCenter">
                    <GlobIcon />
                </Dropdown>
                {
                    account ?
                        <Dropdown overlay={profileMenu} arrow placement="bottomCenter" trigger={['click', 'hover']}>
                            <WalletIconWrapper>
                                <CaretDownOutlined style={{ color: 'white' }} />
                                <AccountEllipsis>{hasProfile ? profile.name : accountEllipsis(account)}</AccountEllipsis>
                                <WalletIcon color="secondary" />
                            </WalletIconWrapper>
                        </Dropdown>
                        : <ConnectWalletButton large/>
                }

            </HeaderOptions>
        </StyledHeader>
    );
}

export default AppHeader;

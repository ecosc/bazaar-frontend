import { Layout, Typography } from "antd";
import { Telegram, Twitter } from "components/Svg/Icons";
import { useTranslation } from "react-i18next";
import Header from './Header';
import {MailFilled} from '@ant-design/icons'
import styled from "styled-components";

const { Content, Footer } = Layout;

const StyledFooter = styled(Footer)`
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;

    & > a {
        padding: 0 10px;
    }
`;

function AppLayout({ children }) {
    const { t } = useTranslation();

    return (
        <Layout>
            <Header />
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, minHeight: 'calc(100vh - 134px)' }}>
                {children}
            </Content>
            <StyledFooter style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <a target="_blank" href="https://t.me/ECOSCu"><Telegram /></a>
                <a target="_blank" href="https://twitter.com/IoEcosc"><Twitter /></a>
                <a target="_blank" href="mailto:info@ecosc.net"><MailFilled style={{fontSize: '22px'}} /></a>
            </StyledFooter>
        </Layout>
    );
}

export default AppLayout;
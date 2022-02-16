import { Layout, Menu, Avatar, Button } from "antd";
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Header from './Header'

const { Content, Footer } = Layout;

function AppLayout({children}) {
    const { t } = useTranslation();

    return (
        <Layout>
            <Header />
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                {children}
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>ECO Bazaar</Footer> */}
        </Layout>
    );
}

export default AppLayout;
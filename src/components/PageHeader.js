import PropTypes from 'prop-types';
import styled from "styled-components";

const Header = styled.div`
    width: 100%;
    padding: 40px 118px 20px 118px;
    margin-bottom: 0px;

    @media (max-width: 1200px) {
        padding: 40px 60px 20px 60px;
    }
`;

const PageTitle = styled.h1`
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 48px;
    line-height: 110%;
    letter-spacing: -0.04em;
    background: ${({ theme }) => theme.colors.pageHeaderText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    width: 100%;
    max-width: 1300px;
    margin: auto;
`;

const PageSubTitle = styled.h2`
    font-size: 1.2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

function PageHeader({ title, subtitle }) {
    return (
        <Header>
            <PageTitle>{title}</PageTitle>
            {/* <PageSubTitle>{subtitle}</PageSubTitle> */}
        </Header>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
}

export default PageHeader;

import PropTypes from 'prop-types';
import styled from "styled-components";

const Header = styled.div`
    width: 100%;
    padding: 40px 70px 20px 70px;
    background: rgb(2,0,36);
    background: rgb(131,58,180);
    background: linear-gradient(0deg, rgb(229, 253, 255) 0%, rgb(243, 239, 255) 100%);
    margin-bottom: 20px;
`;

const PageTitle = styled.h1`
    font-size: 1.7rem;
    font-weight: bold;
    padding-bottom: 10px;
    color: ${({ theme }) => theme.colors.primary};
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
            <PageSubTitle>{subtitle}</PageSubTitle>
        </Header>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
}

export default PageHeader;

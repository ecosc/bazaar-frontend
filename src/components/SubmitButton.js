
import { Button } from "antd";
import styled from "styled-components";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { getDirection } from "localization";

const StyledButton = styled(Button)`
    align-self: end;
    height: 48px !important;
`;

function SubmitButton({ children, loading, ...props }) {
    const dir = getDirection();

    const icon = loading ? <LoadingOutlined /> :  (dir === 'rtl' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />);

    return <StyledButton {...props} className={loading && 'ant-btn-loading'}>
        {children}
        {icon}
    </StyledButton>
}

export default SubmitButton;

import { Button } from 'antd';
import styled from 'styled-components';

const SuccessButton = styled(Button)`
    background: #23A981 !important;
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    color: white !important;

    &:focus {
        opacity: 0.8;
    }

    &:hover {
        opacity: 0.8;
    }

    ${({ disabled }) => disabled && `
        opacity: 0.3;
    `}
`;

export default SuccessButton;

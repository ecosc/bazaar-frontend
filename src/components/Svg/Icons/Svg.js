import getThemeValue from "utils/getThemeValue";

const { default: styled } = require("styled-components");

const Svg = styled.svg`
  align-self: center; // Safari fix
  fill: ${({ theme, color }) => getThemeValue(`colors.${color}`, color)(theme)};
  flex-shrink: 0;
`;

Svg.defaultProps = {
    color: "primary",
    width: "20px",
    xmlns: "http://www.w3.org/2000/svg",
};

export default Svg;

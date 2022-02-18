import { Input, Tooltip } from "antd";
import { toLocaleNumber } from "utils/transforms";

class NumericInput extends React.Component {
    onChange = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
        }
    };

    render() {
        const { value } = this.props;

        const title = value ? (
            <span>{toLocaleNumber(value)}</span>
        ) : (
            '0'
        );
        return (
            <Tooltip
                trigger={['focus']}
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
            >
                <Input
                    {...this.props}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder="Input a number"
                    maxLength={25}
                />
            </Tooltip>
        );
    }
}


export default NumericInput;

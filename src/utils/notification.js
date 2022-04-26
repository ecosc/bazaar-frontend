import Icon from '@ant-design/icons';
import { notification } from 'antd';
import { ReactComponent as CheckedIcon } from 'assets/images/checked.svg';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';
import { getDirection } from 'localization';

export function notifySuccess(title, message, duration = 3) {
    const dir = getDirection();

    notification.success({
        message: title,
        description: message,
        duration: duration,
        placement: dir === 'rtl' ? "bottomLeft" : "bottomRight",
        icon: <Icon component={CheckedIcon} />
    });
}

export function notifyError(title, message, duration = 3) {
    const dir = getDirection();

    notification.error({
        message: title,
        description: message,
        duration: duration,
        placement: dir === 'rtl' ? "bottomLeft" : "bottomRight",
        icon: <Icon component={CloseIcon} />
    });
}

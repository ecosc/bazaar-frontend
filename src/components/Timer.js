import PropTypes from 'prop-types';
import useRefresh from "hooks/useRefresh";
import { useEffect, useState } from "react";
import { secondsToTime } from 'utils/transforms';

function Timer({ initialValue }) {
    const [time, setTime] = useState(initialValue);
    const { everySecondRefresh } = useRefresh();

    useEffect(() => {
        setTime(prev => prev > 0 ? prev - 1 : 0);
    }, [everySecondRefresh]);

    return (
        <span>
            {secondsToTime(time)}
        </span>
    );
}

Timer.propTypes = {
    initialValue: PropTypes.number,
};

Timer.defaultProps = {
    initialValue: 0,
};

export default Timer;

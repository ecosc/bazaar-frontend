import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'

const style = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
}

const Splash = function(props) {
  const {t} = useTranslation();

  return (
    <div style={style}>
      <Spin size="large" spinning={true} tip={t('Loading')} />
    </div>
  )
}

export default Splash

import { useContext } from 'react'
import { RefreshContext } from 'contexts/RefreshContext'

const useRefresh = () => {
  const { fast, slow, everySecond } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, everySecondRefresh: everySecond }
}

export default useRefresh

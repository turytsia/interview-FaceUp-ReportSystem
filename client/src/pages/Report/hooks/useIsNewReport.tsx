import { useParams } from 'react-router-dom'

const useIsNewReport = () => {

    const params = useParams()
 
  return {
    isNewReport: !Object.keys(params).includes('reportId'),
    reportId: params.reportId
  }
}

export default useIsNewReport
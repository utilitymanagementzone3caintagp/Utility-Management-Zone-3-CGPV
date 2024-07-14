import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import classNames from 'classnames'
import moment from "moment";



import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from "@coreui/react";

import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cifPh,
  cibTwitter,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const currentPHTime = moment().utcOffset("+0800").format("MMMM D, YYYY h:mm A");

  const progressExample = [
  ]

  const progressGroupExample1 = [
    
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
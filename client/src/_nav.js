import React from 'react'
import CIcon from '@coreui/icons-react'
import { AuthContext } from './context/AuthContext'
import {
  cilDescription,
  cilHistory,
  cilMoney,
  cilNewspaper,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilPhone,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Details',
  },
  
  {
    component: CNavItem,
    name: 'Transaction History',
    to: '/transactionhistory',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Bill Records',
    to: '/billrecords',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Payment',
    to: '/onlinepayment',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Profile',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  
  {
    component: CNavTitle,
    name: 'ABOUT',
  },
  {
    component: CNavGroup,
    name: 'Contact',
    icon: <CIcon icon={cilPhone} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: <span style={{ color: 'green', fontSize: '18px' }}>+639525417813</span>, 
        to: '/',
        disabled: true,
      },
      
    ],
  },
]

export default _nav
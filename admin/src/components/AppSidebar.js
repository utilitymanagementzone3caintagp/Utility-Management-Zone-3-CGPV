import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AuthContext } from '../context/AuthContext'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import { sygnet } from 'src/assets/brand/sygnet'
import logocainta from '../assets/brand/logo.ico';
import "./appsidebar.css";


// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <>
    {user ? (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
      <CSidebarBrand to="/">
      <CSidebarBrand to="/">
        <img src={logocainta} alt="Logo" height={32} /><p id="logoname">Zone-3 Cainta Greenpark Village</p>
      </CSidebarBrand>


          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
    ) : (
      <div className="text-center mt-3" style={{ display: 'none' }}></div>
    )}
  </>
  )
}

export default React.memo(AppSidebar)

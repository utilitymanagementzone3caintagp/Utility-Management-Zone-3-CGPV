import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 d-flex justify-content-center align-items-center flex-column">
      <div>
        <a href="https://www.facebook.com/groups/247291025706445/" target="_blank" rel="noopener noreferrer">
          Utility Stalls Zone-3 Cainta Greenpark Village
        </a>
        <span className="ms-1">&copy; 2024 CGPV HOA.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

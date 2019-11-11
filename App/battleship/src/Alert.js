import React from 'react'
import { withAlert } from 'react-alert'
 
const App = ({ alert }) => (
  <button
    onClick={() => {
      alert.show('Oh! no players available')
    }}
  >
    Show Alert
  </button>
)
 
export default withAlert()(App)
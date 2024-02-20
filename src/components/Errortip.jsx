import React from 'react'

export default function Errortip({error}) {
  if (error) return <div style={{color: 'red'}}>Can't be empty</div>
}

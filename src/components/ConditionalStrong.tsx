import React from 'react'

interface Props {
  strong: boolean
}

const ConditionalStrong: React.FC<Props> = ({ strong, children }) => {
  if (strong) return <strong>{children}</strong>
  return <>{children}</>
}

export default ConditionalStrong

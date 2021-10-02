import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { firestore } from '../firebase'
import { useFirestoreDoc } from '../lib/db'
import { Player, Role } from '../types'
import { useNullableUser } from '../util'

interface Props extends RouteProps {
  allowedRoles?: Role[]
}

const ProtectedRoute: React.FC<Props> = ({
  allowedRoles = [Role.USER],
  ...restProps
}) => {
  const [user, userLoading] = useNullableUser()
  const player = useFirestoreDoc<Player>(
    firestore.collection('players').doc(user?.uid)
  )

  // Loading
  if (!player || userLoading || player.id !== user?.uid) return null

  const canAccess = player.roles
    ? player.roles.some((role) => allowedRoles.includes(role))
    : allowedRoles.includes(Role.USER)

  if ((!userLoading && !user) || !canAccess) return <Redirect to="/login" />

  return <Route {...restProps} />
}

export default ProtectedRoute

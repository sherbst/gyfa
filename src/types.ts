import firebase from 'firebase'

export type Timestamp = firebase.firestore.Timestamp
export type Ref<T = any> = firebase.firestore.DocumentReference<T>
export type WithId<T> = T & { id: string }

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Player {
  firstName: string
  lastName: string
  claimed?: boolean
  bio?: string
  roles?: Role[]
}

export interface Match {
  date: Timestamp
  playerA: Ref<Player>
  playerB: Ref<Player>
  sets: Set[]
}

export interface Set {
  scoreA: number
  scoreB: number
}

export interface Post {
  title: string
  content: string
  image: string | null
  hidden: boolean
  date: Timestamp
}

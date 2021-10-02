import { useEffect, useMemo, useState } from 'react'
import { firebase } from '../firebase'
import { Ref, WithId } from '../types'

const firestore = firebase.firestore()

export async function getFirestoreCollection<T>(
  collection: string
): Promise<WithId<T>[]> {
  const snapshot = await firestore.collection(collection).get()
  const docs = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as WithId<T>)
  )
  return docs
}

export function useFirestoreCollection<T>(
  collection: string
): WithId<T>[] | null {
  const [vals, setVals] = useState<WithId<T>[] | null>(null)

  useEffect(() => {
    getFirestoreCollection<T>(collection).then(setVals)
  }, [])

  return vals
}

export async function getFirestoreDoc<T>(ref: Ref): Promise<WithId<T>> {
  const docs = await getFirestoreDocs<T>([ref])
  return docs[0]
}

export async function getFirestoreDocs<T>(refs: Ref[]): Promise<WithId<T>[]> {
  const snaps = await Promise.all(refs.map((ref) => ref.get()))
  const docs = snaps.map(
    (snap) => ({ ...snap.data(), id: snap.id } as WithId<T>)
  )
  return docs
}

export function useFirestoreDoc<T>(unmemoizedRef?: Ref): WithId<T> | null {
  const [val, setVal] = useState<WithId<T> | null>(null)

  // Only change ref if path changes
  const ref = useMemo(() => unmemoizedRef, [unmemoizedRef?.path])

  useEffect(() => {
    if (!ref) return

    getFirestoreDoc<T>(ref).then((newVal) => {
      setVal(newVal)
    })
  }, [ref])

  return val
}

export function useFirestoreDocs<T>(unmemoizedRefs: Ref[]): WithId<T>[] {
  const [vals, setVals] = useState<WithId<T>[]>([])

  // Only change ref if path changes
  const refs = useMemo(
    () => unmemoizedRefs,
    // Include all paths as deps
    [unmemoizedRefs.map((ref) => ref.path).join('')]
  )

  useEffect(() => {
    getFirestoreDocs<T>(refs).then(setVals)
  }, [refs])

  return vals
}

export function useFirebaseDocSubscription<T>(
  unmemoizedRef?: Ref
): WithId<T> | null {
  const [val, setVal] = useState<WithId<T> | null>(null)

  // Only change ref if path changes
  const ref = useMemo(() => unmemoizedRef, [unmemoizedRef?.path])

  useEffect(() => {
    if (!ref) return

    const unsubscribe = ref.onSnapshot((snap) => {
      const data = snap.data()
      data && setVal({ ...data, id: snap.id })
    })

    return unsubscribe
  }, [ref])

  return val
}

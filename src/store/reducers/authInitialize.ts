import { useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { fetchCurrentUser } from './authSlice'

export default function AuthInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return null
}

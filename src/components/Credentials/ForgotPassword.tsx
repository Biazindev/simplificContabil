import React, { useState } from 'react'
import { useForgotPasswordMutation } from '../../services/api'
import Loader from '../Loader'

export function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [triggerForgot, { isLoading }] = useForgotPasswordMutation()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage(null)

        try {
            const { message: msg } = await triggerForgot({ email }).unwrap()
            setMessage(msg)
        } catch {
            setMessage('Falha ao enviar e-mail.')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Recuperar Senha</h2>
            <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? <Loader /> : 'Enviar link'}
            </button>
            {message && <p>{message}</p>}
        </form>
    )
}

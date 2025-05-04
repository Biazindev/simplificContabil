import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom'
import { useResetPasswordMutation } from '../../services/api'

export function ResetPassword() {
    // 1) Hooks sempre no topo:
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [triggerReset, { isLoading, error }] = useResetPasswordMutation()
    const navigate = useNavigate()

    // 2) Se não tiver token, redireciona antes de qualquer coisa (mas após todos os hooks)
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // 3) Se a API retornar erro de token inválido/expirado, manda de volta pra pedir reset
    useEffect(() => {
        if (
            error &&
            'status' in error &&
            (error.status === 400 || error.status === 401)
        ) {
            alert('Link inválido ou expirado. Peça um novo e-mail de recuperação.')
            navigate('/recuperar-senha', { replace: true })
        }
    }, [error, navigate])

    // 4) Função de submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage(null)
        try {
            const { message: msg } = await triggerReset({ token, newPassword }).unwrap()
            alert(msg || 'Senha alterada com sucesso! Faça login.')
            navigate('/login', { replace: true })
        } catch {
            setMessage('Falha ao redefinir senha. Tente novamente.')
        }
    }

    // 5) JSX final - nenhum hook aqui dentro, apenas markup
    return (
        <form onSubmit={handleSubmit}>
            <h2>Nova Senha</h2>
            <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Aguarde...' : 'Redefinir senha'}
            </button>
            {message && <p>{message}</p>}
        </form>
    )
}

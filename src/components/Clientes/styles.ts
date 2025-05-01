import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  input {
    font-weight: normal;
    text-decoration: none;
    outline: none;
  }
`

export const Title = styled.h2`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  margin: 14px 24px;
`

export const Section = styled.div`
  display: block;
  width: 100%;
  margin-bottom: 2rem;

  >div {
    display; flex;
    margin: 0 auto;
    justify-content: center;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  width: 100%;
  max-width: 600px;
  justify-content: center;
`

export const Button = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 400;
  font-size: 18px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;

  &:hover {
  background-color: #0be881;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`

export const Error = styled.p`
  color: #f59e0b;
  margin-top: 0.5rem;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`

export const Subtitle = styled.h4`
  margin-top: 2rem;
  font-size: 1.2rem;
`
export const ContainerButton = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
`
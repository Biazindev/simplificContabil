import styled from "styled-components"

export const Container = styled.div`
  padding: 2rem;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`

export const TabContainer = styled.div`
  display: flex;
  width: 800px;
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  font-weight: normal;
  border: none;
`

export const TabButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "#2563eb" : "#d1d5db")};
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;
  font-weight: normal;
  border: none;
`

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: normal;
  border: none;
`

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #059669;
  }
`

export const Img = styled.div`
display: inline-grid;
margin: 0 auto;
justify-content: center;
width: 100%;
height: 120px;
border: 1px dotted #10b981;
border-radius: 16px;
`

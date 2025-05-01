import styled from "styled-components"

export const Container = styled.div`
        display: flex;
        width: 100%;
        height: 100%;
        color: #57606f;
        h1 {
            color: black;
            margin-bottom: 48px;
        }

        button {
            width: 100%;
            height: 36px;
        }
            div {
            width: 100%;
            img{
            width: 90%;
            height: 110%;
            }
            }
`
        export const Login = styled.div`
        display: flex;
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        padding: 48px;
        color: #57606f;
        h1 {
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #57606f;
        }
        
        a {
        font-size: 12px;
        text-decoration: none;
        color: #57606f;
        }

        div {
        button {
        margin-bottom: 12px;
        background-color: #20bf6b;
        color: white;
        font-weight: bold;
        font-size: 18px;
        border: none;
        cursor: pointer;
        border-radius: 8px;

        &:hover {
        background-color: #26de81;
        }
        }
        }
  
`



export const User = styled.div`
    display: block;
    width: 100%;
    height: 36px;
    margin-bottom: 24px;

    input {
    padding: 8px;
    width: 100%;
    height: 100%;
    font-weight: normal;
    text-decoration: none;
    outline: none;
    }
`


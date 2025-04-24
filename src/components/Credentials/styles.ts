import styled from "styled-components"

export const Container = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;  
        width: 100%;
        background-color: #f7f1e3;

        h1 {
            color: black;
            margin-bottom: 48px;
        }

        button {
            width: 100%;
            height: 36px;
        }
`
export const Login = styled.div`
  position: relative;
  padding: 64px;
  z-index: 0;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37),
              0 4px 6px rgba(255, 255, 255, 0.1) inset;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0.3;
    z-index: -1;
  }
`



export const User = styled.div`
    display: block;
    width: 100%;
    height: 36px;
    margin-bottom: 24px;

    input {
    width: 100%;
    height: 100%;
    }
`


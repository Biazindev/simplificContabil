import styled from "styled-components";

export const Container = styled.div`
    border-radius: ${({ theme }) => theme.radii.lg};
    padding: ${({ theme }) => theme.spacing(2)};
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text || '#222'};

    h2,
    h3 {
        font-weight: bold;
        font-size: 10px;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 24px;
        margin-top: revert;
        }

        p {
            font-size: 14px;
            line-height: 22px;
            margin-top: 16px;
        }
`
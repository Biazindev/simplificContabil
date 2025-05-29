import styled from "styled-components";

export const Container = styled.div`
    margin: 0 auto;
    display: block;
    align-items: center;
    justify-content: center;
`

export const SupportContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export const SupportCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  svg {
    color: #0e7490;
  }
`;

export const SupportInfo = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #0f172a;
  }

  a {
    font-size: 0.95rem;
    color: #0e7490;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

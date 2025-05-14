import { styled } from 'styled-components';

export const ContainerDash = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Title = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: hsl(210, 22%, 15%);
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

export const CardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  }

  > p {
    font-size: 2.25rem;
    font-weight: 800;
    color: hsl(210, 22%, 15%);
    margin-bottom: 1.5rem;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(210, 15%, 25%);

      p {
        font-size: 1rem;
        margin: 0;
        font-weight: 500;
      }

      svg {
        font-size: 2.25rem;
        color: hsl(204, 80%, 55%);
      }
    }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;

  h3 {
    font-size: 1.375rem;
    font-weight: 600;
    color: hsl(210, 22%, 20%);
    text-align: center;
    margin-bottom: 1.25rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    margin-top: 1.25rem;
    color: hsl(210, 16%, 35%);

    .valor {
      color: hsl(245, 75%, 55%);
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
`;

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
  color: hsl(210, 22%, 20%);
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

export const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  > p {
    font-size: 2rem;
    font-weight: bold;
    color: hsl(210, 22%, 20%);
    margin-bottom: 1.25rem;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(210, 15%, 30%);

      p {
        font-size: 1rem;
        margin: 0;
        font-weight: 500;
      }

      svg {
        font-size: 2rem;
        color: hsl(204, 70%, 53%);
      }
    }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(210, 22%, 20%);
    text-align: center;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    margin-top: 1rem;
    color: hsl(210, 16%, 40%);

    .valor {
      color: hsl(245, 70%, 55%);
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
`;

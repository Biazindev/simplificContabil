import { styled } from 'styled-components';

export const ContainerDash = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: 'Inter', 'Roboto', 'Plus Jakarta Sans', sans-serif;
`;

export const Title = styled.h3`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 2rem;
`;

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
`;

export const CardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 1.75rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }

  h5 {
    font-size: 1.35rem;
    color: #111827;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  span.description {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 1rem;
    display: block;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 800;
    margin-top: 0.5rem;
  }

  &.daily .value {
    color: #4f46e5;
  }

  &.weekly .value {
    color: #10b981;
  }

  &.monthly .value {
    color: #f59e0b;
  }

  &.annual .value {
    color: #3b82f6;
  }

  .icon-text {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.25rem;
    color: #374151;

    svg {
      font-size: 1.75rem;
      color: #60a5fa;
    }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    margin-top: 1rem;
    color: #6b7280;

    .valor {
      display: block;
      margin-top: 0.25rem;
      color: #4f46e5;
      font-weight: 700;
      font-size: 1.2rem;
    }
  }
`;
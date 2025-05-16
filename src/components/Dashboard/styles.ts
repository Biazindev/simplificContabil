import { styled } from 'styled-components';

export const ContainerDash = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Roboto', 'Plus Jakarta Sans', sans-serif;
`;

export const Title = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937; // slate-800
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
  text-align: left;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  }

  h5 {
    font-size: 1.25rem;
    color: #1f2937; // slate-800
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  span.description {
    font-size: 0.9rem;
    color: #6b7280; // gray-500
    display: block;
    margin-bottom: 0.75rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }

  &.daily .value {
    color: #4f46e5; // indigo-600
  }

  &.weekly .value {
    color: #059669; // emerald-600
  }

  &.monthly .value {
    color: #f59e0b; // amber-600
  }

  &.annual .value {
    color: #2563eb; // blue-600
  }

  .icon-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: #374151; // slate-700

    svg {
      font-size: 1.75rem;
      color: #60a5fa; // blue-400
    }

    p {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937; // slate-800
    text-align: center;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    margin-top: 1rem;
    color: #6b7280; // gray-500

    .valor {
      color: #4f46e5; // indigo-600
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
`;

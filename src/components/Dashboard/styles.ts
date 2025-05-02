import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  h4 {
  display: block;
  align-items: center;
  font-weight: 400;
  justify-content: center;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 12px;
  cursor: pointer;
  box-shadow:
    5px 5px 10px #c5c5c5,
    -5px -5px 10px #ffffff;
  font-weight: 500;
  width: 320px;
  height: 88px;
  padding: 28px;
  transition: transform 0.2s ease;
}

h4:hover {
  transform: translateY(-3px);
  box-shadow:
    8px 8px 15px #c5c5c5,
    -8px -8px 15px #ffffff;
}
    span.valor {
     font-size: 24px;
     color: #4834d4;
  }

  h3 {
  background-color: #34ace0;
  color: #fff;
  width: 100%;
  aling-items: center;
  justify-content: center;
  display: flex;
  margin: 0 auto;
  
  }
`

export const ContainerDash = styled.div`
  display: grid;
  margin: 0 auto;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  max-width: 1200px;
  place-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`


export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

export const DashboardContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;

    >div {
  background-color: #34ace0;
  color: #fff;
  font-weight: bold;
  width: 240px;
  height: 88px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
  transform: translateY(-3px);
  box-shadow:
    8px 8px 15px #c5c5c5,
    -8px -8px 15px #ffffff;
}
  }
`
export const CardContainer = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  >p {
    font-size: 24px;
    margin: 8px 0;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      display: flex;
      align-items: center;

      p {
        margin: 0;
      }
    }
  }
`

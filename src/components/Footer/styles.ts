import { styled } from "styled-components";

export const ShortcutsFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: #1e272e;
  color: #fff;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: flex;
    gap: 3rem;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    white-space: nowrap;
  }
`;


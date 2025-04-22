import { createGlobalStyle } from 'styled-components'

export const GlobalCss = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Roboto, sans-serif;
        list-style: none;
    }

        .container {
        max-width: 1024px;
            width: 100%;
            margin: 0 auto;
            overflow: hidden;
        }
`

export const cores = {
    branca: '#EEEEEE',
    preta: '#3d3d3d',
    cinza: '#333',
    verde: '#10AC84',
    CinzaClaro: '#A3A3A3'
  }
export interface EnderecoCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

export const formatarCep = (value: string) => {
  return value
    .replace(/\D/g, '')           // Remove tudo que não é dígito
    .replace(/^(\d{5})(\d)/, '$1-$2') // Adiciona o hífen entre o quinto e sexto dígito
    .slice(0, 9);                 // Limita a 9 caracteres (ex: 12345-678)
};


export class CepService {
  static async buscar(cep: string): Promise<EnderecoCep | null> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      console.warn('CEP inválido');
      return null;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        console.warn('CEP não encontrado');
        return null;
      }

      return data as EnderecoCep;
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      return null;
    }
  }
}

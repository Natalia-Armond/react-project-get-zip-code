import logo from './logo.svg'; // Importa o logo da aplicação
import './App.css'; // Importa o arquivo de estilo CSS para a aplicação
import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciar o estado do componente.
import { Button, Typography, TextField, Grid, Box, Alert } from '@mui/material'; // Importa componentes do Material-UI para construir a interface do usuário

function App() { // Define a função que representa o componente App.
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({});// Estado para armazenar o endereço retornado pela API
  const [erro, setErro] = useState(null);// Estado para armazenar erros, inicializado como null

  const handleCepChange = (event) => {
    setCep(event.target.value);
  };
  // Função para atualizar o estado do CEP quando o usuário digita algo
  const handleCepSubmit = (event) => {
    event.preventDefault();
    consult()
  };

  function consult() {
    let param = [...(String(cep).matchAll(/\d+/g))]
    param = param.map(p => p[0]).join("")
    console.log(param)
    if (param.length!==8) {
      alert("CEP inválido")
      return
    }
    const url ="https://viacep.com.br/ws/" + param + "/json/" // Constrói a URL para consultar o CEP

    // Realiza uma requisição GET para a API do ViaCEP
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.erro === "true") {
          throw new Error("cep inexistente")
        }
        setAddress(data);
        setErro(null);
      })
      .catch((error) => { // Tratamento de erro personalizado para quando o CEP não é encontrado
        console.error('Erro ao buscar o endereço:', error);
        if (error.message === "CEP inexistente") {
          setErro("Erro ao buscar o endereço");
        } else {
          setErro("CEP não encontrado" );
        }
      });
  }

  return (
    <Box className="cep" sx={{ paddingX: 4, paddingY: 2, }}>
      <Typography variant="h1" component="h1"
        sx={{
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 2,
        }}>Busca CEP
      </Typography>

      <Grid container component="form" onSubmit={handleCepSubmit}
        sx={{
          flexDirection: 'column',
          alignItems: 'center'
        }}>

        <Grid item>
          <TextField
            type="text"
            id="cep"
            label="Digite um cep"
            variant="outlined"
            value={cep}
            onChange={handleCepChange}
            sx={{
              width: '100%', // largura do campo de texto
              mb: 2, // margem inferior do campo de texto
            }}
          />
        </Grid>

        <Grid item>
          <Button variant="contained" type="submit" sx={{
            width: '100%', // largura do botão
            py: 2, // padding vertical do botão
            px: 4, // padding horizontal do botão
          }}>Buscar</Button>
        </Grid>
      </Grid>
      
      {erro && (// Exibição da mensagem de erro utilizando o componente Alert
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro === "CEP inválido" ? "O CEP informado é inválido" : erro === "CEP não encontrado" ? "Não foi possível encontrar o endereço correspondente ao CEP informado" : "Erro ao buscar o endereço"}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {address.logradouro && ( // Renderização condicional: apenas renderizar a grade se address.logradouro for verdadeiro
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1" component="div">
              <strong>Logradouro:</strong>
              <Typography variant="body1" color="textSecondary">
                {address.logradouro}
              </Typography>
            </Typography>
          </Grid>
        )}
        {address.bairro && (
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1" component="div">
              <strong>Bairro:</strong>
              <Typography variant="body1" color="textSecondary">
                {address.bairro}
              </Typography>
            </Typography>
          </Grid>
        )}
        {address.localidade && (
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1" component="div">
              <strong>Localidade:</strong>
              <Typography variant="body1" color="textSecondary">
                {address.localidade}
              </Typography>
            </Typography>
          </Grid>
        )}
        {address.uf && (
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1" component="div">
              <strong>UF:</strong>
              <Typography variant="body1" color="textSecondary">
                {address.uf}
              </Typography>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default App; // Exporta o componente App como padrão

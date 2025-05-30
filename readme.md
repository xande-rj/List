- Projeto lista telefonica
	- tecnologia:
		- node.js
		- express
		- prisma
    - bcrypt
	- docker -> postgres *
		 -> redis
 
-Objetivos: 
	- api que cadastra uma lista de usuarios que guarda uma lista telefonica. 

-Rotas:
  Usuario:

	- POST /users -> rota de cadastro de usuario 
		- nome, senha, email, telefone, sexo, idade, cidade
			- Verifica se os tipos e as informacao sao unica, apos isso cria no banco o usuario
	- POST /users/login -> rota que retona o token de acesso .
	- PUT /users/{userId} ->atualiza os campo do usuario se o token for certo  
	- DELETE /users/{userId} -> verifica se a senha e o token sao os mesmo entao deleta ele 


  Lista:

	 - POST users/{userId}/create -> Rota de cadastro na lista 
	 - GET users/{userId}/list -> Rota que retorna toda a lista do usuario salvando no cache
	 - GET users/{userId}/list:{telefone} -> rota que retorna a um pessoa da lista com base no numero enviado
    - PUT users/{userId}/list:{telefone} -> rota que altera alguma informacao na lista 
	 - DELETE users/{userId}/list:{telefone} -> delete da lista pelo telefone fornecido 



-Melhorias:
   - Verificar duplicatas de nome ou de numero
	 - sessao de login de usuario, busca por nome, busca por telefone, cadastro de novo usuario,
 modificar lista
	- testes automatizados.
        - guardar em cache as listas.
- ter uma criptografia no env, criptografar a senha do usuario e concatenar ela, salvando no banco, entao 
toda vez que o usuario fizer o login ele vai criptografar a senha e concatenar com a do env e verificar 
se e a mesma do banco
- Banco de Dados (Postgres)  :
	Usuario {
		id unico int
		nome string 
		senha (criptografada)
		email string 
		telefone int 
		sexo string
		idade int
		cidade string
		criado dateTime
		ultima_atualizacao dateTime
			lista[{
				telefone unico int 
				nome string 
				descricao string
				criado dateTime
				ultima_atualizacao dateTime
			}]
	}	
- Banco de Dados (Redis) :
	Usario id = lista[{
                                telefone unico int
                                nome string
                                descricao string
                                criado dateTime
                                ultima_atualizacao dateTime
                        }]


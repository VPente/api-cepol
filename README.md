# Cloudflare Workers OpenAPI 3.1

Este é um Worker do Cloudflare com OpenAPI 3.1 usando [chanfana](https://github.com/cloudflare/chanfana) e [Hono](https://github.com/honojs/hono).

Este é um projeto de exemplo feito para ser usado como um ponto de partida rápido para construir Workers compatíveis com OpenAPI que geram o esquema `openapi.json` automaticamente a partir do código e validam a solicitação recebida de acordo com os parâmetros ou corpo da solicitação definidos.

## Começando

1. Inscreva-se no [Cloudflare Workers](https://workers.dev). O plano gratuito é mais do que suficiente para a maioria dos casos de uso.
2. Clone este projeto e instale as dependências com `npm install`.
3. Execute `wrangler login` para fazer login na sua conta Cloudflare no wrangler.
4. Execute `wrangler deploy` para publicar a API no Cloudflare Workers.

## Estrutura do Projeto

1. Seu roteador principal está definido em [`src/index.ts`](src/index.ts).
2. Cada endpoint tem seu próprio arquivo em `src/endpoints/`.
3. Para mais informações, leia a [documentação do chanfana](https://chanfana.pages.dev/) e a [documentação do Hono](https://hono.dev/docs).

## Desenvolvimento

1. Execute `wrangler dev` para iniciar uma instância local da API.
2. Abra `http://localhost:8787/` no seu navegador para ver a interface Swagger onde você pode testar os endpoints.
3. As alterações feitas na pasta `src/` irão automaticamente reiniciar o servidor, você só precisa atualizar a interface Swagger.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`).
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`).
5. Crie um novo Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

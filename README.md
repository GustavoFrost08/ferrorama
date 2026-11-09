# Sistema de Monitoramento Ferroviario 

## Equipe 
Gustavo Frost, Giovanna Bresciani e Matheus Luiz

## O que o sistema faz 
Basicamente nosso sistema serve para monitorar a situação dos trens, além de diversas outras coisas. O sistema possui cadastro, informações sobre as contas do usuário
login e senhas seguras no banco, integração com o banco via apache e mysql, além do design moderno e autoexplicativo.

## Tecnologias 
PHP, MySQL, HTML, CSS, JavaScript. Ambiente: XAMPP. e algumas APIs se isso contar =)

## Como instalar 
1. Copiar a pasta para htdocs 
2. Iniciar Apache e MySQL no XAMPP 
3. Importar banco/script.sql pelo phpMyAdmin 
4. Acessar http://localhost/ferrorama

## Usuarios de teste 
usuário/teste@teste.com
senha/teste

## Telas do sistema 
tela de Criação de Conta - Cria um usuário
tela de Login - Entrar no site
Dashboard - Visão Geral do Sistema
Trens - Status do trem e localização
Sensores - Monitoramento dos sensores de cada trem, gráfico
Relatório - Visão geral e simplificada de sensores e trens
Usuários - Management de usuários do site

## Decisoes tomadas 
Basicamente fomos fazendo o site conforme as necessidades das páginas, por exemplo, a página de relatórios só podia ser feita após termos os sensores e relatórios prontos,
a Página de "Minha Conta" só pode ser feita após as páginas de login estarem prontas etc...

## Limitacoes conhecidas 
Não conseguimos fazer a separação de admin e usuários, então como o tempo estava curto colocamos botões que representam a visão do administrador e do usuários separadas,
basicamente toda vez que tentávamos implementar isso no site o sistema quebrava ao meio. =(

## Uso de inteligência artificial 
Boa parte do trabalho foi feita a mão, usamos ia para ou corrigir erros absurdos que demorariam muito tempo para serem corrigidos e pra funções que não sabíamos como fazer(por exemplo: partes do JS e PHP)

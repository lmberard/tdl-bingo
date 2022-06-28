# Solidity

Este documento contiene una pequeña explicacion de las distintas cualidades del lenguaje `Solidity` y que funcionalidades fueron utilizadas a lo largo del proyecto.

**Solidity es un lenguaje de alto nivel orientado a contratos.** Su sintaxis es similar a la de JavaScript y está enfocado específicamente a la Máquina Virtual de Etehreum (EVM).

Solidity está tipado de manera estática y acepta, entre otras cosas, herencias, librerías y tipos complejos definidos por el usuario

Hay lenguajes compilados (como C), interpretados (como Js) y uno intermedio que se podría considerar `transpilados`. Este último no es que se termina de compilar sino que un segundo programa ejecuta el programa del codigo fuente. 

Solidity se pasa a **ByteCode** y es ejecutado e interpretado por las maquinas virtuales de las wallets de los mineros. La ejecución se realiza mediante transacciones. 

Son contratos que estan guardados en la blockchain y se ejecutan ahí mismo.
## Tipos de datos 

## Tipos de visibilidades de las funciones 
- `Public:` Totalmente accesible, sea cual sea el origen.
- `External:` Accesible desde una cuenta de propiedad externa y a través de
un mensaje (llamada desde otro contrato). No es accesible desde una
función del mismo contrato o uno derivado del mismo.
- `Internal:` Accesible únicamente a través de otra función incluida en el
mismo contrato, o desde una función de un contrato que deriva del
mismo. NO es accesible desde un mensaje de un contrato externo o una
transacción externa.
- `Private: `Accesible únicamente a través de una función incluida en el
mismo contrato

Entre `public` y `external` en muchos casos es preferible usar `external`, si la
lógica de negocio lo permite. Ya que éste modificador de visibilidad consume
menos gas

## Modifiers 

## Events

## Librerias 

## Herencia 

## Aleatoridad en Solidity
> Es posible la aleatoriedad en Solidity? NO.  

Por que no existe? Por el concenso para aceptar. Si hay algo aleatorio, cada vez que se ejecute va a dar un resultado distinto por lo que no van a poder coincidir los resultados y no se va a aceptar ese nodo para que continue en la blockchain. 

Las blockchains son deterministicas. Siempre tienen que dar los mismos resultados sin importar el entorno donde se ejecuten. Lo que si se puede armar en los smart contracts es algo que se le puede decir como "variable/codigo pseudo aleatoria/o".

Para generar numeros seudoaleatorios se uso la función `keccak256` que a partir de una entrada de datos se puede obtener un hash.

## Implementacion token propio
- [Referencia EIP-20](https://eips.ethereum.org/EIPS/eip-20)

## Front end - UI
- HTML 
- CSS 
- [Truffle](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/)

## Wallets
- [Metamask](https://metamask.io/)
  

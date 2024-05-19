import { CSVMatrix } from 'csvmatrix';
import assert from 'assert'

// dados em formato csv usado para testes
const csv = 'nome,periodo,prof,creditos\n' +
             'p1,1,dalton,4\n' +
             '"lp1",1,"figueiredo, jorge",4\n' +
             '"p2",2,lívia,4\n' +
             'lp2,2,"eliane ""chefe""",4\n' +
             'eda,3,joão,4\n';

// cria objeto CSVMatrix a partir do texto csv
// a opção header informa que a primeira linha é de headers
const m1 = new CSVMatrix(csv, {header: true, keys: [0, 1]});

// matriz de referência para testes;
// dados correspondem aos do CSV acima
const MATRIZ = [
    [ 'p1', '1',            'dalton', '4'],
    ['lp1', '1', 'figueiredo, jorge', '4'],
    [ 'p2', '2',             'lívia', '4'],
    ['lp2', '2',    'eliane "chefe"', '4'],
    ['eda', '3',              'joão', '4']
]

// alias para melhorar a legibilidade de alguns testes
const LINHAS = MATRIZ;

// outra matriz de referência para testes;
// corresponde à transposta da matriz acima;
// logo, cada linha nesta é uma coluna do CSV;
const COLUNAS = [
    [    'p1',               'lp1',    'p2',            'lp2',  'eda'],
    [     '1',                 '1',     '2',              '2',    '3'],
    ['dalton', 'figueiredo, jorge', 'lívia', 'eliane "chefe"', 'joão'],
    [     '4',                 '4',     '4',              '4',    '4']
]

// esta string corresponde à string a ser gerada
// pelo método .toString() do objeto CSVMatrix;
const resulting_csv_text = 'nome,periodo,prof,creditos\n' +
                           'p1,1,dalton,4\n' +
                           'lp1,1,"figueiredo, jorge",4\n' +
                           'p2,2,lívia,4\n' +
                           'lp2,2,"eliane ""chefe""",4\n' +
                           'eda,3,joão,4\n';

// aos asserts...

// toString() produz uma string a partir de um CSVMatriz 
// que deve resultar em um texto CSV válido equivalente (mas
// não necessariamente com formatação idêntica) ao original;
assert.equal(m1.toString(), resulting_csv_text);

// o CSVMatrix permite o acesso (leitura) de um CSV tal como
// se ele fosse uma planilha (ou como uma matriz
// matemática); por esse motivo, a indexação default é
// baseada em 1 (ver mais abaixo, como é possível usar o
// CSVMatriz como se fosse um simples array de array e,
// dessa forma, usar indexação baseada em 0);

// para acessos a células, use o método cell
assert.equal(m1.cell(4, 2), MATRIZ[3][1]);

// para acesso a linhas inteiras, use o método lin
assert.deepEqual(m1.lin(1), LINHAS[0]);
assert.deepEqual(m1.lin(3), LINHAS[2]);

// para acesso a colunas inteiras, use o método col
assert.deepEqual(m1.col(3), COLUNAS[2]);
assert.deepEqual(m1.col(4), COLUNAS[3]);

// para acessos por índices baseados em 0, você pode indexar
// o objeto diretamente para para acessar linhas e células
assert.equal(m1[3][1], MATRIZ[3][1]);
assert.equal(m1[0][0], MATRIZ[0][0]);


// para acesso a colunas inteiras com índices baseados em 0,
// é necessário acessar a transposta da matriz:
assert.deepEqual(m1.transp, COLUNAS);
assert.deepEqual(m1.transp[0], COLUNAS[0]);
assert.deepEqual(m1.transp[3], COLUNAS[3]);

// acessos por headers e keys

// se o CSV tiver uma linha de headers, é possível
// acessar as colunas diretamente pelo nome:
assert.deepEqual(m1.nome, m1.col(1));
assert.deepEqual(m1.creditos, m1.col(4));
assert.deepEqual(m1["nome"], m1.col(1));
assert.deepEqual(m1["creditos"], m1.col(4));
assert.deepEqual(m1.col("nome"), m1.col(1));
assert.deepEqual(m1.col("creditos"), m1.col(4));

// acesso a linhas pela chave

// se o CSV tiver um subconjunto de colunas que caracterizam
// uma chave única dos dados nas linhas, é possível acessar as
// as linhas pela chave; neste caso, é necessário indicar
// as colunas que compõem a chave no parâmetro opts na
// instanciação do objeto:
const m3 = new CSVMatrix(csv, {header: true, keys: ["nome", "periodo"]});

// se o CSV não tiver header, se pode usar os índices das colunas 
// que compõem uma chave;
const m4 = new CSVMatrix(csv, {header: true, keys: [0, 1]});

// o acesso direto às linhas pelas chaves pode ser feito
// através do método lin, usando strings ao invés de índices
// numéricos; ou as várias strings que compõem a chave, ou
// uma string única composta dos valores da chave separados
// por um "|" (pipe):
assert.deepEqual(m4.lin("eda", "3"), m4.lin(5));
assert.deepEqual(m4.lin("eda|3"), m4.lin(5));

// o acesso também pode ser feito de forma direta, passando
// a chave como um array como índice direto:
assert.deepEqual(m4[["p1", "1"]], m4.lin(1));
assert.deepEqual(m4.lin(["p1", "1"]), m4.lin(1));


// OBS: se os campos escolhidos não formarem uma chave
// única, o comportamento resultante não é definido
// (provavelmente, irá retornar apenas o último elemento do
// csv que tem os valores correspondentes)




// abaixo é outro teste? não lembro o que estes testes adicionam;
// desconfio que não adicionam nada, depois da revisão dos
// testes acima;

const csv1b = `\
p1,1,dalton,4
lp1,1,"figueiredo, jorge",4
"p2",2,lívia,4
lp2,2,"eliane ""chefe""",4
eda,3,joão,4\
`;

const m2 = new CSVMatrix(csv1b);

// toString
const resulting_csv_text_2 = `\
p1,1,dalton,4
lp1,1,"figueiredo, jorge",4
p2,2,lívia,4
lp2,2,"eliane ""chefe""",4
eda,3,joão,4\n`;

assert.equal(m2.toString(), resulting_csv_text_2);

// acesso às linhas diretamente
assert.deepEqual(m2._lines, LINHAS);
assert.deepEqual(m2._lines[0], LINHAS[0]);
assert.deepEqual(m2[1], LINHAS[1]);

// acesso às colunas diretamente
assert.deepEqual(m2.transp, COLUNAS);
assert.deepEqual(m2.transp[1], COLUNAS[1]);
assert.deepEqual(m2.col(3), COLUNAS[2]);
assert.deepEqual(m2.col(4), COLUNAS[3]);

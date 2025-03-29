// Este módulo permite manipular um CSV como um objeto matriz.
// O parsing obedece apenas parcialmente o RFC 4180. Em particular,
// não são observados campos com CRLF, por exemplo. Aspas duplas,
// contudo, são relativamente bem processadas. Embora o objeto
// exporte um CSV (método toString), ainda não há nenhum método
// para alterar o CSV. Por isso, é necessário alterar diretamente
// os dados no campo "._lines" do objeto. O campo "._columns" não
// pode ser usado para alterar o conteúdo e, se o conteúdo for
// alterado, ele deixará de estar consistente e deve ser atualizado
// manualmente, invocando o método `._sync_transpose`;

// Expressão regular para separar campos de uma linha CSV.
const DEFAULT_DELIM = ',';
const FIELD_REGEX = /(?:[^,"|]+|"[^"]*")+/g

export class CSVMatrix {
    constructor(csv_text, opts) {
        this._lines = [];
        const text_lines = csv_text.split("\n");
        this.delim = opts?.delim || DEFAULT_DELIM;
        this.col_names = opts?.header ? text_lines.splice(0, 1)[0].split(this.delim) : null;
        text_lines.forEach((line_str, index) => {
            let fields = line_str.match(FIELD_REGEX);
            if (!fields) return;
            let line = fields.map(valor => {
                if (valor[0] == '"' && valor[valor.length - 1] == '"') {
                    return valor.substring(1, valor.length - 1).replaceAll('""', '"');
                } else {
                    return valor;
                }
            });
            // adiciona acesso pela chave de cada linha
            if (opts?.keys) {
                let line_array_key = opts.keys.map(k => line[k]);
                this[line_array_key] = line;
                this[line_array_key.join("|")] = line;
            }
            this._lines.push(this[index] = line);
            this.col_names?.forEach((col_name, i) => {
                // adiciona acesso pelo nome da coluna
                Object.defineProperty(line, col_name, {
                    configurable: true,
                    value: line[i],
                });
            });
        });
        this._sync_transpose();
    }

    _sync_transpose() {
        // atualiza a transposta
        this._columns = [];
        for (let icol=0; icol<this._lines[0].length; icol++) {
            let column = [];
            this._lines.forEach(line => {
                column.push(line[icol]);
            });
            this._columns.push(column);
            if (this.col_names) {
                Object.defineProperty(this, this.col_names[icol], {value: column});
            }
        }
    }

    get(index) {
        if (typeof index == 'number') {
            return this._lines[index];
        }
        return "Ops!!"
    }

    get array() {
        return this._lines;
    }

    get transp() {
        return this._columns;
    }

    lin(...args) {
        if (typeof args[0] == "number") {
            return this.get(args[0] - 1);
        }
        return this[args];
    }

    col(ncol) {
        if (typeof ncol == "string") {
            return this[ncol];
        }
        return this._columns[ncol - 1];
    }

    cell(nlin, ncol) {
        return this._lines[nlin - 1][ncol - 1];
    }

    toString() {
        let delim = this.delim;
        function quote_escape(line) {
            return line.map(valor => {
                if (valor.includes('"') || valor.includes(delim)) {
                    return `"${valor.replaceAll('"', '""')}"`;
                }
                return valor;
            });
        }
        const lines = this._lines.map(line => quote_escape(line));
        if (this.col_names) {
            lines.unshift(this.col_names);
        }
        return lines.join("\n") + "\n";
    }
}

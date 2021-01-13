const { PessoasServices } = require('../services');
const pessoasServices = new PessoasServices();

class PessoaController {
  static async pegaPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await pessoasServices.pegaRegistrosAtivos();
      return res.status(200).json(pessoasAtivas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTodasAsPessoas(req, res) {
    try {
      const todasAsPessoas = await pessoasServices.pegaTodosOsRegistros();
      return res.status(200).json(todasAsPessoas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params;
    try {
      const umaPessoa = await pessoasServices.pegaUmRegistro({id : id});
      return res.status(200).json(umaPessoa);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body;
    try {
      const novaPessoaCriada = await pessoasServices.criaRegistro(novaPessoa);
      return res.status(201).json(novaPessoaCriada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params;
    const novasInfos = req.body;
    try {
      await pessoasServices.atualizaRegistro(novasInfos, Number(id));
      const pessoaAtualizada = await pessoasServices.pegaUmRegistro({ id: id });
      return res.status(200).json(pessoaAtualizada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params;
    try {
      await pessoasServices.apagaRegistro(id);
      return res.status(200).json({ mensagem: `Pessoa de id:${id} deletada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params;
    try {
      await pessoasServices.restauraRegistro(id);
      return res.status(200).json({ mensagem: `Pessoa de id:${id} restaurada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params;
    try {
      await pessoasServices.cancelaPessoaEMatriculas(estudanteId);
      return res.status(200).json({ mensagem: `Matrículas referente a estudante de id ${estudanteId} canceladas` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTodasAsMatriculasdeUmaPessoa(req, res) {
    const { estudanteId } = req.params;
    try {
      const pessoa = await pessoasServices.pegaUmRegistro({ id: estudanteId });
      const matriculas = await pessoa.getAulasMatriculadas();
      return res.status(200).json(matriculas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }
}

module.exports = PessoaController;
const database = require('../models');
const Sequelize = require('sequelize');

class PessoaController {
  static async pegaPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await database.Pessoas.findAll();
      return res.status(200).json(pessoasAtivas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTodasAsPessoas(req, res) {
    try {
      const todasAsPessoas = await database.Pessoas.scope('todos').findAll();
      return res.status(200).json(todasAsPessoas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params;
    try {
      const umaPessoa = await database.Pessoas.findOne({ where: { id: Number(id) } });
      return res.status(200).json(umaPessoa);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body;
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
      return res.status(201).json(novaPessoaCriada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params;
    const novasInfos = req.body;
    try {
      await database.Pessoas.update(novasInfos, {
        where: { id: Number(id) }
      });
      const pessoaAtualizada = await database.Pessoas.findOne({ where: { id: Number(id) } });
      return res.status(200).json(pessoaAtualizada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params;
    try {
      await database.Pessoas.destroy({ where: { id: Number(id) } });
      return res.status(200).json({ mensagem: `Pessoa de id:${id} deletada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params;
    try {
      await database.Pessoas.restore({
        where: { id: Number(id) }
      });
      return res.status(200).json({ mensagem: `Pessoa de id:${id} restaurada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params;
    try {
      await database.Pessoas.update(
        { ativo: false },
        { where: { id: Number(estudanteId) } }
      );
      await database.Matriculas.update(
        { status: 'cancelado' },
        { where: { estudante_id: Number(estudanteId) } }
      );
      return res.status(200).json({ mensagem: `Matrículas referente a estudante de id ${estudanteId} canceladas` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTodasAsMatriculasdeUmaPessoa(req, res) {
    const { estudanteId } = req.params;
    try {
      const pessoa = await database.Pessoas.findOne({
        where:
          { id: Number(estudanteId) }
      });
      const matriculas = await pessoa.getAulasMatriculadas();
      return res.status(200).json(matriculas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    try {
      const umaMatricula = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        }
      });
      return res.status(200).json(umaMatricula);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params;
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) };
    try {
      const novaMatriculaCriada = await database.Matriculas.create(novaMatricula);
      return res.status(201).json(novaMatriculaCriada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    const novasInfos = req.body;
    try {
      await database.Matriculas.update(novasInfos, {
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        }
      });
      const matriculaAtualizada = await database.Matriculas.findOne({ where: { id: Number(matriculaId) } });
      return res.status(200).json(matriculaAtualizada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params;
    try {
      await database.Matriculas.destroy({ where: { id: Number(matriculaId), } });
      return res.status(200).json({ mensagem: `Matricula de id:${matriculaId} deletada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async restauraMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    try {
      await database.Matriculas.restore({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        }
      });
      return res.status(200).json({ mensagem: `Matrícula de id:${matriculaId} restaurada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params;
    try {
      const todasAsMatriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: Number(turmaId),
          status: 'confirmado',
        },
        limit: 20,
        order: [['estudante_id', 'DESC']]
      });
      return res.status(200).json(todasAsMatriculas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2;
    try {
      const turmasLotadas = await database.Matriculas.findAndCountAll({
        where: {
          status: 'confirmado',
        },
        attributes: ['turma_id'],
        group: ['turma_id'],
        having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
      });
      return res.status(200).json(turmasLotadas.count);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }
}

module.exports = PessoaController;
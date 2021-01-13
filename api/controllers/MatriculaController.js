const database = require('../models');
const Sequelize = require('sequelize');

const { MatriculasServices } = require('../services');
const matriculasServices = new MatriculasServices();

class MatriculaController {
  static async pegaUmaMatricula(req, res) { 
    const { estudanteId, matriculaId } = req.params;
    try {
      const umaMatricula = await matriculasServices
        .pegaUmRegistro({id: matriculaId, estudante_id: estudanteId});
      return res.status(200).json(umaMatricula);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params;
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) };
    try {
      const novaMatriculaCriada = await matriculasServices.criaRegistro(novaMatricula);
      return res.status(201).json(novaMatriculaCriada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    const novasInfos = req.body;
    try {
      await matriculasServices.atualizaRegistros(novasInfos, 
        {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        }
      );
      const matriculaAtualizada = await matriculasServices.pegaUmRegistro({ id: Number(matriculaId) });
      return res.status(200).json(matriculaAtualizada);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params;
    try {
      await matriculasServices.apagaRegistro(matriculaId);
      return res.status(200).json({ mensagem: `Matricula de id:${matriculaId} deletada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async restauraMatricula(req, res) {
    const { matriculaId } = req.params;
    try {
      await matriculasServices.restauraRegistro(matriculaId);
      return res.status(200).json({ mensagem: `Matrícula de id:${matriculaId} restaurada` });
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params;
    try {
      const todasAsMatriculas = await matriculasServices
        .encontraEContaRegistros(
          {
            turma_id: Number(turmaId),
            status: 'confirmado',
          },
          { 
            limit: 20,
            order: [['estudante_id', 'DESC']]
          }
        );
      return res.status(200).json(todasAsMatriculas);
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2;
    try {
      const turmasLotadas = await matriculasServices.encontraEContaRegistros(
        {
          status: 'confirmado',
        },
        {
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

module.exports = MatriculaController;
import { Router, Request, Response } from 'express';
import ExerciciosService from '../services/ExerciciosService';
import { authMiddleware } from '../config/authMiddleware';
import TreinoService from '../services/TreinoService';
import CloudinaryService from '../services/CloudinaryService'
import upload from "../config/upload"
import path from 'path';

const exercicioRouter = Router();

exercicioRouter.post('/salvar-exercicio',upload.single("image") ,authMiddleware, async (req: Request, res: Response) => {
    try {
        let imageUrl = req.body.image; 

        if (req.file) {
          const filePath =  path.resolve(req.file.path);
          const uploadResult = await CloudinaryService.uploadImage(filePath);
          imageUrl = uploadResult; 
        }

        const { nome,comoExexutar} = req.body;
        const novoExercicio = await ExerciciosService.salvarExercicio(nome,imageUrl,comoExexutar,req.body.treino);
        return res.status(201).json(novoExercicio);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Erro ao criar o exercício.' });
    }
});
 
exercicioRouter.get('/exercicios', async (req: Request, res: Response) => {
    try {
        const exercicios = await ExerciciosService.listarExercicios()
        return res.status(200).json(exercicios);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar os exercícios.' });
    }
});

exercicioRouter.put('/alterar-exercicio/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, gif, comoExexutar } = req.body;


        const exercicio = await ExerciciosService.alterarExercicio(parseInt(id), nome, gif, comoExexutar);
        
        if (!exercicio) {
            return res.status(404).json({ error: 'Exercício não encontrado.' });
        }
        console.log(exercicio.treino?.id)

        return res.status(200).json(exercicio);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Erro ao alterar o exercício.' });
    }
});

exercicioRouter.delete('/deletar-exercicio/:id',authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ExerciciosService.deletarExercicio(parseInt(id));
        if (!result) {
            return res.status(404).json({ error: 'Exercício não encontrado.' });
        }
        return res.status(200).json({ message: 'Exercício deletado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar o exercício.' });
    }
});
 
export default exercicioRouter;

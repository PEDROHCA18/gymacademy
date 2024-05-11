import { Router, Request, Response } from 'express';
import TreinoService from '../services/TreinoService';
import { authMiddleware } from '../config/authMiddleware';

const treinoRouter = Router();

treinoRouter.post('/salvar-treino',authMiddleware, async (req: Request, res: Response) => {
    try {
        const { nome } = req.body;
        const novoTreino = await TreinoService.salvarTreino( nome, req.body.userId);
        return res.status(200).json(novoTreino);
    } catch (error) {
       return res.status(500).json({ message: error });
    }
});

treinoRouter.get('/treinos', async (req: Request, res: Response) => {
    try {
        const treinos = await TreinoService.listarTreinos();
       return res.status(200).json(treinos);
    } catch (error) {
       return res.status(500).json({ message: error });
    }
});

treinoRouter.put('/alterar-treino/:id',authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {  nome} = req.body;
        const treino = await TreinoService.alterarTreino(parseInt(id),  nome);
        if (!treino) {
          return  res.status(404).json({ message: 'Treino não encontrado.' });
            
        }
        const pegarExerciciosID = treino.exercicios.map((exercicio) => {
            return exercicio.id
        })
       const ids =  await TreinoService.removerExercicios(treino.id,pegarExerciciosID)
       if(ids){
        return res.status(200).json(treino);

       }
    } catch (error) {
       return res.status(500).json({ message: error });
    }
});

treinoRouter.delete('/deletar-treino/:id',authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await TreinoService.deletarTreino(parseInt(id));
        if (!result) {
          return  res.status(404).json({ message: 'Treino não encontrado.' });
            
        }
       return res.json({ message: 'Treino deletado com sucesso.' });
    } catch (error) {
       return res.status(500).json({ message: error });
    }
});


export default treinoRouter;

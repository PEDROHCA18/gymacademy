import { Exercicio } from "../models/Exercicios";
import { db } from '../config/database';

class ExercicioService {
    private exercicioRepository = db.getRepository(Exercicio);

    public async salvarExercicio(nome: string, gif:string,comoExexutar:string, treinoId: number): Promise<Exercicio | null> {
        try {
            const novoExercicio = this.exercicioRepository.create({
                nome,
                gif,
                comoExexutar,
                treino: { id: treinoId },
            });

            await this.exercicioRepository.save(novoExercicio);

            return novoExercicio;
        } catch (error) {
            throw new Error('Erro ao salvar o exercício!' + error);
        }
    }

    public async listarExercicios(): Promise<Exercicio[] | null> {
        try {
            const exercicios = await this.exercicioRepository.find();
            return exercicios;
        } catch (error) {
            throw new Error('Erro ao listar os exercícios do treino!' + error);
        }
    }

    public async alterarExercicio(id: number, nome: string, gif:string,comoExexutar:string): Promise<Exercicio | null> {
        try {
            let exercicio = await this.exercicioRepository.findOne({ where: { id } });

            if (!exercicio) {
                return null;
            }

            exercicio.nome = nome;
            exercicio.gif = gif;
            exercicio.comoExexutar = comoExexutar

            await this.exercicioRepository.save(exercicio);

            return exercicio;
        } catch (error) {
            throw new Error('Erro ao alterar o exercício!' + error);
        }
    }

    public async deletarExercicio(id: number): Promise<boolean> {
        try {
            const result = await this.exercicioRepository.delete(id);

            return result.affected === 1;
        } catch (error) {
            throw new Error('Erro ao deletar o exercício!' + error);
        }
    }
   
}

export default new ExercicioService();

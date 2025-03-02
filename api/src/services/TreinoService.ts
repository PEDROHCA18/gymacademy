import { Treino } from '../models/Treino';
import { db } from '../config/database';
import { Exercicio } from "../models/Exercicios";
import { In } from 'typeorm';

class TreinoService {
    private treinoRepository = db.getRepository(Treino);
    private exercicioRepository = db.getRepository(Exercicio);

    public async salvarTreino(nome: string, userId: number): Promise<Treino | null> {
        try {
            const novoTreino = this.treinoRepository.create({
                nome,
                usuario: { id: userId },
            });

            await this.treinoRepository.save(novoTreino);

            return novoTreino;
        } catch (error) {
            throw new Error('Erro ao salvar o treino!' + error);
        }
    }

    public async listarTreinos(): Promise<Treino[] | null> {
        try {
            const treinos = await this.treinoRepository.find();
            return treinos;
        } catch (error) {
            throw new Error('Erro ao listar os treinos!' + error);
        }
    }

    public async alterarTreino(id: number, nome: string): Promise<Treino | null> {
        try {
            let treino = await this.treinoRepository.findOne({ where: { id } });

            if (!treino) {
                return null;
            }
            treino.nome = nome;
       

            await this.treinoRepository.save(treino);

            return treino;
        } catch (error) {
            throw new Error('Erro ao alterar o treino!' + error);
        }
    }
    
    public async deletarTreino(id: number): Promise<boolean> {
        try {
            const result = await this.treinoRepository.delete(id);

            return result.affected === 1;
        } catch (error) {
            throw new Error('Erro ao deletar o treino!' + error);
        }
    }
    async removerExercicios(treinoId: number, exerciciosIds: number[]):Promise<Treino> {
        const treino = await this.treinoRepository.findOneOrFail({
            where: { id:treinoId },
            relations: ["exercicios"]
        });
    
        if (!treino || !treino.exercicios) {
            throw new Error("Treinos ou Exercicios não encontrados");
        }
        treino.exercicios = treino.exercicios.filter(exercicio => !exerciciosIds.includes(exercicio.id));
    
       return await this.treinoRepository.save(treino);
    }
    public async adicionarExercicios(treinoId: number, exerciciosIds: number[]): Promise<Treino> {
        try {
            // Encontrar o treino pelo ID
            const treino = await this.treinoRepository.findOneOrFail({
                where: { id: treinoId },
                relations: ["exercicios"]
            });
    
            if (!treino) {
                throw new Error("Treino não encontrado");
            }
    
            // Encontrar os exercícios pelos IDs fornecidos
            const exercicios = await this.exercicioRepository.find({
                where: { id: In(exerciciosIds) }
            });
    
            // Adicionar os exercícios ao treino
            treino.exercicios.push(...exercicios);
    
            // Salvar o treino com os novos exercícios associados
            return await this.treinoRepository.save(treino);
        } catch (error) {
            throw new Error('Erro ao adicionar os exercícios ao treino!' + error);
        }
    }
    public async listarExerciciosPorNomeDoTreino(nomeDoTreino: string): Promise<Exercicio[] | []> {
        try {
            const treino = await this.treinoRepository.findOne({
                where: { nome: nomeDoTreino },
                relations: ['exercicios']
            });
 
            if (!treino) {
                return [];
            }

            return treino.exercicios;
        } catch (error) {
            throw new Error('Erro ao listar os exercícios pelo nome do treino!' + error);
        }
    }
}

export default new TreinoService();

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Treino } from './Treino';

interface IExercicio {
    id: number;
    nome: string;
    gif: string;
    comoExexutar: string
}
 
@Entity('Exercicio')
export class Exercicio implements IExercicio {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nome: string;
    
    @Column({ default: 'sem-imagem.png' }) 
    gif: string;
    
    @Column()
    comoExexutar: string;

    @ManyToOne(() => Treino, treino => treino.exercicios) 
    treino: Treino;

} 
  
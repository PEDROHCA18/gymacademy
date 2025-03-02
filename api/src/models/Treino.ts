import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { Exercicio } from './Exercicios';

interface ITreino {
    id: number;
    nome: string;
}

@Entity('Treino')
export class Treino implements ITreino {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nome: string;

    @ManyToOne(() => Usuario, usuario => usuario.treinos,{onDelete:"CASCADE"})
    usuario: Usuario;

    @OneToMany(() => Exercicio, exercicio => exercicio.treino) 
    exercicios: Exercicio[];
 
}

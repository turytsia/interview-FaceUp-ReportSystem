import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum Category {
    BULLYING = 'BULLYING',
    PROBLEMS_AT_HOME = 'PROBLEMS_AT_HOME',
    LEARNING_DIFFICULTIES = 'LEARNING_DIFFICULTIES',
    SOMETHING_ELSE = 'SOMETHING_ELSE',
}

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Category,
    })
    category: Category;

    @Column({
        type: 'varchar',
        length: 255,
    })
    whoNeedsHelp: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    class: string;

    @Column({
        type: 'text',
    })
    details: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    filePath: string;
}

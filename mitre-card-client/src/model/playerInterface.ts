import {AttackCard, DefenceCard, Card} from './card';
// import { mitre } from '..';

export default interface Player {
    name: string;
    _id: string;
    hand: Array<Card>
    /** False for defender, True for attacker */
    role: boolean;
    /** Additional role for bot player */
    isBot: boolean;
    resources: number;
    progress: Array<Boolean>;
    persistentProgress: Array<Boolean>;
}

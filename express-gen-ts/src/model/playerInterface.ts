import {AttackCard, DefenceCard, Card} from './card';

export default interface Player {
    name: string;
    _id: string;
    hand: Array<Card>
    /** False for defender, True for attacker */
    role: boolean;
    /** Additional role for bot player */
    isBot: boolean;
    resources: number;

}

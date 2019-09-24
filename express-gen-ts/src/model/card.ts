import {mitre} from '../index'

class Card {
    faceup:boolean

    constructor(faceup:boolean){
        this.faceup = faceup
    }
}

/**
 * Tactic is column, technique is individual element.
 */
class AttackCard extends Card{
    tactic:string
    technique:string
    description:string
    mitigatingSources:Array<string>

    constructor(tactic:string,technique:string,description:string,mitigatingSources:Array<string>){
        super(true)
        this.tactic = tactic
        this.technique = technique
        this.description = description
        this.mitigatingSources = mitigatingSources
    }
}

class DefenceCard extends Card{
    dataSource:string

    constructor(dataSource:string){
        super(true)
        this.dataSource = dataSource
    }

    
}

export {AttackCard as AttackCard,
        DefenceCard as DefenceCard,
        Card as Card}
import mongoose, { Schema } from 'mongoose';

//  Initialise with initialaccess as true
export const ProgressSchema = new mongoose.Schema({
    'initial-access' : {type: Boolean, default: true, required: true},
    'execution' : {type: Boolean, default: false, required: true},
    'persistence': {type: Boolean, default: false, required: true},
    'privilege-escalation': {type: Boolean, default: false, required: true},
    'defense-evasion': {type: Boolean, default: false, required: true},
    'credential-access': {type: Boolean, default: false, required: true},
    'discovery': {type: Boolean, default: false, required: true},
    'lateral-movement': {type: Boolean, default: false, required: true},
    'collecting': {type: Boolean, default: false, required: true},
    'command-and-control': {type: Boolean, default: false, required: true},
    'exfiltration': {type: Boolean, default: false, required: true},
    'impact': {type: Boolean, default: false, required: true},
});

// export const ProgressModel = mongoose.model('Progress', ProgressSchema);
